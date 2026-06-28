let SQL = null;
let db = null;
let demoContainer = null;

const TABLES = {
  users: { id: 'INTEGER PRIMARY KEY AUTOINCREMENT', name: 'TEXT NOT NULL', email: 'TEXT NOT NULL', age: 'INTEGER', role: 'TEXT NOT NULL DEFAULT \'user\'' },
  posts: { id: 'INTEGER PRIMARY KEY AUTOINCREMENT', title: 'TEXT NOT NULL', content: 'TEXT NOT NULL', authorId: 'INTEGER NOT NULL', published: 'INTEGER NOT NULL DEFAULT 0' },
};

function createTables() {
  for (const [name, cols] of Object.entries(TABLES)) {
    const defs = Object.entries(cols).map(([col, type]) => `${col} ${type}`).join(', ');
    db.run(`CREATE TABLE IF NOT EXISTS ${name} (${defs})`);
  }
}

const SEED_USERS = [
  { name: 'Alice', email: 'alice@example.com', age: 30, role: 'admin' },
  { name: 'Bob', email: 'bob@example.com', age: 25, role: 'user' },
  { name: 'Charlie', email: 'charlie@example.com', age: 35, role: 'moderator' },
  { name: 'Diana', email: 'diana@example.com', age: 28, role: 'user' },
  { name: 'Eve', email: 'eve@example.com', age: 22, role: 'guest' },
];

const SEED_POSTS = [
  { title: 'Getting Started with TypeScript', content: 'TypeScript adds static type checking...', authorId: 1, published: 1 },
  { title: 'SQLite for Beginners', content: 'SQLite is a lightweight database...', authorId: 2, published: 1 },
  { title: 'Advanced ORM Patterns', content: 'Building type-safe query builders...', authorId: 1, published: 0 },
  { title: 'Draft Notes', content: 'Some draft content...', authorId: 3, published: 0 },
];

function seedData() {
  db.run('DELETE FROM users');
  db.run('DELETE FROM posts');
  for (const u of SEED_USERS) {
    db.run(`INSERT INTO users (name, email, age, role) VALUES (?, ?, ?, ?)`, [u.name, u.email, u.age, u.role]);
  }
  for (const p of SEED_POSTS) {
    db.run(`INSERT INTO posts (title, content, authorId, published) VALUES (?, ?, ?, ?)`, [p.title, p.content, p.authorId, p.published]);
  }
}

function query(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const cols = stmt.getColumnNames();
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return { columns: cols, rows };
}

function mutate(sql, params = []) {
  db.run(sql, params);
  return { changes: db.getRowsModified() };
}

function execDemo(sql, params = []) {
  const sqlEl = demoContainer.querySelector('#mp-sql');
  const resultEl = demoContainer.querySelector('#mp-result');
  const timingEl = demoContainer.querySelector('#mp-timing');

  sqlEl.textContent = sql;
  sqlEl.className = 'mp-sql';

  const start = performance.now();

  try {
    const upper = sql.trim().toUpperCase();
    if (upper.startsWith('SELECT') || upper.startsWith('PRAGMA')) {
      const data = query(sql, params);
      const elapsed = ((performance.now() - start) / 1000).toFixed(3);
      timingEl.textContent = `→ ${data.rows.length} row(s) returned in ${elapsed}s`;
      renderTable(resultEl, data.columns, data.rows);
    } else {
      const data = mutate(sql, params);
      const elapsed = ((performance.now() - start) / 1000).toFixed(3);
      timingEl.textContent = `→ ${data.changes} row(s) affected in ${elapsed}s`;
      resultEl.innerHTML = `<div class="mp-success">✓ SQL executed successfully — ${data.changes} row(s) affected</div>`;
    }
  } catch (err) {
    timingEl.textContent = '';
    resultEl.innerHTML = `<div class="mp-error">✗ ${err.message}</div>`;
  }
}

