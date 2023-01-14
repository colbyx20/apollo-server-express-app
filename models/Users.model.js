const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

    userFName:{type: String},
    userLname:{type: String},
    email:{type: String,require: true,unique: true},
    groupNumber: {type: String,require: false},
    image:{type: String},
    role:{type: String},
    coordinatorId: {type: mongoose.ObjectId},
    privilege:{
        type: String,
        require: true,
        enum:['user','professor','coordinator'],
        default:'user' 
    },

})

const Users = mongoose.model('users', UsersSchema);
module.exports = Users;