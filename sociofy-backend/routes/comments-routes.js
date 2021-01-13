const express = require('express');
const checkAuth = require('../middleware/check-auth');

const commentsController = require('../controllers/comments-controllers');

const router = express.Router();

router.use(checkAuth);

router.post('/add', commentsController.addComment);

module.exports = router;