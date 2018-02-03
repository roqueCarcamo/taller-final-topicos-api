const express = require('express');
const router = express.Router();
const questions = require('./questions/routes');
const answers = require('./answers/routes');
const users = require('./users/routes');

router.use('/questions', questions);
router.use('/answers', answers);
router.use('/users', users);

module.exports = router;