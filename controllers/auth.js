const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../config/errors");
const jwt = require("jsonwebtoken");

//************** REGISTER THE USER ***************/
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token: token,
  });
};


//************** LOGIN THE USER ****************/
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  
  if(!isPasswordValid){
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    message: "Success",
    user: {
      name: user.name,
    },
    token: token,
  });
};

module.exports = {
  register,
  login,
};
