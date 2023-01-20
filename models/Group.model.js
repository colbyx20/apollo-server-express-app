const {model, Schema, mongoose} = require('mongoose');

const groupSchema = new Schema({
    coordinatorId: mongoose.ObjectId,
    groupName: {type:String, require:true, unique: true},
    projectField: {type:String, require:true}, // maybe turn this into an ENUM??
<<<<<<< HEAD
    memberCount:{type: Number, require:true},
    members:{type: Array, require:false},
<<<<<<< HEAD
    appointment: {type: Date, require:false},
    professorsAttending:  {type: [Schema.Types.ObjectId],require:false},
    groups: {type:Array}
=======
    appointments: {type: Array}
>>>>>>> master
=======
    groupNumber: {type: Number, require: true, unique: true},
    memberCount:{type: Number}
>>>>>>> master
})

module.exports = model("Group",groupSchema);