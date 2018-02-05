const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('./../auth');

/*
 * /api/answers/     GET    - READ ALL
 * /api/answers/     POST   - CREATE
 * /api/answers/:id  GET    - READ ONE
 * /api/answers/:id  PUT    - UPDATE
 * /api/answers/:id  DELETE - DELETE
 */

router.route('/')
    .get(controller.all)
    .post(auth,controller.create)

router.param('id', controller.find)

router.route('/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete)

module.exports = router;