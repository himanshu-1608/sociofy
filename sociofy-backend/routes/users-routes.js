const express = require('express');
const checkAuth = require('../middleware/check-auth');

const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.use(checkAuth);

router.post('/friends/change', usersController.changeFriendStatus);
router.post('/friends/check', usersController.checkFriendStatus);
router.get('/friends/suggestion', usersController.getSuggestions);

router.get('/:uname', usersController.getUser);

// router.patch('/addimage', usersController.addProfilePic);

module.exports = router;