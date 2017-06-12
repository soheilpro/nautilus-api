import { SessionRepository } from '../repositories/session';
import { UserRepository } from '../repositories/user';

var express = require('express');
var bcrypt = require('bcryptjs');
var uuid = require('node-uuid');

var router = express.Router();

router.post('/', (request: any, response: any, next: any) => {
  var username = request.param('username');
  var password = request.param('password');

  var repository = new SessionRepository();
  var userRepository = new UserRepository();

  userRepository.get({ username: username }, (error, user) => {
    if (error)
      return next(error);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      response.status(403);
      response.end();
      return;
    }

    var session = {
      accessToken: uuid.v4().replace(/-/g, ''),
      user: user
    };

    repository.insert(session, (error, session) => {
      if (error)
        return next(error);

      response.status(201);

      response.json({
        data: session
      });
    });
  });
});

export = router;