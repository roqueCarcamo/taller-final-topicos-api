const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('./../auth');

/*
 * /api/books/     GET    - READ ALL
 * /api/books/     POST   - CREATE
 * /api/books/:id  GET    - READ ONE
 * /api/books/:id  PUT    - UPDATE
 * /api/books/:id  DELETE - DELETE
 */

router.route('/')
    .get(controller.all)
    .post(auth, controller.create)

router.param('id', controller.find)

router.route('/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete)

module.exports = router;