function renderTable(container, columns, rows) {
  if (!rows.length) {
    container.innerHTML = '<div class="mp-empty">(no results)</div>';
    return;
  }
  let html = '<table class="mp-table"><thead><tr>';
  for (const col of columns) html += `<th>${col}</th>`;
  html += '</tr></thead><tbody>';
  for (const row of rows) {
    html += '<tr>';
    for (const col of columns) {
      let val = row[col];
      if (val === null || val === undefined) val = '<span class="mp-null">NULL</span>';
      else if (typeof val === 'number') val = `<span class="mp-number">${val}</span>`;
      html += `<td>${val}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  container.innerHTML = html;
}

const QUERIES = [
  {
    id: 'select-all',
    label: 'Select All Users',
    sql: 'SELECT * FROM users',
    desc: 'Full table scan — returns all columns and rows',
  },
  {
    id: 'select-where',
    label: 'Select Adults',
    sql: "SELECT * FROM users WHERE age > 25 ORDER BY age DESC",
    desc: 'Filtering with WHERE and ORDER BY',
  },
  {
    id: 'select-fields',
    label: 'Select Names Only',
    sql: 'SELECT name, email FROM users WHERE role = \'user\'',
    desc: 'Partial select — only name and email columns',
  },
  {
    id: 'insert',
    label: 'Insert User',
    sql: "INSERT INTO users (name, email, age, role) VALUES ('Frank', 'frank@example.com', 32, 'user')",
    desc: 'INSERT a new row',
  },
  {
    id: 'update',
    label: 'Update Role',
    sql: "UPDATE users SET role = 'admin' WHERE name = 'Bob'",
    desc: 'UPDATE with WHERE filter',
  },
  {
    id: 'delete',
    label: 'Delete Guest',
    sql: "DELETE FROM users WHERE role = 'guest'",
    desc: 'DELETE rows matching a condition',
  },
  {
    id: 'join',
    label: 'Join Posts & Authors',
    sql: `SELECT posts.title, users.name AS author, posts.published
FROM posts
JOIN users ON posts.authorId = users.id
WHERE posts.published = 1
ORDER BY posts.id DESC`,
    desc: 'Multi-table JOIN query',
  },
];

function renderUI() {
  demoContainer.innerHTML = `
    <div class="mp-layout">
      <div class="mp-toolbar">
        ${QUERIES.map(q => `
          <button class="btn primary btn-sm mp-btn" data-query="${q.id}">${q.label}</button>
        `).join('')}
        <button class="btn primary btn-sm mp-btn" id="mp-reset">↻ Reset Data</button>
      </div>
      <div id="mp-desc" class="mp-desc">Click a query button to execute it against SQLite.</div>
      <div class="mp-sql-box">
        <div class="mp-label">SQL</div>
        <pre id="mp-sql" class="mp-sql">—</pre>
      </div>
      <div class="mp-result-box">
        <div class="mp-label">Result</div>
        <div id="mp-timing" class="mp-timing"></div>
        <div id="mp-result" class="mp-result"><div class="mp-empty">Click a query to run it</div></div>
      </div>
    </div>
  `;

  demoContainer.querySelectorAll('.mp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.query;
      if (id === 'mp-reset') {
        seedData();
        execDemo('SELECT * FROM users');
        demoContainer.querySelector('#mp-desc').textContent = '↻ Data reset to defaults.';
        return;
      }
      const q = QUERIES.find(q => q.id === id);
      if (!q) return;
      demoContainer.querySelector('#mp-desc').textContent = q.desc;
      execDemo(q.sql);
    });
  });
}

export async function initMiniPrismaDemo(container) {
  const initSqlJs = (await import('sql.js')).default;
  demoContainer = container;
  SQL = await initSqlJs({ locateFile: file => '/sql-wasm.wasm' });
  db = new SQL.Database();
  createTables();
  seedData();
  renderUI();
  execDemo('SELECT * FROM users');
}
