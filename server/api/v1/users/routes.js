const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('./../auth');

/*
 * /api/users/signup    POST - SIGNUP
 * /api/users/login     POST - LOGIN
 * /api/users/profile   GET  - PROFILE
 */

router.route('/signup')
    .post(controller.create)

router.route('/login')
    .post(controller.login)
    
router.route('/profile')
    .get(auth, controller.profile)

module.exports = router;