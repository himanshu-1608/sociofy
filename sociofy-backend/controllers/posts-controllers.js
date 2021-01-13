const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const createPost = async(req, res, next) => {
    let creator, createdPost;
    creator = await User.findById(req.userData.userId).populate('posts');

    createdPost = new Post({
        creator,
        image: req.file.path,
        likers: [],
        comments: []
    });
    try {
        await createdPost.save();
        creator.posts.push(createdPost);
        await creator.save();
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ message: "Post Created" });
};

const getAllPosts = async(req, res, next) => {
    let allPosts;
    allPosts = await Post.find({}).populate('creator').populate('comments').exec();
    res.status(201).json({ posts: allPosts });
};

const changeLikeStatus = async(req, res, next) => {
    console.log("Hello");
    console.log(req.body);
    const myId = req.userData.userId;
    const postId = req.body.pid;
    console.log(myId);
    console.log(postId);
    let user, post;
    try {
        user = await User.findById(myId);
        post = await Post.findById(postId);
        console.log(user);
        console.log(post);
        if (!user || !post) {
            const error = new HttpError(
                'Could not find given friend user for the provided id.',
                404
            );
            return next(error);
        }
        const val = post.likers.find(
            (tFriend) => tFriend.toString() === myId.toString());

        console.log(val);
        if (val && val.toString().length > 0) {
            post.likers.pull(user);
            await post.save();
            res.status(200).json({ val: "Removed Like" });
        } else {
            post.likers.push(user);
            await post.save();
            res.status(200).json({ val: "Added Like" });
        }
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the user.',
            500
        );
        return next(error);
    }
};

exports.createPost = createPost;
exports.getAllPosts = getAllPosts;
exports.changeLikeStatus = changeLikeStatus;