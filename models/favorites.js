const mongoose = require('mongoose');

const sheama = mongoose.Schema;

const FavoriteSheamea = new sheama({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    dishes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Dishes'
        }
    ]
    },
    {
        timestamps :true
    });

    const Favorites = mongoose.model('Favorites',FavoriteSheamea);

    module.exports = Favorites;