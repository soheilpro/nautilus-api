import * as restify from 'restify';
import * as debugModule from 'debug';
import { DB } from './db';
import { DateTimeService } from './services';
import { UserManager, UserLogManager, SessionManager, ProjectManager, UserRoleManager, ItemStateManager, ItemTypeManager, ItemPriorityManager, ItemManager, ItemRelationshipManager } from './managers';
import { UserRepository, UserLogRepository, SessionRepository, ProjectRepository, UserRoleRepository, ItemStateRepository, ItemTypeRepository, ItemPriorityRepository, ItemRepository, ItemRelationshipRepository } from './repositories';
import { UserRouter, SessionRouter, ProjectRouter, UserRoleRouter, ItemStateRouter, ItemTypeRouter, ItemPriorityRouter, ItemRouter, ItemRelationshipRouter } from './routers';
import { authenticator } from './plugins';

const debug = debugModule('nautilus-api');

const dateTimeService = new DateTimeService();

const db = new DB('mongodb://localhost/nautilus', dateTimeService);

const userRepository = new UserRepository(db);
const userLogRepository = new UserLogRepository(db);
const sessionRepository = new SessionRepository(db);
const projectRepository = new ProjectRepository(db);
const userRoleRepository = new UserRoleRepository(db);
const itemStateRepository = new ItemStateRepository(db);
const itemTypeRepository = new ItemTypeRepository(db);
const itemPriorityRepository = new ItemPriorityRepository(db);
const itemRepository = new ItemRepository(db);
const itemRelationshipRepository = new ItemRelationshipRepository(db);

const userManager = new UserManager(userRepository);
const userLogManager = new UserLogManager(userLogRepository);
const sessionManager = new SessionManager(sessionRepository);
const projectManager = new ProjectManager(projectRepository);
const userRoleManager = new UserRoleManager(userRoleRepository);
const itemStateManager = new ItemStateManager(itemStateRepository);
const itemTypeManager = new ItemTypeManager(itemTypeRepository);
const itemPriorityManager = new ItemPriorityManager(itemPriorityRepository);
const itemManager = new ItemManager(itemRepository);
const itemRelationshipManager = new ItemRelationshipManager(itemRelationshipRepository);

const routers = [
  new UserRouter(userManager, userLogManager, dateTimeService),
  new SessionRouter(sessionManager, userManager, userLogManager, dateTimeService),
  new UserRoleRouter(userRoleManager, userManager, projectManager, userLogManager, dateTimeService),
  new ProjectRouter(projectManager, userLogManager, dateTimeService),
  new ItemStateRouter(itemStateManager, userLogManager, dateTimeService),
  new ItemTypeRouter(itemTypeManager, userLogManager, dateTimeService),
  new ItemPriorityRouter(itemPriorityManager, userLogManager, dateTimeService),
  new ItemRouter(itemManager, userManager, projectManager, itemTypeManager, itemStateManager, itemPriorityManager, userLogManager, dateTimeService),
  new ItemRelationshipRouter(itemRelationshipManager, itemManager, userLogManager, dateTimeService),
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
