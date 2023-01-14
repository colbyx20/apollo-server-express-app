const Users = require('./models/Users.model');
const Professors = require('./models/Professors.model');
const Group = require('./models/Group.model');
const Admin = require('./models/Admin.model');
const Coordinator = require('./models/Coordinator.model');
const Auth = require('./models/Auth.model');
const UserInfo = require('./models/UserInfo.model');
const {ApolloError} = require('apollo-server-errors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mongoose = require('mongoose');

const STUDENT_EMAIL = new RegExp('^[a-z0-9](\.?[a-z0-9]){2,}@k(nights)?nights\.ucf\.edu$');
const PROFESSOR_EMAIL = new RegExp('^[a-z0-9](\.?[a-z0-9]){2,}@gmail\.com$');

const resolvers = {


    Query:{
        getUser: async(_,{ID}) => {
            return await Users.findById(ID);
        },
        getAllUsers: async () => {
            return await Users.find();
        },   
        getProfessor: async(_,{ID}) => {
            return await Professors.findById(ID);
        },
        getAllProfessors: async () => {
            return await Professors.find();
        },
        getAllGroups: async() => {

            

            return await Group.aggregate([
                {$lookup:
                    {   from:"users", 
                        localField: "members",
                        foreignField:"_id", 
                        as:"members"
                    }
                }]);
        },
        getAdmins: async() =>{
            return await Admin.find();
        }
    },
    Mutation:{
        registerCoordinator: async(_,{coordinatorInput: {firstname,lastname,email,password,confirmpassword}}) =>{
            if (password !== confirmpassword){
                throw new ApolloError("Passwords Do Not Match");
            }
            if(password === "" || firstname === "" || lastname === "" || email === ""){
                throw new ApolloError("Please fill in all of the Boxes!");
            }

            // const coordinatorExists = await Coordinator.findOne({email});

            // if(coordinatorExists){
            //     throw new ApolloError("Coordinator Already Exists with email " + email);
            // }

            // var encryptedPassword = await bcrypt.hash(password,10);
        
            //     // Build out mongoose model 
            //     const newCoordinator = new Coordinator({
            //         firstname:firstname,
            //         lastname:lastname,
            //         email: email.toLowerCase(),
            //         password: encryptedPassword
            //     });
        
            //     // create JWT (attach to user model)
            //     const token = jwt.sign(
            //         {id : newCoordinator._id, email}, 
            //         "UNSAFE_STRING", // stored in a secret file 
            //         {
            //             expiresIn: "2h"
            //         }
            //     );
                
            //     // front end wants to see this token
            //     // They will attach this token to the user when logging in.
            //     newCoordinator.token = token;
                
            //     // Save user in MongoDB
            //     const res = await newCoordinator.save();
        
            //     return{
            //         id:res.id,
            //         ...res._doc
            //     }

        },
        registerUser: async(_,{registerInput: {firstname,lastname, email, password, confirmpassword}}) =>{

            if (password !== confirmpassword){
                throw new ApolloError("Passwords Do Not Match");
            }
            if(password === "" || firstname === "" || lastname === "" || email === ""){
                throw new ApolloError("Please fill in all of the Boxes!");
            }
            // See if an old user or Professor exists with Email attempting to Register
            // const oldUser = await Users.findOne({email});
            const oldProfessor = await UserInfo.findOne({email:email});
            console.log(oldProfessor);
    
            if(oldProfessor){
                // throw an error 
                throw new ApolloError("A user is already reigstered with the email " + email, "USER_ALREADY_EXISTS");
            }

            let transport = nodemailer.createTransport({ 
                service: "Gmail", 
                host:process.env.EMAIL_USERNAME,
                secure: false,
                auth: { 
                    user: process.env.EMAIL_USERNAME, 
                    pass: process.env.EMAIL_PASSWORD 
                }, 
            
            });


            //console.log("TESTING");
            // console.log(`Student: ${STUDENT_EMAIL.test(email)}`);
            //console.log(`Professor: ${PROFESSOR_EMAIL.test(email)}`);


            // // email matches student, create user profile, then add their ID to authmodel with passworm, and token
            // if(STUDENT_EMAIL.test(email)){

            //     // Encrypt password using bcryptjs
            //     var encryptedPassword = await bcrypt.hash(password,10);
        
            //     // Build out mongoose model 
            //     const newUser = new Users({
            //         userFName:firstname.toLowerCase(),
            //         userLName:lastname.toLowerCase(),
            //         email: email.toLowerCase(),
            //         confirm: 0,
            //     });

        
            //     // create JWT (attach to user model)
            //     const token = jwt.sign(
            //         {id : newUser._id, email}, 
            //         "UNSAFE_STRING", // stored in a secret file 
            //         {
            //             expiresIn: "2h"
            //         }
            //     );
                
                
            //     // Save user in MongoDB
            //     const res = await newUser.save();
                
            //     const authUser = new Auth({
            //         userId : res._id,
            //         password: encryptedPassword, 
            //     })

            //     // set up token to new user
            //     authUser.token = token;

            //     transport.sendMail({
            //         from: "group13confirmation@gmail.com",
            //         to: email,
            //         subject: "mySDSchedule - Please Confirm Your Account",
            //         html: `<h1>Email Confirmation</h1>
            //         <h2>Hello ${firstname}</h2>
            //         <p>Thank you for Registering!</p>
            //         <p>To activate your account please click on the link below.</p>
                    
            //         </div>`,
            //         // code up a confirmation
            //         //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
            //     })
        
            //     return{
            //         id:res.id,
            //         ...res._doc
            //     }

            // } 
            if(!STUDENT_EMAIL.test(email)){

                console.log(`Student: ${STUDENT_EMAIL.test(email)}`);
                console.log(`Professor: ${PROFESSOR_EMAIL.test(email)}`);
                
                // Encrypt password using bcryptjs
                var encryptedPassword = await bcrypt.hash(password,10);
        
                // Build out mongoose model 
                const newProfessor = new Professors({
                    professorFName:firstname.toLowerCase(),
                    professorLName:lastname.toLowerCase()
                });
        
                // create JWT (attach to user model)
                const token = jwt.sign(
                    {id : newProfessor._id, email}, 
                    "UNSAFE_STRING", // stored in a secret file 
                    {
                        expiresIn: "1d"
                    }
                );
                
                // Save user in MongoDB
                const res = await newProfessor.save();

                // create professors auth information in separate collection called Auth
                const authProfessor = new Auth({
                    userId: res._id,
                    password: encryptedPassword,
                    confirm: false,
                    token: token
                })

                // save new professor profile
                await authProfessor.save();
                
                // create model for professors information 
                const professorInfo = new UserInfo({
                    userId:res._id,
                    email: email.toLowerCase(),
                    image:''
                })

                await professorInfo.save();

                transport.sendMail({
                    from: "group13confirmation@gmail.com",
                    to: email,
                    subject: "mySDSchedule - Please Confirm Your Account",
                    html: `<h1>Email Confirmation</h1>
                    <h2>Hello ${firstname}</h2>
                    <p>Thank you for Registering!</p>
                    <p>To activate your account please click on the link below.</p>
                    
                    <p>Please Check you Junk/Spam folder</p>
                    </div>`,
                    //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
                })
        
                return{
                    id:res.id,
                    ...res._doc
                }

            }else{
                throw new ApolloError("Invalid Email " + email, " EMAIL IS NOT VALID");
            }
    
        },
        loginUser: async (_,{loginInput: {email, password}}) => {

            if(PROFESSOR_EMAIL.test(email)){

                // 3 small queries are faster than joining all 3 then searching
                const professorsInfo = await UserInfo.findOne({email});
                const professorsAuth = await Auth.findOne({userId:professorsInfo.userId});
                const professors = await Professors.findOne({_id:professorsInfo.userId});

                if(professorsInfo && professorsAuth.confirm === true && (await bcrypt.compare(password, professorsAuth.password))){

                    // create a new token ( when you login you give user a new token )
                    const token = jwt.sign(
                        {
                            id : professors._id, 
                            email, 
                            firstname: professors.professorFName, 
                            lastname: professors.professorLName
                        }, 
                        "UNSAFE_STRING", // stored in a secret file 
                        {expiresIn: "1d"}
                    );
    
                    // attach token to user model that we found if user exists 
                    await Auth.findOneAndUpdate({userId:professors._id}, {$set:{token:token}})
    
                    return {
                        id: professors.id,
                        ...professors._doc
                    }          
                }
            }
        },
        // confirm email if valid, then provide another api to actually set the api.
        confirmEmail: async(_,{confirmEmail:{email}}) => {

            // check if email is valid 
            if(STUDENT_EMAIL.test(email)){
                try{
                    // check if email is valid 
                    const isValidEmail = await Users.findOne({email}, {_id:1, email:1, firstname:1, lastname:1});
                    
                    // set up email 
                    let transport = nodemailer.createTransport({ service: "Gmail", auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }, });

                    // send email to user. 
                    transport.sendMail({
                        from: "group13confirmation@gmail.com",
                        to: email,
                        subject: "mySDSchedule - Please Confirm Your Account",
                        html: `<h1>Email Confirmation</h1>
                        <h2>Hello ${isValidEmail.firstname} ${isValidEmail.lastname}</h2>
                        <p>Click Link to reset your password!</p>
                        <p>If you did not select to reset your password please ignore this email</p>
                        </div>`,
                        //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
                    })
                }catch(e){
                    // email is not valid 
                    throw new ApolloError("Email IS Not Valid");
                }

            }else if(PROFESSOR_EMAIL.test(email)){
                try{
                    // check if email is valid 
                    const isValidEmail = await Professors.findOne({email}, {_id:1, email:1, firstname:1, lastname:1});
                    
                    // set up email 
                    let transport = nodemailer.createTransport({ service: "Gmail", auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }, });

                    // send email to user. 
                    transport.sendMail({
                        from: "group13confirmation@gmail.com",
                        to: email,
                        subject: "mySDSchedule - Please Confirm Your Account",
                        html: `<h1>Email Confirmation</h1>
                        <h2>Hello ${isValidEmail.firstname} ${isValidEmail.lastname}</h2>
                        <p>Click Link to reset your password!</p>
                        <p>If you did not select to reset your password please ignore this email</p>
                        </div>`,
                        //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
                    })
                }catch(e){
                    // email is not valid 
                    throw new ApolloError("Email IS Not Valid");
                }
            }
        },
        resetPassword: async(_,{resetPassword:{email,password,confirmPassword}}) =>{

            // encrypt new password and set to user.
            if(password !== confirmPassword){
                throw new ApolloError("Passwords Do Not Match!");
            }
            
            if(STUDENT_EMAIL.test(email)){
                 try{
                    // encrypt password
                    const encryptedPassword = await bcrypt.hash(password,10);
                    
                    // set password from user 
                    const setNewPassword = await Users.findOneAndUpdate({email:email}, {password: encryptedPassword, confirmpassword: encryptedPassword });

                    setNewPassword.save();
            
                }catch(e){
                     throw new ApolloError("Email is Invalid");
                 }
            }else if (PROFESSOR_EMAIL.test(email)){
                try{
                    // encrypt password
                    const encryptedPassword = await bcrypt.hash(password,10);
                    
                    // set password from user 
                    const setNewPassword = await Professors.findOneAndUpdate({email:email}, {password: encryptedPassword, confirmpassword: encryptedPassword });
                    
                    setNewPassword.save();
            
                }catch(e){
                    throw new ApolloError("Email is Invalid");
                }
            }

        },
        createCoordinatorSchedule:async(_,{ID,professorScheduleInput:{time}}) => {
            const date = new Date(time).toISOString();
            const isoDate = new Date(date);
            const createdDate = (await Coordinator.findByIdAndUpdate({_id:ID},{$push:{availSchedule:isoDate}})).modifiedCount;
            return createdDate;
        },
        createProfessorSchedule: async(_,{ID,professorScheduleInput:{time}}) => {
            const date = new Date(time).toISOString();
            const isoDate = new Date(date);
            const createdDate = (await Professors.findByIdAndUpdate({_id:ID},{$push:{availSchedule:isoDate}})).modifiedCount;
            return createdDate;
        },
        createGroup: async (_,{groupInfo:{coordinatorId,groupName,projectField}}) =>{

            if(coordinatorId === "" || groupName === "" || projectField === ""){
                throw new ApolloError("Please fill all Fields!");
            }

            // check for unique
            const checkUniqueGroup = await Group.find({groupName:groupName});

            if(!checkUniqueGroup){
            
                const ID = Mongoose.Types.ObjectId(coordinatorId);
                
                // create a new group Document
                const newGroup = new Group({
                    coordinatorId: ID,
                    groupName: groupName,
                    projectField: projectField,
                    memberCount: 0
                });
                

                // Save user in MongoDB
                const res = await newGroup.save();

                // convert new group Id into an objectId()
                const groupId = Mongoose.Types.ObjectId(res.id);

                // add ReferencialId from new Group into Selected coordinators document
                await Coordinator.findByIdAndUpdate({_id:ID}, {$push:{groups:groupId}});
                


                // return object created 
                return{
                    id:res.id,
                    ...res._doc
                }
            }else{
                throw new ApolloError("Group Already Exists!!");
            }
        },
        addGroupMember: async(_, {addToGroup:{id, groupname}}) =>{
            if(id === "" || groupname === ""){
                throw new ApolloError("Please fill all Fields!");
            }

            const ID = Mongoose.Types.ObjectId(id);
            console.log(ID);
            const b = await Users.findOne({_id:ID});
            console.log(b);
            
            const groupExist = (await Group.findOne({groupName:groupname}));
            if(groupExist){

                const query = {groupName:groupname};
                const update = {$push:{members: ID}, $inc:{memberCount: 1}};
                const options = {upsert:false};

                const addGroupMember = (await Group.findOneAndUpdate(query, update, options)).modifiedCount;
                const a = (await Users.findOneAndUpdate({_id:ID}, {$set:{group: groupname}})).modifiedCount;

                console.log(a);
                return addGroupMember;
            }else{
                throw ApolloError("Group Does Not Exist!");
            }
        },
        deleteUser: async(_,{ID}) => {
            const wasDeletedUser = (await Users.deleteOne({_id:ID})).deletedCount;
            return wasDeletedUser;
        },
        deleteProfessor: async(_,{ID}) =>{
            const wasDeletedProfessor = (await Professors.deleteOne({_id:ID})).deletedCount;
            return wasDeletedProfessor;
        },
        editUser: async(_,{ID,userInput:{firstname,lastname,email}})=>{
            const  userEdited = (await Users.updateOne({_id:ID},{
                firstname:firstname,
                lastname:lastname,
                email:email
            })).modifiedCount;
            return userEdited;
        },
        editProfessor: async (_,{ID,professorInput:{firstname,lastname,email, coordinator}})=>{
            const professorEdit = (await Professors.updateOne({_id:ID},{
                firstname:firstname,
                lastname:lastname,
                email:email,
                coordinator: coordinator
            })).modifiedCount;
            return professorEdit;
        }
    }
}

module.exports = resolvers;
