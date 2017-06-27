import * as restify from 'restify';

export interface IRoute {
  method: string;
  url: string;
  handler: restify.RequestHandler;
  permissions: string[];
}
