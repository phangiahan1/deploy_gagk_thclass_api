const mongoose = require('mongoose');
const crypto = require('crypto'); 

const Userschema = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    studentId: String,
    picture: String,
    status: Boolean,
    salt : String,
}, {
    timestamps: true
});

// Method to set salt and hash the password for a user 
Userschema.methods.setPassword = function(pass) { 
     
 // Creating a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex'); 
  
    // Hashing user's salt and password with 1000 iterations, 
     
    this.password = crypto.pbkdf2Sync(pass, this.salt,1000, 64, `sha512`).toString(`hex`); 
}; 

// Method to set salt and hash the password for a user 
Userschema.methods.setPasswordWithSalt = function(pass,salt) { 
     
       // Hashing user's salt and password with 1000 iterations, 
        
       this.password = crypto.pbkdf2Sync(pass, salt,1000, 64, `sha512`).toString(`hex`); 
   }; 
  
// Method to check the entered password is correct or not 
Userschema.methods.validPassword = function(pass) {
     // Creating a unique salt for a particular user 
    let hash = crypto.pbkdf2Sync(pass,this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.password === hash; 
}; 

module.exports = mongoose.models.User || mongoose.model('User', Userschema);