const{model,Schema} = require('mongoose');

const coordinatorSchema = new Schema({
    CoordinatorID:{type:ID},
    Room:{type:String},
    Schedule:{type:Array}
});