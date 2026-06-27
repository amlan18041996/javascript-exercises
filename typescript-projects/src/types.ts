declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

export type Validated<T> = Brand<T, 'Validated'>;

export const SchemaType = {
  String: 'string',
  Number: 'number',
  Boolean: 'boolean',
  Object: 'object',
  Array: 'array',
  Optional: 'optional',
  Union: 'union',
  Literal: 'literal',
  Enum: 'enum',
  Nullable: 'nullable',
} as const;

type SchemaTypeValue = (typeof SchemaType)[keyof typeof SchemaType];

interface BaseSchema<Kind extends SchemaTypeValue> {
  kind: Kind;
}

export interface StringSchema extends BaseSchema<typeof SchemaType.String> {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}
export interface NumberSchema extends BaseSchema<typeof SchemaType.Number> {
  min?: number;
  max?: number;
  integer?: boolean;
}
export interface BooleanSchema extends BaseSchema<typeof SchemaType.Boolean> {}

export interface ObjectSchema {
  kind: typeof SchemaType.Object;
  properties: Record<string, Schema>;
  strict?: boolean;
}

export interface ArraySchema {
  kind: typeof SchemaType.Array;
  item: Schema;
  minLength?: number;
  maxLength?: number;
}

export interface OptionalSchema {
  kind: typeof SchemaType.Optional;
  inner: Schema;
}

export interface UnionSchema {
  kind: typeof SchemaType.Union;
  variants: Schema[];
}

export interface LiteralSchema<T extends string | number | boolean = string | number | boolean> {
  kind: typeof SchemaType.Literal;
  value: T;
}

export interface EnumSchema<T extends string = string> {
  kind: typeof SchemaType.Enum;
  values: readonly T[];
}

export interface NullableSchema {
  kind: typeof SchemaType.Nullable;
  inner: Schema;
}

export type Schema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | ObjectSchema
  | ArraySchema
  | OptionalSchema
  | UnionSchema
  | LiteralSchema
  | EnumSchema
  | NullableSchema;

type InferArray<S extends ArraySchema> = InferSchemaType<S['item']>[];
type InferOptional<S extends OptionalSchema> = InferSchemaType<S['inner']> | undefined;
type InferNullable<S extends NullableSchema> = InferSchemaType<S['inner']> | null;

export type InferSchemaType<S extends Schema> =
  S extends StringSchema ? string :
  S extends NumberSchema ? number :
  S extends BooleanSchema ? boolean :
  S extends LiteralSchema<infer T> ? T :
  S extends EnumSchema<infer T> ? T :
  S extends ArraySchema ? InferArray<S> :
  S extends ObjectSchema ? Record<string, unknown> :
  S extends OptionalSchema ? InferOptional<S> :
  S extends NullableSchema ? InferNullable<S> :
  S extends UnionSchema ? unknown :
  never;

export type ValidationResult<T> =
  | { success: true; data: Validated<T> }
  | { success: false; errors: string[] };
