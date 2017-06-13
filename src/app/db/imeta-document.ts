import { IDocument } from './idocument';

export interface IMetaDocument extends IDocument {
  meta?: {
    version?: number,
    state?: number,
    insertDateTime?: Date,
    updateDateTime?: Date,
    deleteDateTime?: Date,
  };
}
