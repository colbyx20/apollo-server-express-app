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
            console.log(`does Email Exist?? ${oldProfessor}`);
    
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
                    firstname: res.professorFName,
                    lastname: res.professorLName,
                    email: professorInfo.email,
                    privilege: professorInfo.privilege,
                    password: authProfessor.password,
                    confirm: authProfessor.confirm,
                    token: authProfessor.token

                }

            }else{
                throw new ApolloError("Invalid Email " + email, " EMAIL IS NOT VALID");
            }
    
        },
        loginUser: async (_,{loginInput: {email, password}}) => {

            if(!STUDENT_EMAIL.test(email)){

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
                        _id: professors._id,
                        firstname:professors.professorFName,
                        lastname:professors.professorLName,
                        email: professorsInfo.email,
                        token: professorsAuth.token,
                        privilege: professorsInfo.privilege
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
                    const isValidEmail = await Users.findOne({email});
                    
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

        // might take out if statement to differ between professor and coordinator
        // depends if we will have a separate register for coordinator
        createProfessorSchedule: async(_,{ID,privilege,professorScheduleInput:{time}}) => {   


            privilege === "professor" ? 
                await addDateHelper(time, privilege) : 
                "Privilege Error in Schedule";

           async function addDateHelper(time, privilege){
                const dates = [];
    
               time.forEach((times) =>{
                    times = new Date(times).toISOString();
                    dates.push(new Date(times));
                })
                
                if(privilege === "professor"){
                    const createdDate = (await Professors.updateOne({_id:ID},{$push:{availSchedule:{$each: dates}}})).modifiedCount;
                    return createdDate;
                }else{
                    const createdDate = (await Coordinator.updateOne({_id:ID},{$push:{availSchedule:{$each: dates}}})).modifiedCount;
                    return createdDate;

                }
            }

            return (addDateHelper === null);
        },
        createGroup: async (_,{groupInfo:{coordinatorId,groupName,projectField, groupNumber}}) =>{

            if(coordinatorId === "" || groupName === "" || projectField === "" || groupNumber == ""){
                throw new ApolloError("Please fill all Fields!");
            }

            // check for unique
            const checkUniqueGroup = await Group.findOne({groupNumber:groupNumber});

            console.log(checkUniqueGroup);

            // if group doesn't exist, make one
            if(!checkUniqueGroup){
            
                const ID = Mongoose.Types.ObjectId(coordinatorId);
                
                // create a new group Document
                const newGroup = new Group({
                    coordinatorId: ID,
                    groupName: groupName,
                    projectField: projectField,
                    groupNumber: groupNumber,
                    memberCount: 0
                });
                

                // Save user in MongoDB
                const res = await newGroup.save();
                
                // return res
                return{
                    id:res.id,
                    ...res._doc
                }
            }else{
                throw new ApolloError("Group Already Exists!!");
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
