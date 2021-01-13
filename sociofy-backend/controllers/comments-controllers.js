const HttpError = require('../models/http-error');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const addComment = async(req, res, next) => {
    const myId = req.userData.userId;
    const postId = req.body.pid;
    const message = req.body.message;
    let user, post, createdComment;
    try {
        user = await User.findById(myId);
        post = await Post.findById(postId).populate('comments');
        createdComment = new Comment({
            post: post,
            creator: user,
            creatorName: user.name,
            message: message
        });
        console.log(user);
        console.log(post);
        console.log(createdComment);
        if (!user || !post || !createdComment) {
            const error = new HttpError(
                'Could not find given user or post for the provided id.',
                404
            );
            return next(error);
        }

        await createdComment.save();
        post.comments.push(createdComment);
        await post.save();
        res.json({ val: true });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not add comment.',
            500
        );
        return next(error);
    }
}
exports.addComment = addComment;