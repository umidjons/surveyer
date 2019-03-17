const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const UserSchema = new mongoose.Schema(
  {
    username: {type: String, required: true, lowercase: true, unique: true, match: /^([a-z0-9])+$/, index: true},
    password: {type: String, required: true},
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    email: {type: String, default: '', match: /^\S+@\S+\.\S+$/}
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

UserSchema.methods.setPassword = async function(password) {
  try {
    this.password = await bcrypt.hash(password, config.saltRounds);
  }
  catch (error) {
    throw error;
  }
};

UserSchema.methods.checkPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  }
  catch (error) {
    throw error;
  }
};

UserSchema.methods.generateJWT = function() {
  return jwt.sign(
    {
      id: this._id,
      username: this.username
    },
    config.secret,
    {
      expiresIn: config.tokenExpires
    }
  );
};

UserSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    token: this.generateJWT()
  };
};

UserSchema.statics.findByUsername = async function(username) {
  return await this.findOne({username}).exec();
};

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    await this.setPassword(this.password);
  }

  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
