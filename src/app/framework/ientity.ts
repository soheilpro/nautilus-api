import { MetaState } from './meta-state';

export interface IEntity {
  id?: string;
  meta?: {
    version?: number,
    state?: MetaState,
    insertDateTime?: Date,
    updateDateTime?: Date,
    deleteDateTime?: Date,
  };
}
