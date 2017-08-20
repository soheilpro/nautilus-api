import * as restify from 'restify';
import * as debugModule from 'debug';
import { DB } from './db';
import { DateTimeService } from './services';
import { UserManager, SessionManager, ProjectManager, UserRoleManager, ItemPriorityManager } from './managers';
import { UserRepository, SessionRepository, ProjectRepository, UserRoleRepository, ItemPriorityRepository } from './repositories';
import { UserRouter, SessionRouter, ProjectRouter, UserRoleRouter, ItemPriorityRouter } from './routers';
import { authenticator } from './plugins';

const debug = debugModule('nautilus-web');

const dateTimeService = new DateTimeService();
const db = new DB('mongodb://localhost/nautilus', dateTimeService);

const userRepository = new UserRepository(db);
const sessionRepository = new SessionRepository(db);
const projectRepository = new ProjectRepository(db);
const userRoleRepository = new UserRoleRepository(db);
const itemPriorityRepository = new ItemPriorityRepository(db);

const userManager = new UserManager(userRepository);
const sessionManager = new SessionManager(sessionRepository);
const projectManager = new ProjectManager(projectRepository);
const userRoleManager = new UserRoleManager(userRoleRepository);
const itemPriorityManager = new ItemPriorityManager(itemPriorityRepository);

const routers = [
  new UserRouter(userManager),
  new SessionRouter(sessionManager, userManager),
  new UserRoleRouter(userRoleManager, userManager, projectManager),
  new ProjectRouter(projectManager),
  new ItemPriorityRouter(itemPriorityManager),
];

const server = restify.createServer();
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.use(authenticator(sessionManager, userRoleManager, projectManager));

for (const router of routers)
  router.register(server);

server.listen(8080, () => {
  debug(`Nautilus API listening on port ${server.address().port}`);
});
