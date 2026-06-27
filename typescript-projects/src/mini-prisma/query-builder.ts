import type { Op, OrderDir, InsertResult, MutationResult } from './types.js';

type Condition = { op: 'AND' | 'OR'; clause: string };

export class SelectBuilder<T extends Record<string, unknown>, Selected extends keyof T | undefined = undefined> {
  private table: string;
  private conditions: Condition[] = [];
  private orderBys: string[] = [];
  private limitCount?: number;
  private offsetCount?: number;
  private selectedFields?: (keyof T)[];

  constructor(table: string) {
    this.table = table;
  }

  where<K extends keyof T>(field: K, op: Op, value: T[K]): this {
    this.conditions.push({ op: 'AND', clause: `${String(field)} ${op} ${JSON.stringify(value)}` });
    return this;
  }

  orWhere<K extends keyof T>(field: K, op: Op, value: T[K]): this {
    this.conditions.push({ op: 'OR', clause: `${String(field)} ${op} ${JSON.stringify(value)}` });
    return this;
  }

  select<F extends keyof T>(...fields: F[]): SelectBuilder<T, F> {
    this.selectedFields = fields;
    return this as unknown as SelectBuilder<T, F>;
  }

  orderBy(field: keyof T, direction: OrderDir = 'ASC'): this {
    this.orderBys.push(`${String(field)} ${direction}`);
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  offset(count: number): this {
    this.offsetCount = count;
    return this;
  }

  first(): (Selected extends keyof T ? Pick<T, Selected> : T) | undefined {
    this.limitCount = 1;
    const results = this.execute();
    return results[0] as never;
  }

  execute(): (Selected extends keyof T ? Pick<T, Selected> : T)[] {
    const fields = this.selectedFields
      ? this.selectedFields.map(String).join(', ')
      : '*';

    let sql = `SELECT ${fields} FROM ${this.table}`;

    if (this.conditions.length > 0) {
      const first = this.conditions[0]!.clause;
      const rest = this.conditions.slice(1).map(c => `${c.op} ${c.clause}`).join(' ');
      sql += ` WHERE ${first}${rest ? ' ' + rest : ''}`;
    }

    if (this.orderBys.length > 0) {
      sql += ` ORDER BY ${this.orderBys.join(', ')}`;
    }

    if (this.limitCount !== undefined) {
      sql += ` LIMIT ${this.limitCount}`;
    }

    if (this.offsetCount !== undefined) {
      sql += ` OFFSET ${this.offsetCount}`;
    }

    sql += ';';

    console.log(`  [SQL] ${sql}`);
    return [];
  }
}

export class InsertBuilder<T extends Record<string, unknown>> {
  private table: string;
  private data?: Partial<T>;

  constructor(table: string) {
    this.table = table;
  }

  values(data: Partial<T>): this {
    this.data = data;
    return this;
  }

  execute(): InsertResult {
    const keys = Object.keys(this.data || {}).map(String).join(', ');
    const vals = Object.values(this.data || {}).map(v => JSON.stringify(v)).join(', ');
    const sql = `INSERT INTO ${this.table} (${keys}) VALUES (${vals});`;
    console.log(`  [SQL] ${sql}`);
    return { insertId: Date.now() };
  }
}

export class UpdateBuilder<T extends Record<string, unknown>> {
  private table: string;
  private setData?: Partial<T>;
  private wheres: string[] = [];

  constructor(table: string) {
    this.table = table;
  }

  set(data: Partial<T>): this {
    this.setData = data;
    return this;
  }

  where<K extends keyof T>(field: K, op: Op, value: T[K]): this {
    this.wheres.push(`${String(field)} ${op} ${JSON.stringify(value)}`);
    return this;
  }

  execute(): MutationResult {
    const setClause = Object.entries(this.setData || {})
      .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
      .join(', ');

    let sql = `UPDATE ${this.table} SET ${setClause}`;

    if (this.wheres.length > 0) {
      sql += ` WHERE ${this.wheres.join(' AND ')}`;
    }

    sql += ';';
    console.log(`  [SQL] ${sql}`);
    return { affectedRows: 1 };
  }
}

export class DeleteBuilder<T extends Record<string, unknown>> {
  private table: string;
  private wheres: string[] = [];

  constructor(table: string) {
    this.table = table;
  }

  where<K extends keyof T>(field: K, op: Op, value: T[K]): this {
    this.wheres.push(`${String(field)} ${op} ${JSON.stringify(value)}`);
    return this;
  }

  execute(): MutationResult {
    let sql = `DELETE FROM ${this.table}`;

    if (this.wheres.length > 0) {
      sql += ` WHERE ${this.wheres.join(' AND ')}`;
    }

    sql += ';';
    console.log(`  [SQL] ${sql}`);
    return { affectedRows: 1 };
  }
}
