import { scrollToTop } from "./utilities/helpers.js";
import { projects, stats } from "./javascript-projects/projects-data.js";
import { tsProjects, tsStats } from "./typescript-projects/projects-data.js";
import { subjects, topicLabels } from "./javascript-projects/about-data.js";
import demos from "./javascript-projects/project-demos.js";

const allProjects = [...projects, ...tsProjects];

const allStats = {
    projectsDelivered: stats.projectsDelivered + tsStats.projectsDelivered,
    conceptsCovered: stats.conceptsCovered + tsStats.conceptsCovered,
    conceptsInProgress: stats.conceptsInProgress,
    upcomingConcepts: stats.upcomingConcepts,
};

/* ===================== NAVIGATION ===================== */

const navLinks = document.querySelectorAll('#main-nav a');
const pages = {
    home: document.querySelector('#page-home'),
    about: document.querySelector('#page-about'),
    projects: document.querySelector('#page-projects'),
};

function getPath(page, subroute) {
    if (page === 'home') return '/';
    if (page === 'projects') return subroute ? `/projects/${subroute}` : '/projects';
    return `/${page}`;
}

function getRouteFromPath(path) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return { page: 'home', subroute: null };
    if (parts[0] === 'projects') return { page: 'projects', subroute: parts[1] || null };
    if (pages[parts[0]]) return { page: parts[0], subroute: null };
    return { page: 'home', subroute: null };
}

function showPage(page, subroute) {
    Object.entries(pages).forEach(([key, el]) => el.classList.toggle('active', key === page));
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === page));

    if (page === 'projects') {
        if (subroute && categoryInfo[subroute]) {
            activateCategory(subroute);
        } else {
            document.querySelector('#project-categories').style.display = '';
            document.querySelector('#projects-layout').style.display = 'none';
            cleanupDemo();
        }
    }
}

function navigate(page, subroute) {
    history.pushState({ page, subroute }, '', getPath(page, subroute));
    showPage(page, subroute);
}

navLinks.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    navigate(a.dataset.page);
}));

window.addEventListener('popstate', () => {
    const { page, subroute } = getRouteFromPath(window.location.pathname);
    showPage(page, subroute);
});

/* ===================== HOME STATS ===================== */

const iconMap = {
    projectsDelivered: { icon: '📦', bg: '#eef2ff' },
    conceptsCovered: { icon: '📚', bg: '#f0fdf4' },
    conceptsInProgress: { icon: '⚙️', bg: '#fffbeb' },
    upcomingConcepts: { icon: '🚀', bg: '#fdf2f8' },
};

function renderStats() {
    const grid = document.querySelector('#stats-grid');
    grid.innerHTML = Object.entries(allStats).map(([key, value]) => `
        <div class="stat-card">
            <div class="stat-icon" style="background:${iconMap[key]?.bg || '#eef2ff'}">${iconMap[key]?.icon || '📊'}</div>
            <div class="stat-number">${value}</div>
            <div class="stat-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
        </div>
    `).join('');
}

/* ===================== PROJECT CATEGORIES & NAVIGATION ===================== */

const categoryInfo = {
    javascript: { title: 'JavaScript' },
    typescript: { title: 'TypeScript' },
    libraries: { title: 'Libraries' },
};

function getProjectCategory(id) {
    const p = allProjects.find(pr => pr.id === id);
    return p ? p.category : null;
}

function renderCategoryCards() {
    for (const [cat] of Object.entries(categoryInfo)) {
        const count = allProjects.filter(p => p.category === cat).length;
        const el = document.getElementById(`count-${cat}`);
        if (el) el.textContent = `${count} projects`;
    }

    document.querySelector('#project-categories').addEventListener('click', e => {
        const card = e.target.closest('.category-card');
        if (card) navigate('projects', card.dataset.category);
    });

    document.querySelector('#back-to-categories').addEventListener('click', () => navigate('projects'));
}

