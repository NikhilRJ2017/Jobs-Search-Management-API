const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');


const auth = async (req, res, next)=>{
    //check headers
    const authHeaders = req.headers.authorization;
    if(!authHeaders || !authHeaders.startsWith('Bearer')){
        throw new UnauthorizedError("Unauthorized");
    }

    const token = authHeaders.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        //?attach user to other routes if jwt successfully verified
        req.user = {
            userId: payload.userId,
            name: payload.name
        }

        next();

    } catch (error) {
        throw new UnauthorizedError("Unauthorized")
    }
}

module.exports = auth;