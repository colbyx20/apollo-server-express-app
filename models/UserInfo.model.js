const {model, Schema, mongoose} = require('mongoose');

const userInfoSchema = new Schema({
    userId:{type: mongoose.ObjectId, require:true},//dose this garuntee that there will be no other item without the same ID? This issue is resolved by a statistical analysis
                                                   //there are 6 billion people on the the planet that is less the .00000000000000001% of the possible combos and is no less secure then
                                                   //_id field. so yes overlap between a user and prof is possible it is highly unlikely
    email:{type:String, require:true, unique: true},
    image:{type:String},
    privilege: {
        type: String,
        require: true,
        enum:['student','professor','coordinator'] 
    }
});

module.exports = model('userInfo', userInfoSchema);