function activateCategory(category) {
    document.querySelector('#project-categories').style.display = 'none';
    const layout = document.querySelector('#projects-layout');
    layout.style.display = '';

    document.querySelector('#sidebar-title').textContent = categoryInfo[category]?.title || 'Projects';

    renderProjectListForCategory(category);

    document.querySelector('#project-placeholder').style.display = '';
    document.querySelector('#project-detail').style.display = 'none';
    cleanupDemo();
}

function backToCategories() {
    document.querySelector('#project-categories').style.display = '';
    document.querySelector('#projects-layout').style.display = 'none';
    cleanupDemo();
}

function renderProjectListForCategory(category) {
    const list = document.querySelector('#project-list');
    const filtered = allProjects.filter(p => p.category === category);
    list.innerHTML = filtered.map(p => `
        <li data-id="${p.id}">
            <span class="dot" style="background:${p.color}"></span>
            ${p.title}
        </li>
    `).join('');
}

/* ===================== PROJECT DETAIL WITH TABS ===================== */

let currentProjectId = null;
let demoInitTracker = {};

function cleanupDemo() {
    currentProjectId = null;
    demoInitTracker = {};
}

function showProject(id) {
    currentProjectId = id;
    document.querySelectorAll('#project-list li').forEach(li =>
        li.classList.toggle('active', li.dataset.id === id));

    const project = allProjects.find(p => p.id === id);
    if (!project) return;

    document.querySelector('#project-placeholder').style.display = 'none';
    const detail = document.querySelector('#project-detail');
    detail.style.display = 'block';
    document.querySelector('#detail-title').textContent = project.title;

    document.querySelector('#detail-desc').textContent = project.description;
    document.querySelector('#detail-concepts').innerHTML =
        project.concepts.map(c => `<span class="concept-tag">${c}</span>`).join('');

    const instrEl = document.querySelector('#detail-instructions');
    if (project.instructions) {
        instrEl.style.display = 'block';
        instrEl.className = 'project-instructions';
        instrEl.innerHTML = project.instructions;
    } else {
        instrEl.style.display = 'none';
    }

    switchTab('details');

    const inner = document.querySelector('#demo-inner');
    const demo = demos[id];
    if (demo) {
        inner.innerHTML = demo.html;
    } else {
        inner.innerHTML = `<p class="text-gray-500 text-center py-8">Demo not available</p>`;
    }
    demoInitTracker[id] = false;

    if (window.innerWidth < 768) {
        document.querySelector('#project-sidebar').scrollIntoView({ behavior: 'smooth' });
    }
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach(p =>
        p.classList.toggle('active', p.id === `tab-${tab}`));

    if (tab === 'demo' && currentProjectId && !demoInitTracker[currentProjectId]) {
        const project = allProjects.find(p => p.id === currentProjectId);
        if (project) {
            const inner = document.querySelector('#demo-inner');
            const demo = demos[project.id];
            if (demo && demo.init) {
                setTimeout(() => {
                    try { Promise.resolve(demo.init(inner)).catch(() => {}); }
                    catch (e) { console.warn('Demo init error:', e); }
                }, 0);
            }
            demoInitTracker[project.id] = true;
        }
    }
}

/* ===================== SEARCH ===================== */

const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');

searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { searchResults.classList.remove('show'); return; }

    const matches = allProjects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.concepts.some(c => c.toLowerCase().includes(q))
    );

    searchResults.innerHTML = matches.length
        ? matches.map(p => `<div class="result-item" data-id="${p.id}">${p.title}</div>`).join('')
        : '<div class="result-item">No results found</div>';

    searchResults.classList.add('show');
});

searchResults?.addEventListener('click', e => {
    const item = e.target.closest('.result-item');
    if (item && item.dataset.id) {
        const cat = getProjectCategory(item.dataset.id);
        navigate('projects', cat);
        showProject(item.dataset.id);
        searchInput.value = '';
        searchResults.classList.remove('show');
    }
});

