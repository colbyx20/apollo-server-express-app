const {AuthenticationError} = require('apollo-server');

const jwt = require('jsonwebtoken');

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer')[1];  // Bearer TOKEN(;akjds;alkjdf;alkjdf;akljdf)
        if(token){
            try{
                const user = jwt.verify(token,'UNSAFE_STRING'); // verify token with JWT safe string
                localStorage.setItem("token",token);
                return user;
            }catch(err){
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Not Authorized, no token");
    }
    throw new error("Authentication header must be provided");
}