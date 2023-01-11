const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

    firstname:{type: String},
    lastname:{type: String},
    email:{type: String,require: true,unique: true},
    password:{type: String,require: true},
    group: {type: String,require: false},
    privilege:{type: Number,require: true},
    token:{type: String},
    confirm:{type: Number},
    image:{type: String},
    role:{type: String}

})

const Users = mongoose.model('users', UsersSchema);
module.exports = Users;