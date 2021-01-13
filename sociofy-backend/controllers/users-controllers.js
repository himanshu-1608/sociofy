const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUser = async(req, res, next) => {
    const userName = req.params.uname;
    let user;
    try {
        user = await User.findOne({ name: userName }).populate('posts');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the user.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Could not find user for the provided id.',
            404
        );
        return next(error);
    }

    res.json({
        user: user.toObject({ getters: true }),
        myId: req.userData.userId
    });
};

const changeFriendStatus = async(req, res, next) => {
    const myId = req.userData.userId;
    const friendId = req.body.friendId;
    const decision = req.body.decision;
    let user, friend;
    try {
        user = await User.findOne({ _id: myId });
        friend = await User.findOne({ _id: friendId });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the user.',
            500
        );
        return next(error);
    }

    if (!user || !friend) {
        const error = new HttpError(
            'Could not find given friend user for the provided id.',
            404
        );
        return next(error);
    }
    if (decision === "add") {
        user.friends.push(friend);
        user.save();
        res.json({ message: "Added Friend" });
    } else {
        user.friends.pull(friend);
        user.save();
        res.json({ message: "Removed Friend" });
    }
};

const checkFriendStatus = async(req, res, next) => {
    const myId = req.userData.userId;
    const friendId = req.body.friendId;
    let user;
    try {
        user = await User.findOne({ _id: myId });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the user.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Could not find given friend user for the provided id.',
            404
        );
        return next(error);
    }

    const val = user.friends.find(
        (tFriend) => tFriend.toString() === friendId.toString());

    if (val && val.toString().length > 0) {
        res.status(200).json({ val: true });
    } else {
        res.status(404).json({ val: false });
    }
};

const getSuggestions = async(req, res, next) => {
    const myId = req.userData.userId;
    let user, allList, suggestions = [];
    try {
        user = await User.findById({ _id: myId }).populate('friends');
        if (!user) {
            const error = new HttpError(
                'Could not find given friend user for the provided id.',
                404
            );
            return next(error);
        }
        allList = await User.find({});
        for (recommend of allList) {
            isFriend = false;
            for (friendUser of user.friends) {
                if (recommend.id == user.id) {
                    isFriend = true;
                }
                if (recommend.id == friendUser.id) {
                    isFriend = true;
                }
            }
            if (!isFriend) {
                suggestions.push(recommend);
            }
        }
        res.json({ suggestedUsers: suggestions });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the user.',
            500
        );
        return next(error);
    }
};

exports.getUser = getUser;
exports.changeFriendStatus = changeFriendStatus;
exports.checkFriendStatus = checkFriendStatus;
exports.getSuggestions = getSuggestions;