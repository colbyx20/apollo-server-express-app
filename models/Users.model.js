const mongoose = require('mongoose');
const Group = require('./Group.model');
const UsersSchema = new mongoose.Schema({

    userFName: { type: String },
    userLName: { type: String },
    groupId: { type: mongoose.ObjectId, ref: Group },
    role: {
        type: String,
        enum: ['Leader', 'Front-end', 'Back-end', '']
    },
    coordinatorId: { type: mongoose.ObjectId },
})

const Users = mongoose.model('users', UsersSchema);
module.exports = Users;