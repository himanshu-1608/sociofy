const express = require('express');

const authsController = require('../controllers/auths-controllers');

const router = express.Router();

router.post('/signup', authsController.signup);

router.post('/login', authsController.login);

module.exports = router;