const CustomErrorClass = require("./custom_errors");
const { StatusCodes } = require('http-status-codes');

class Unauthorized extends CustomErrorClass{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}


module.exports = Unauthorized;