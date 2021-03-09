const mongoose = require('mongoose');

const Sheama = mongoose.Schema;

var passport = require('passport');

var authenticate = require('../authenticated');

var PassportLocalMongoose = require('passport-local-mongoose');



const UserSheama = new Sheama({
    firstname : {
        type  : String,
        default : ''
    },
    lastname : {
        type : String,
        default : ''
    },
    facebookId :String,
    admin : {
        type : Boolean,
        default : false
    }
});

UserSheama.plugin(PassportLocalMongoose);

const User = mongoose.model('User',UserSheama);

module.exports = User;