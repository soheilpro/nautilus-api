import * as restify from 'restify';
import * as debugModule from 'debug';
import UserRouter from './routers/user';

const debug = debugModule('nautilus-web');

const server = restify.createServer();
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());

const routers = [
  new UserRouter(),
];

for (const router of routers)
  router.register(server);

server.listen(8080, () => {
  debug(`Nautilus API listening on port ${server.address().port}`);
});
