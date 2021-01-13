const express = require('express');
const checkAuth = require('../middleware/check-auth');

const fileUpload = require('../middleware/file-upload');
const postsController = require('../controllers/posts-controllers');

const router = express.Router();

router.use(checkAuth);

router.post('/create', fileUpload.single('image'), postsController.createPost);

router.get('/all', postsController.getAllPosts);

router.post('/like', postsController.changeLikeStatus);

// router.get('/individual/:uid', postsController.getPostsByUserId);

module.exports = router;