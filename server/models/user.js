/**
 * Created by Nika on 25/12/2014.
 */

var roles = require('./const.js').USER_ROLES;
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    role: {
        type: String,
        default: roles.REGULAR
    },
    local: {
        email: {
            type: String,
            unique: true,
            sparse: true
        },
        password: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        activationToken: String
    },
    facebook: {
        access_token: String,
        location: String,
        age_range: {
            min: String
        },
        address: String,
        about: String,
        id: String,
        email: String,
        first_name: String,
        gender: String,
        last_name: String,
        link: String,
        locale: String,
        name: String,
        timezone: String,
        updated_time: String,
        verified: String,
        picture: String,
        cover: String
    },
    info: {
        createDate: { type: Date, default: Date.now },
        user: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }
    },
    profile : {
        fullName: String,
        lastName: String
    }
});


// generating a hash
userSchema.methods.generateHash = function (password) {
    var bcrypt = require('bcrypt-nodejs');
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validatePassword = function (password) {
    var bcrypt = require('bcrypt-nodejs');
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