document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) searchResults?.classList.remove('show');
});

/* ===================== ABOUT ===================== */

function renderSubjectList() {
    const list = document.querySelector('#subject-list');
    list.innerHTML = subjects.map(s => `
        <li data-subject="${s.id}">
            <span>${s.icon}</span>
            ${s.title}
        </li>
    `).join('');
    list.addEventListener('click', e => {
        const li = e.target.closest('li');
        if (li) showSubject(li.dataset.subject);
    });
}

function showSubject(id) {
    document.querySelectorAll('#subject-list li').forEach(li =>
        li.classList.toggle('active', li.dataset.subject === id));
    const subject = subjects.find(s => s.id === id);
    if (!subject) return;

    document.querySelector('#about-placeholder').style.display = 'none';
    const detail = document.querySelector('#about-detail');
    detail.style.display = 'block';

    const sectionsHtml = subject.history.map((_, i) =>
        `<a data-jump="history-${i}">History Pt ${i + 1}</a>`
    ).join('') + '<a data-jump="topics">Topics</a>';

    detail.innerHTML = `
        <div class="subject-header">
            <span style="font-size:1.5rem">${subject.icon}</span>
            <h3>${subject.title}</h3>
            <span class="badge ${subject.badgeClass}">${subject.badge}</span>
        </div>

        <div class="about-inner-nav">
            <a data-jump="intro">Introduction</a>
            ${subject.history.map((_, i) => `<a data-jump="history-${i}">History</a>`).filter((v, i, a) => a.indexOf(v) === i).join('')}
            <a data-jump="topics">Topics</a>
        </div>

        <div id="about-intro">
            <div class="section-title">Introduction</div>
            <p class="intro-text">${subject.introduction}</p>
        </div>

        <div id="about-history">
            <div class="section-title">History</div>
            <div class="history-text">
                ${subject.history.map((p, i) => `<p id="history-${i}">${p}</p>`).join('')}
            </div>
        </div>

        <div id="about-topics">
            <div class="section-title">Topics</div>
            <div class="topics-grid">
                ${Object.entries(subject.topics).map(([level, items]) => `
                    <div class="topic-column">
                        <h4 style="color:${topicLabels[level].color};background:${topicLabels[level].bg}">${topicLabels[level].title}</h4>
                        <ul>
                            ${items.map(t => `<li><strong>${t.name}</strong> — ${t.desc}</li>`).join('')}
                            <li style="color:var(--text-muted);font-style:italic">and more...</li>
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section-links">
            <span style="font-size:0.75rem;color:var(--text-muted);font-weight:500">Jump to:</span>
            ${sectionsHtml}
        </div>
    `;

    detail.querySelectorAll('[data-jump]').forEach(el => {
        el.addEventListener('click', () => {
            const target = document.getElementById(el.dataset.jump);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* ===================== INIT ===================== */

function init() {
    renderCategoryCards();
    renderSubjectList();

    document.querySelector('.project-tabs')?.addEventListener('click', e => {
        const btn = e.target.closest('.tab-btn');
        if (btn) switchTab(btn.dataset.tab);
    });

    document.querySelector('#project-list')?.addEventListener('click', e => {
        const li = e.target.closest('li');
        if (li) showProject(li.dataset.id);
    });

    const { page, subroute } = getRouteFromPath(window.location.pathname);
    showPage(page, subroute);

    window.onscroll = function () {
        const scrollTop = document.getElementById('scroll-top');
        if (!scrollTop) return;
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollTop.classList.remove('hidden');
            scrollTop.classList.add('flex');
        } else {
            scrollTop.classList.remove('flex');
            scrollTop.classList.add('hidden');
        }
    };
    document.getElementById('scroll-top')?.children[0]?.addEventListener('click', scrollToTop);
}

document.addEventListener('DOMContentLoaded', init);
