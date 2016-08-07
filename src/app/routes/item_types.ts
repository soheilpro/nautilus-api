import { ItemTypeRepository } from '../repositories/item_type';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new ItemTypeRepository();

  repository.getAll({}, (error, types) => {
    if (error)
      return next(error);

    response.json({
      data: types
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  var type: IItemType = {};

  if (request.param('title'))
    type.title = request.param('title');

  if (request.param('key'))
    type.key = request.param('key');

  var repository = new ItemTypeRepository();

  repository.insert(type, (error, type) => {
    if (error)
      return next(error);

    response.json({
      data: type
    });
  });
});

router.patch('/:typeId', (request: any, response: any, next: any) => {
  var repository = new ItemTypeRepository();
  var change: IItemTypeChange = {};

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('key') !== undefined)
    change.key = request.param('key');

  repository.update(request.param('typeId'), change, (error, type) => {
    if (error)
      return next(error);

    response.json({
      data: type
    });
  });
});

export = router;
