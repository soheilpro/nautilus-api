import * as restify from 'restify';
import * as debugModule from 'debug';
import { DB } from './db';
import { DateTimeService } from './services';
import { UserManager, SessionManager, ProjectManager, UserRoleManager, ItemStateManager, ItemTypeManager, ItemPriorityManager, ItemManager } from './managers';
import { UserRepository, SessionRepository, ProjectRepository, UserRoleRepository, ItemStateRepository, ItemTypeRepository, ItemPriorityRepository, ItemRepository } from './repositories';
import { UserRouter, SessionRouter, ProjectRouter, UserRoleRouter, ItemStateRouter, ItemTypeRouter, ItemPriorityRouter, ItemRouter } from './routers';
import { authenticator } from './plugins';

const debug = debugModule('nautilus-web');

const dateTimeService = new DateTimeService();
const db = new DB('mongodb://localhost/nautilus', dateTimeService);

const userRepository = new UserRepository(db);
const sessionRepository = new SessionRepository(db);
const projectRepository = new ProjectRepository(db);
const userRoleRepository = new UserRoleRepository(db);
const itemStateRepository = new ItemStateRepository(db);
const itemTypeRepository = new ItemTypeRepository(db);
const itemPriorityRepository = new ItemPriorityRepository(db);
const itemRepository = new ItemRepository(db);

const userManager = new UserManager(userRepository);
const sessionManager = new SessionManager(sessionRepository);
const projectManager = new ProjectManager(projectRepository);
const userRoleManager = new UserRoleManager(userRoleRepository);
const itemStateManager = new ItemStateManager(itemStateRepository);
const itemTypeManager = new ItemTypeManager(itemTypeRepository);
const itemPriorityManager = new ItemPriorityManager(itemPriorityRepository);
const itemManager = new ItemManager(itemRepository);

const routers = [
  new UserRouter(userManager),
  new SessionRouter(sessionManager, userManager),
  new UserRoleRouter(userRoleManager, userManager, projectManager),
  new ProjectRouter(projectManager),
  new ItemStateRouter(itemStateManager),
  new ItemTypeRouter(itemTypeManager),
  new ItemPriorityRouter(itemPriorityManager),
  new ItemRouter(itemManager, userManager, projectManager, itemTypeManager, itemStateManager, itemPriorityManager),
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
