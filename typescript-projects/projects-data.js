export const tsProjects = [
    {
        id: 'json-schema-validator',
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
];

export const tsStats = {
    projectsDelivered: tsProjects.length,
    conceptsCovered: [...new Set(tsProjects.flatMap(p => p.concepts))].length,
};
