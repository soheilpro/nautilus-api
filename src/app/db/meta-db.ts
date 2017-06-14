import { IMetaDocument } from './imeta-document';
import { IDocument } from './idocument';
import { IQuery } from './iquery';
import { IUpdate } from './iupdate';
import { Update } from './update';
import { DB } from './db';

export class MetaDB extends DB {
  async insert<TDocument extends IMetaDocument>(collectionName: string, document: TDocument) {
    const metaDocument = {
      ...document as IDocument,
      meta: {
        'version': await this.nextVersion(),
        'state': 0,
        'insertDateTime': new Date(),
      },
    };

    super.insert(collectionName, metaDocument);
  }

  async update<TDocument extends IMetaDocument>(collectionName: string, query: IQuery, update: IUpdate) {
    update.setOrUnset('meta.version', await this.nextVersion());
    update.setOrUnset('meta.state', 1);
    update.setOrUnset('meta.updateDateTime', new Date());

    return (await super.update(collectionName, query, update)) as TDocument;
  }

  async delete(collectionName: string, query: IQuery) {
    const update = new Update();
    update.setOrUnset('meta.version', await this.nextVersion());
    update.setOrUnset('meta.state', 2);
    update.setOrUnset('meta.deleteDateTime', new Date());

    await super.update(collectionName, query, update);
  }

  protected nextVersion() {
    return this.counter('_version');
  }
}
