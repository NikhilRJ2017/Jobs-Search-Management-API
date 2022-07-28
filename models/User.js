require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
  },
});

//*********** hashing password before saving/creating the user in DB using mongoose middlewares *********** */
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//*********** Creating JWT token on all instances of user *********/
UserSchema.methods.createJWT = function () {
  const payload = {
    userId: this._id,
    name: this.name,
  };
  const secret = process.env.JWT_SECRET;
  const options = {
    algorithm: process.env.JWT_ALGO,
    expiresIn: process.env.JWT_LIFETIME,
  };
  const token = jwt.sign(payload, secret, options);
  return token;
};

//*********** Validating password for login ***********/
UserSchema.methods.comparePassword = async function(enteredPassword){
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
}


const User = mongoose.model("User", UserSchema);

module.exports = User;
