const { model, Schema, mongoose } = require('mongoose');
const Coordinator = require('./Coordinator.model');
const Professor = require('./Professors.model');
const Student = require('./Users.model');

const userInfoSchema = new Schema({
    userId: {
        type: mongoose.ObjectId, required: true,
        ref: function () {
            if (this.privilege === 'coordinator') {
                return Coordinator;
            } else if (this.privilege === 'professor') {
                return Professor;
            } else if (this.privilege === 'student') {
                return Student;
            } else {
                return Error("Users can only be coordinator, professor, student");
            }
        }
    },
    email: { type: String, required: true, unique: true },
    notificationEmail: { type: String, unique: true },
    image: { type: String },
    privilege: {
        type: String,
        require: true,
        enum: ['student', 'professor', 'coordinator']
    }
});

module.exports = model('userInfo', userInfoSchema);