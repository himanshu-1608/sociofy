const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    post: { type: mongoose.Types.ObjectId, required: true, ref: 'Post' },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    creatorName: { type: String, required: true },
    message: { type: String, required: true }
});

module.exports = mongoose.model('Comment', commentSchema);