const Users = require('./models/Users.model');
const Professors = require('./models/Professors.model');

const resolvers = {
    Query:{
        getUser: async(_,{ID}) =>{
            return await Users.findById(ID);
        },
        getAllUsers: async () =>{
            return await Users.find();
        },
        getProfessor: async(_,{ID}) => {
            return await Professors.findById(ID);
        },
        getAllProfessors: async () =>{
            return await Professors.find();
        }
    },
}

module.exports = resolvers;
