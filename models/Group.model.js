const {model, Schema, mongoose} = require('mongoose');

const groupSchema = new Schema({
    coordinatorId: mongoose.ObjectId,
    groupName: {type:String, require:true, unique: true},
    projectField: {type:String, require:true}, // maybe turn this into an ENUM??
    memberCount:{type: Number, require:true},
    members:{type: Array, require:false},
    appointments: {type: Array}
})

module.exports = model("Group",groupSchema);