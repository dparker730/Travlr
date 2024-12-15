const mongoose = require('mongoose');
const crypto = require('crypto'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JSON Web Tokens

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});

// Method to set the password for the user record
userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex'); // Generate a 16-byte random salt
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); // Generate the password hash
};

// Method to verify the password
userSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); // Generate hash for the provided password
  return this.hash === hash; // Compare the stored hash with the generated hash
};

// Method to generate a JSON Web Token
userSchema.methods.generateJWT = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name
    },
    process.env.JWT_SECRET, // Use secret from the environment variable
    { expiresIn: '1h' } // Token expires in 1 hour
  );
};

// Define and export the User model
const User = mongoose.model('users', userSchema);
module.exports = User;
