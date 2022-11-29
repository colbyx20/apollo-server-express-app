const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        require: true
    },
    login:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    group: {
        type: String,
        require: false
    }

})

const Users = mongoose.model('users', UsersSchema);
module.exports = Users;