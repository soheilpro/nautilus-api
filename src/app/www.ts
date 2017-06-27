import * as restify from 'restify';
import * as debugModule from 'debug';
import { DB } from './db';
import { UserManager } from './managers';
import { UserRepository } from './repositories';
import { authenticator } from './plugins';
import { UserRouter } from './routers';

const debug = debugModule('nautilus-web');

const db = new DB('mongodb://localhost/nautilus');
const userRepository = new UserRepository(db);
const userManager = new UserManager(userRepository);

const routers = [
  new UserRouter(userManager),
];

const server = restify.createServer();
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.use(authenticator(userManager));

for (const router of routers)
  router.register(server);

server.listen(8080, () => {
  debug(`Nautilus API listening on port ${server.address().port}`);
});
