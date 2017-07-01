import * as restify from 'restify';
import * as debugModule from 'debug';
import { DB } from './db';
import { UserManager, ProjectManager, UserRoleManager } from './managers';
import { UserRepository, ProjectRepository, UserRoleRepository } from './repositories';
import { authenticator } from './plugins';
import { UserRouter, ProjectRouter, UserRoleRouter } from './routers';

const debug = debugModule('nautilus-web');

const db = new DB('mongodb://localhost/nautilus');

const userRepository = new UserRepository(db);
const projectRepository = new ProjectRepository(db);
const userRoleRepository = new UserRoleRepository(db);

const userManager = new UserManager(userRepository);
const projectManager = new ProjectManager(projectRepository);
const userRoleManager = new UserRoleManager(userRoleRepository);

const routers = [
  new UserRouter(userManager),
  new UserRoleRouter(userRoleManager),
  new ProjectRouter(projectManager),
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
