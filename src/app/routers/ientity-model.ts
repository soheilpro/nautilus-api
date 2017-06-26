export interface IEntityModel {
  id: string;
  meta: {
    version: number,
    state: number,
    insertDateTime: number,
    updateDateTime: number,
    deleteDateTime: number,
  };
}
