const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 2 },
    image: { type: String, required: true },
    friends: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
    posts: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Post' }]
});

module.exports = mongoose.model('User', userSchema);