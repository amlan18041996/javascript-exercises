import { MiniPrisma } from './index.js';

// ─── Schema Definition ────────────────────────────────────────────────
// The generic type parameter provides full type safety across all queries

type Database = {
  users: {
    id: number;
    name: string;
    email: string;
    age?: number;
    role: 'admin' | 'user' | 'moderator';
  };
  posts: {
    id: number;
    title: string;
    content: string;
    authorId: number;
    published: boolean;
  };
};

const db = new MiniPrisma<Database>(':memory:');

// ─── Example 1: Fluent Select with this typing ────────────────────────
// Demonstrates: `this` return type enables unlimited method chaining

console.log('\n\x1b[36m─── Example 1: Fluent Select with `this` typing ───\x1b[0m');

const allUsers = db
  .selectFrom('users')
  .where('role', '=', 'admin')
  .orWhere('role', '=', 'moderator')
  .orderBy('name', 'ASC')
  .limit(10)
  .execute();

console.log('  → Return type: full user row');
console.log(`  → Result: ${allUsers.length} users`);

// ─── Example 2: Conditional Return Types ──────────────────────────────
// Demonstrates: calling .select() changes the return type via conditional types

console.log('\n\x1b[36m─── Example 2: Conditional Return Types ───\x1b[0m');

const namesOnly = db
  .selectFrom('users')
  .where('age', '>', 18)
  .select('name', 'email')
  .execute();

console.log('  → Return type: Pick<users, \'name\' | \'email\'>');
console.log(`  → Result: ${namesOnly.length} users (name + email only)`);

// ─── Example 3: Single result with .first() ──────────────────────────
// Demonstrates: .first() returns a single item or undefined (conditional)

console.log('\n\x1b[36m─── Example 3: First / Single Result ───\x1b[0m');

const firstUser = db
  .selectFrom('users')
  .where('id', '=', 1)
  .first();

console.log(`  → Return type: user row | undefined`);
console.log(`  → Result: ${firstUser ? JSON.stringify(firstUser) : 'not found'}`);

// ─── Example 4: Insert with values ────────────────────────────────────

console.log('\n\x1b[36m─── Example 4: INSERT ───\x1b[0m');

const insertResult = db
  .insertInto('users')
  .values({ name: 'Bob', email: 'bob@example.com', age: 25, role: 'user' })
  .execute();

console.log(`  → Insert ID: ${insertResult.insertId}`);

// ─── Example 5: Update with fluent chaining ──────────────────────────

console.log('\n\x1b[36m─── Example 5: UPDATE ───\x1b[0m');

const updateResult = db
  .update('users')
  .set({ name: 'Robert', role: 'admin' })
  .where('id', '=', 1)
  .execute();

console.log(`  → Affected rows: ${updateResult.affectedRows}`);

// ─── Example 6: Delete with where ─────────────────────────────────────

console.log('\n\x1b[36m─── Example 6: DELETE ───\x1b[0m');

const deleteResult = db
  .deleteFrom('users')
  .where('role', '=', 'moderator')
  .execute();

console.log(`  → Affected rows: ${deleteResult.affectedRows}`);

// ─── Example 7: Multi-table schema ────────────────────────────────────

console.log('\n\x1b[36m─── Example 7: Multi-table queries ───\x1b[0m');

const recentPosts = db
  .selectFrom('posts')
  .where('published', '=', true)
  .select('title', 'authorId')
  .orderBy('id', 'DESC')
  .limit(5)
  .execute();

console.log('  → Return type: Pick<posts, \'title\' | \'authorId\'>');
console.log(`  → Result: ${recentPosts.length} recent posts`);

function main() {
  console.log('\n\x1b[32mAll Mini-Prisma examples completed.\x1b[0m\n');
}

main();
