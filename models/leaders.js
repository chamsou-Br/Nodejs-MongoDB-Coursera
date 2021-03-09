const mongoose = require('mongoose');

const sheama = mongoose.Schema;

const LeaderSheamea = new sheama({
    name : {
        type : String ,
        required : true,
        unique : true
    },
    image : {
        type : String,
        required : true
    },
    designation : {
        type : String ,
        required : true,
        default : ''
    },
    abbr : {
        type : String,
        required : true,
        default  :''
    },
    description : {
        type : String,
        required : true,
    }
    },
    {
        timestamps :true
    });

    const Leaders = mongoose.model('Leaders',LeaderSheamea);

    module.exports = Leaders