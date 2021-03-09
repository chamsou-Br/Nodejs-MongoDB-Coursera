const express = require('express');
const bodyParser = require('body-parser');

const Favorites = require('../models/favorites');

const FavoriteRouter = express.Router();

const cors = require('./cors');

var authenticate = require('../authenticated');

FavoriteRouter.use(bodyParser.json());

FavoriteRouter.route('/')
.options(cors.corsWithOptions,(req , res) => res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser,(req , res , next) => {
    Favorites.findOne({user : req.user._id}).then((fav) => {
        if (fav != null) {
            Favorites.findOne({user : fav.user}).populate(['user','dishes']).then(fav => {
                res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(fav);
            })
            
        }else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(null);
        }
    },(err) => next(err))
    .catch(err => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Favorites.findOne({user : req.user._id}).then(fav => {
        if (fav != null) {
            console.log('oooold');
            console.log(req.body.length -1)
            for (var i = (req.body.length -1); i >= 0; i--) {
                if (fav.dishes.indexOf( req.body[i]._id) == -1){
                    fav.dishes.push(req.body[i]._id)
                }     
            }
            fav.save().then(fav => {
                Favorites.findOne({user : fav.user}).populate(['user','dishes']).then(fav => {
                res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(fav);
            })
            })
        }else {
            fav = new Favorites({user : req.user._id});
            for ( i = (req.body.length -1); i >= 0; i--) {
                fav.dishes.push(req.body[i]._id)
            }
            fav.save().then(fav => {
                Favorites.findOne({user : fav.user}).populate(['user','dishes']).then(fav => {
                    res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
                }) 
            })
        }
        
    })
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req , res,next) => {
    res.statusCode = 403;
      res.end('GET operation not supported on /Favorite/'+ req.params.dishId);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Favorites.findOne({user : req.user._id}).then(fav => {
        if (fav!= null) {
            fav.remove().then(fav => {
                Favorites.findOne({user : fav.user}).populate(['user','dishes']).then(fav => {
                    res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
                })
            })
        }
        else {
            res.statusCode = 200;
                res.setHeader('Content-Type', 'text/type');
                res.json('No favorite to delete');
        }
    },(err) => next(err)).catch(err => next(err)) 
})


FavoriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req , res) => res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser,(req , res,next) => {
          res.statusCode = 403;
            res.end('GET operation not supported on /Favorite/'+ req.params.dishId);
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Favorites.findOne({user : req.user._id}).then(fav => {
        if (fav != null) {
             if (fav.dishes.indexOf( req.params.dishId) == -1) {
                fav.dishes.push(req.params.dishId)
                fav.save().then(fav => {
                    Favorites.findOne({user : fav.user}).populate(['user','dishes']).then(fav => {
                        res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                    }) 
                })
             }else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plan');
                res.json('dishe ' + req.params.dishId + ' existe in the favorite ! ');
             }  
        }else {
            fav = new Favorites({user : req.user._id});
                fav.dishes.push(req.params.dishId)
                fav.save().then(fav => {
                    Favorites.findOne({user : fav.user}).populate(['user','dishes']).then(fav => {
                        res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                    })
                })
        }
    },(err) => next(err)).catch(err => next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req , res,next) => {
    res.statusCode = 403;
      res.end('GET operation not supported on /Favorite/'+ req.params.dishId);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Favorites.findOne({user : req.user._id}).then(fav => {
        if (fav!= null && fav.dishes.indexOf(req.params.dishId) !== -1 ) {
            var newFavDishes = fav.dishes.filter(dish => dish != req.params.dishId)
                fav.dishes = newFavDishes;
            fav.save()
            .then(fav => {
                Favorites.findOne({user : fav.user}).populate(['user','dishes']).then(fav => {
                    res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
                }) 
            })
        }
        else  if (fav === null) {
               res.statusCode = 200;
                res.setHeader('Content-Type', 'text/type');
                res.json('No favorite to delete');
        }else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/type');
            res.json('dishe ' + req.params.dishId + ' dont existe !');
        }
    },(err) => next(err)).catch(err => next(err)) 
})


module.exports = FavoriteRouter