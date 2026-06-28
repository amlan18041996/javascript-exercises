export const tsProjects = [
    {
        id: 'json-schema-validator',
        category: 'typescript',
        title: 'JSON Schema Validator',
        description: 'A runtime JSON validator built in TypeScript that validates data against schema definitions. Features conditional types (InferSchemaType), recursive types (nested object/array schemas), and branded types (Validated<T> for nominal typing).',
        concepts: ['Conditional Types', 'Recursive Types', 'Branded Types', 'Runtime Validation', 'Discriminated Unions'],
        color: '#3178c6',
        file: 'json-schema-validator',
        instructions: `<strong>Schema API</strong>
<ul>
  <li><code>string(opts?)</code> — validates strings with optional <code>minLength</code>, <code>maxLength</code>, <code>pattern</code></li>
  <li><code>number(opts?)</code> — validates numbers with optional <code>min</code>, <code>max</code>, <code>integer</code></li>
  <li><code>boolean()</code> — validates booleans</li>
  <li><code>object(properties, strict?)</code> — validates objects with per-key schemas</li>
  <li><code>array(item, opts?)</code> — validates arrays by item schema</li>
  <li><code>optional(inner)</code> — marks a value as optional (undefined allowed)</li>
  <li><code>literal(value)</code> — matches exact value</li>
  <li><code>enumeration(values)</code> — matches one of a set of values</li>
  <li><code>union(...variants)</code> — matches any variant schema</li>
  <li><code>nullable(inner)</code> — allows null values</li>
</ul>`,
    },
    {
        id: 'form-validator',
        category: 'typescript',
        title: 'Form Validator',
        description: 'A declarative form validation library built with TypeScript discriminated unions. Define fields with labels and validation rules, then validate form data with human-readable error messages. Supports text, email, password, number, select, and checkbox fields.',
        concepts: ['Discriminated Unions', 'Runtime Validation', 'Declarative API', 'Error Handling', 'Form Processing'],
        color: '#3178c6',
        file: 'form-validator',
        instructions: `<strong>Field API</strong>
<ul>
  <li><code>field.text({ label, required, minLength, maxLength, pattern })</code> — text input</li>
  <li><code>field.email({ label, required })</code> — email with built-in validation</li>
  <li><code>field.password({ label, required, minLength, match })</code> — password with confirmation</li>
  <li><code>field.number({ label, required, min, max, integer })</code> — numeric input</li>
  <li><code>field.select({ label, required, options })</code> — dropdown selection</li>
  <li><code>field.checkbox({ label, required })</code> — checkbox agreement</li>
</ul>
<p>Each field produces meaningful error messages like <em>"Full name is required"</em> or <em>"Please enter a valid email address"</em>.</p>`,
    },
    {
        id: 'mini-prisma',
        category: 'typescript',
        title: 'Type-Safe ORM (Mini-Prisma)',
        description: 'A tiny type-safe query builder for SQLite built with TypeScript. Features fluent interfaces with `this` typing for method chaining and conditional return types based on selected fields.',
        concepts: ['Conditional Return Types', 'Fluent Interfaces with this Typing', 'Generic Constraints', 'Template Literal Types', 'Type-safe SQL'],
        color: '#3178c6',
        file: 'mini-prisma',
        instructions: `<strong>Query Builder API</strong>
<ul>
  <li><code>selectFrom(table)</code> — start a SELECT query</li>
  <li><code>.where(field, op, value)</code> — add a WHERE condition; returns <code>this</code> for chaining</li>
  <li><code>.orWhere(field, op, value)</code> — add an OR WHERE condition</li>
  <li><code>.select(...fields)</code> — narrow return type via conditional types (<code>Pick&lt;T, F&gt;</code>)</li>
  <li><code>.orderBy(field, dir)</code> — add ORDER BY clause</li>
  <li><code>.limit(n) / .offset(n)</code> — pagination</li>
  <li><code>.first()</code> — return single result or undefined</li>
  <li><code>.execute()</code> — build SQL and return typed results</li>
  <li><code>insertInto(table).values(data).execute()</code> — INSERT</li>
  <li><code>update(table).set(data).where(...).execute()</code> — UPDATE</li>
  <li><code>deleteFrom(table).where(...).execute()</code> — DELETE</li>
</ul>`,
    },
];

export const tsStats = {
    projectsDelivered: tsProjects.length,
    conceptsCovered: [...new Set(tsProjects.flatMap(p => p.concepts))].length,
};
