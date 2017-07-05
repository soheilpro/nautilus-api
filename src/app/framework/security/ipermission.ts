export interface IPermission {
  name: string;
  params?: {
    [key: string]: string;
  };
}
