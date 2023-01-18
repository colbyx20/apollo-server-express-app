const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

    userFName:{type: String},
    userLName:{type: String},
    groupNumber: {type: Number,require: false},
    role:{type: String},
    coordinatorId: {type: mongoose.ObjectId},
})

const Users = mongoose.model('users', UsersSchema);
module.exports = Users;