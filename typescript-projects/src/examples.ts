import {
  string,
  number,
  boolean,
  object,
  array,
  optional,
  literal,
  enumeration,
  union,
  nullable,
  validate,
  type Validated,
} from './index.js';

// ─── Example 1: User Profile ──────────────────────────────────────────
// Demonstrates: branded types (Validated<T>), recursive types (nested object/array), conditional types (InferSchemaType maps schema → TS type)

const addressSchema = object({
  street: string(),
  city: string(),
  zip: optional(string()),
});

const roleSchema = enumeration(['admin', 'user', 'moderator'] as const);

const userSchema = object({
  id: number({ integer: true }),
  name: string({ minLength: 1, maxLength: 100 }),
  email: string({ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
  age: optional(number({ min: 0, max: 150 })),
  role: roleSchema,
  tags: array(string(), { minLength: 0 }),
  address: addressSchema,
  metadata: nullable(object({
    lastLogin: string(),
    isVerified: boolean(),
  })),
});

const validInput = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
  role: 'admin',
  tags: ['dev', 'ts'],
  address: { street: '123 Main St', city: 'Springfield' },
  metadata: { lastLogin: '2025-01-01', isVerified: true },
};

const result1 = validate(userSchema, validInput);
if (result1.success) {
  // result1.data is branded as Validated<User> — nominal typing at work
  const user = result1.data as unknown as {
    id: number; name: string; email: string; role: string;
    tags: string[]; address: { street: string; city: string; zip?: string };
    age?: number; metadata: { lastLogin: string; isVerified: boolean } | null;
  };
  console.log('✓ User validated:', user.name, `(${user.role})`);
} else {
  console.log('✗ User errors:', result1.errors);
}

// ─── Example 2: Union / Tagged Union ──────────────────────────────────
// Demonstrates: union schemas and conditional inference

const circleSchema = object({
  type: literal('circle'),
  radius: number({ min: 0 }),
});

const rectSchema = object({
  type: literal('rectangle'),
  width: number({ min: 0 }),
  height: number({ min: 0 }),
});

const shapeSchema = union(circleSchema, rectSchema);

const shapeResult = validate(shapeSchema, { type: 'circle', radius: 5 });
if (shapeResult.success) {
  const shape = shapeResult.data as unknown as { type: 'circle'; radius: number } | { type: 'rectangle'; width: number; height: number };
  switch (shape.type) {
    case 'circle':
      console.log(`✓ Circle area: ${Math.PI * shape.radius ** 2}`);
      break;
    case 'rectangle':
      console.log(`✓ Rectangle area: ${shape.width * shape.height}`);
      break;
  }
}

// ─── Example 3: Nested arrays (recursive types) ───────────────────────
// Recursive schemas validated at runtime; InferSchemaType recursively maps schema kinds
const nestedSchema = object({
  matrix: array(array(number())),
  tree: object({
    value: string(),
    children: array(object({
      value: string(),
      children: array(object({
        value: string(),
      })),
    })),
  }),
});

const nestedResult = validate(nestedSchema, {
  matrix: [[1, 2], [3, 4]],
  tree: {
    value: 'root',
    children: [
      { value: 'a', children: [{ value: 'a1' }, { value: 'a2' }] },
      { value: 'b', children: [] },
    ],
  },
});

if (nestedResult.success) {
  const data = nestedResult.data as unknown as { matrix: number[][]; tree: { value: string; children: { value: string; children: { value: string }[] }[] } };
  console.log('✓ Nested validated, matrix[0][1] =', data.matrix[0][1]);
}

// ─── Example 4: Error reporting ───────────────────────────────────────
const badInput = {
  id: 'not-a-number',
  name: '',
  email: 'bad-email',
  role: 'superadmin',
  tags: 'not-an-array',
  address: null,
};

const badResult = validate(userSchema, badInput);
if (!badResult.success) {
  console.log('✗ Validation errors:');
  badResult.errors.forEach((e) => console.log('  -', e));
}

// ─── Example 5: Strict mode ───────────────────────────────────────────
const strictSchema = object({
  name: string(),
  age: number(),
}, true);

const extraInput = { name: 'Bob', age: 25, extra: 'field' };
const strictResult = validate(strictSchema, extraInput);
if (!strictResult.success) {
  console.log('✗ Strict mode caught extra field:', strictResult.errors[0]);
}

// ─── Example 6: Branded type utility ──────────────────────────────────
// Branded types ensure validated data can't be mixed with unvalidated data
const raw: Record<string, unknown> = { name: 'Eve', age: 28 };
const validated = validate(strictSchema, raw);
if (validated.success) {
  // Branded output — only obtainable through validation
  const branded = validated.data as unknown as Validated<{ name: string; age: number }>;
  console.log('✓ Branded data through validation:', branded);
}

function main() {
  console.log('\nAll examples completed.');
}
main();
