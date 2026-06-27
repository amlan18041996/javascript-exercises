import { SelectBuilder } from './query-builder.js';
import { InsertBuilder } from './query-builder.js';
import { UpdateBuilder } from './query-builder.js';
import { DeleteBuilder } from './query-builder.js';
import type { DatabaseSchema, TableNames, RowType } from './types.js';

export class MiniPrisma<T extends DatabaseSchema> {
  private dbPath?: string;

  constructor(dbPath?: string) {
    this.dbPath = dbPath;
  }

  selectFrom<N extends TableNames<T>>(table: N): SelectBuilder<RowType<T, N>> {
    return new SelectBuilder<RowType<T, N>>(table);
  }

  insertInto<N extends TableNames<T>>(table: N): InsertBuilder<RowType<T, N>> {
    return new InsertBuilder<RowType<T, N>>(table);
  }

  update<N extends TableNames<T>>(table: N): UpdateBuilder<RowType<T, N>> {
    return new UpdateBuilder<RowType<T, N>>(table);
  }

  deleteFrom<N extends TableNames<T>>(table: N): DeleteBuilder<RowType<T, N>> {
    return new DeleteBuilder<RowType<T, N>>(table);
  }
}

export { SelectBuilder, InsertBuilder, UpdateBuilder, DeleteBuilder } from './query-builder.js';
export type { DatabaseSchema, TableNames, RowType, Op, OrderDir, InsertResult, MutationResult } from './types.js';
