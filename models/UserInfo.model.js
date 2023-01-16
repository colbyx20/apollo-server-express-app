const {model, Schema, mongoose} = require('mongoose');

const userInfoSchema = new Schema({
    userId:{type: mongoose.ObjectId, require:true},
    email:{type:String, require:true, unique: true},
    image:{type:String},
    privilege: {
        type: String,
        require: true,
        enum:['user','professor','coordinator'],
        default:'professor' 
    }
});

module.exports = model('userInfo', userInfoSchema);