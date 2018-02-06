const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('./../auth');

/*
 * /api/questions/     GET    - READ ALL
 * /api/questions/     POST   - CREATE
 * /api/questions/:id  GET    - READ ONE
 * /api/questions/:id  PUT    - UPDATE
 * /api/questions/:id  DELETE - DELETE
 */

router.route('/')
    .get(controller.all)
    .post(auth, controller.create)
    

router.param('id', controller.find)

router.route('/:id')
    .get(controller.get)
    .post(auth, controller.update)
    .put(auth, controller.update)
    .delete(auth, controller.delete)
    
router.route('/:id/answer')
    .post(auth, controller.addAnswers)

// Se implemento de esta manera porque daba un error 499
router.route('/:id/delete')
    .post(auth, controller.delete)

module.exports = router;