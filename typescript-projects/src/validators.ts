import {
  type Schema,
  type StringSchema,
  type NumberSchema,
  type BooleanSchema,
  type ObjectSchema,
  type ArraySchema,
  type OptionalSchema,
  type UnionSchema,
  type LiteralSchema,
  type EnumSchema,
  type NullableSchema,
  SchemaType,
  type InferSchemaType,
  type ValidationResult,
  type Validated,
} from './types.js';

export function string(opts?: Omit<StringSchema, 'kind'>): StringSchema {
  return { kind: SchemaType.String, ...opts };
}

export function number(opts?: Omit<NumberSchema, 'kind'>): NumberSchema {
  return { kind: SchemaType.Number, ...opts };
}

export function boolean(): BooleanSchema {
  return { kind: SchemaType.Boolean };
}

export function object(
  properties: Record<string, Schema>,
  strict?: boolean,
): ObjectSchema {
  return { kind: SchemaType.Object, properties, strict };
}

export function array(
  item: Schema,
  opts?: Omit<ArraySchema, 'kind' | 'item'>,
): ArraySchema {
  return { kind: SchemaType.Array, item, ...opts };
}

export function optional(inner: Schema): OptionalSchema {
  return { kind: SchemaType.Optional, inner };
}

export function literal<T extends string | number | boolean>(
  value: T,
): LiteralSchema<T> {
  return { kind: SchemaType.Literal, value };
}

export function enumeration<T extends string>(
  values: readonly T[],
): EnumSchema<T> {
  return { kind: SchemaType.Enum, values };
}

export function union(...variants: Schema[]): UnionSchema {
  return { kind: SchemaType.Union, variants };
}

export function nullable(inner: Schema): NullableSchema {
  return { kind: SchemaType.Nullable, inner };
}

function addError(errors: string[], path: string, message: string): void {
  errors.push(`${path}: ${message}`);
}

function validateValue(
  value: unknown,
  schema: Schema,
  path: string,
  errors: string[],
): unknown {
  switch (schema.kind) {
    case SchemaType.String: {
      if (typeof value !== 'string') {
        addError(errors, path, 'expected a string');
        return undefined;
      }
      if (schema.minLength !== undefined && value.length < schema.minLength) {
        addError(errors, path, `must be at least ${schema.minLength} characters`);
        return undefined;
      }
      if (schema.maxLength !== undefined && value.length > schema.maxLength) {
        addError(errors, path, `must be at most ${schema.maxLength} characters`);
        return undefined;
      }
      if (schema.pattern && !schema.pattern.test(value)) {
        addError(errors, path, 'does not match required pattern');
        return undefined;
      }
      return value;
    }

    case SchemaType.Number: {
      if (typeof value !== 'number' || isNaN(value)) {
        addError(errors, path, 'expected a number');
        return undefined;
      }
      if (schema.min !== undefined && value < schema.min) {
        addError(errors, path, `must be at least ${schema.min}`);
        return undefined;
      }
      if (schema.max !== undefined && value > schema.max) {
        addError(errors, path, `must be at most ${schema.max}`);
        return undefined;
      }
      if (schema.integer && !Number.isInteger(value)) {
        addError(errors, path, 'must be an integer');
        return undefined;
      }
      return value;
    }

    case SchemaType.Boolean: {
      if (typeof value !== 'boolean') {
        addError(errors, path, 'expected a boolean');
        return undefined;
      }
      return value;
    }

    case SchemaType.Literal: {
      if (value !== schema.value) {
        addError(errors, path, `expected literal ${JSON.stringify(schema.value)}`);
        return undefined;
      }
      return value;
    }

    case SchemaType.Enum: {
      if (!schema.values.includes(value as never)) {
        addError(errors, path, `expected one of ${schema.values.join(', ')}`);
        return undefined;
      }
      return value;
    }

    case SchemaType.Array: {
      if (!Array.isArray(value)) {
        addError(errors, path, 'expected an array');
        return undefined;
      }
      if (schema.minLength !== undefined && value.length < schema.minLength) {
        addError(errors, path, `must have at least ${schema.minLength} items`);
        return undefined;
      }
      if (schema.maxLength !== undefined && value.length > schema.maxLength) {
        addError(errors, path, `must have at most ${schema.maxLength} items`);
        return undefined;
      }
      const result: unknown[] = [];
      for (let i = 0; i < value.length; i++) {
        const item = validateValue(value[i], schema.item, `${path}[${i}]`, errors);
        if (item !== undefined) {
          result.push(item);
        } else {
          return undefined;
        }
      }
      return result;
    }

    case SchemaType.Object: {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        addError(errors, path, 'expected an object');
        return undefined;
      }
      const input = value as Record<string, unknown>;
      const result: Record<string, unknown> = {};

      if (schema.strict) {
        for (const key of Object.keys(input)) {
          if (!(key in schema.properties)) {
            addError(errors, path, `unexpected key "${key}"`);
            return undefined;
          }
        }
      }

      for (const [key, propSchema] of Object.entries(schema.properties)) {
        const propPath = path ? `${path}.${key}` : key;
        if (key in input) {
          const validated = validateValue(input[key], propSchema, propPath, errors);
          if (validated === undefined) {
            return undefined;
          }
          result[key] = validated;
        } else if (propSchema.kind === SchemaType.Optional) {
          continue;
        } else if (propSchema.kind === SchemaType.Nullable) {
          continue;
        } else {
          addError(errors, propPath, 'is required');
          return undefined;
        }
      }
      return result;
    }

    case SchemaType.Optional: {
      if (value === undefined) return undefined;
      return validateValue(value, schema.inner, path, errors);
    }

    case SchemaType.Nullable: {
      if (value === null) return null;
      return validateValue(value, schema.inner, path, errors);
    }

    case SchemaType.Union: {
      const unionErrors: string[] = [];
      for (const variant of schema.variants) {
        const localErrors: string[] = [];
        const result = validateValue(value, variant, path, localErrors);
        if (localErrors.length === 0) {
          return result;
        }
        unionErrors.push(...localErrors);
      }
      errors.push(...unionErrors);
      return undefined;
    }

    default:
      addError(errors, path, 'unknown schema type');
      return undefined;
  }
}

export function validate<S extends Schema>(
  schema: S,
  value: unknown,
): ValidationResult<InferSchemaType<S>> {
  const errors: string[] = [];
  const result = validateValue(value, schema, '.', errors);
  if (errors.length > 0) {
    return { success: false, errors };
  }
  return { success: true, data: result as Validated<InferSchemaType<S>> };
}
