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
    Mutation:{
        createUser: async(_,{userInput:{firstname,lastname,email,login,password, group}}) =>{
            const createdUser = new Users({
                firstname:firstname,
                lastname:lastname,
                email:email,
                login:login,
                password:password,
                group:group
            });

            const res = await createdUser.save();

            return {
                id:res.id,
                ...res._doc // take all properties from result
            }
        },
        createProfessor: async(_,{professorInput:{firstname,lastname,email,login,password,fieldOfInterest}}) =>{
            const createdProfessor = new Professors({
                firstname:firstname,
                lastname:lastname,
                email:email,
                login:login,
                password:password,
                fieldOfInterest:fieldOfInterest
            });
            const professor = await createdProfessor.save();

            return {
                id:professor.id,
                ...professor._doc
            }
        },
        createProfessorSchedule: async(_,{ID,professorScheduleInput:{time}}) => {
            const date = new Date(time).toISOString();
            const isoDate = new Date(date);
            const createdDate = (await Professors.findByIdAndUpdate({_id:ID},{$push:{schedule:isoDate}})).modifiedCount;
            return createdDate;
        },
        deleteUser: async(_,{ID}) => {
            const wasDeletedUser = (await Users.deleteOne({_id:ID})).deletedCount;
            return wasDeletedUser;
        },
        deleteProfessor: async(_,{ID}) =>{
            const wasDeletedProfessor = (await Professors.deleteOne({_id:ID})).deletedCount;
            return wasDeletedProfessor;
        },
        editUser: async(_,{ID,userInput:{firstname,lastname,email,login}})=>{
            const  userEdited = (await Users.updateOne({_id:ID},{
                firstname:firstname,
                lastname:lastname,
                email:email,
                login:login
            })).modifiedCount;
            return userEdited;
        },
        editProfessor: async (_,{ID,professorInput:{firstname,lastname,email,login}})=>{
            const professorEdit = (await Professors.updateOne({_id:ID},{
                firstname:firstname,
                lastname:lastname,
                email:email,
                login:login
            })).modifiedCount;
            return professorEdit;
        }

    }
}

module.exports = resolvers;
