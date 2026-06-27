export type DatabaseSchema = Record<string, Record<string, unknown>>;

export type TableNames<T extends DatabaseSchema> = keyof T & string;

export type RowType<T extends DatabaseSchema, N extends TableNames<T>> = T[N];

export type Op = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN';

export type OrderDir = 'ASC' | 'DESC';

export type InsertResult = { insertId: number };

export type MutationResult = { affectedRows: number };
