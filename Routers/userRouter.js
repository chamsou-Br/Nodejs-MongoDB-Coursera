const express = require('express');
const bodyparser = require('body-parser');

const User = require('../models/user');

var cors  = require('./cors')

var passport = require('passport');

const UserRouter = express.Router();

var authenticate = require('../authenticated');

UserRouter.use(bodyparser.json());

UserRouter.options('*',cors.corsWithOptions,(req,res,next) => res.sendStatus(200))

UserRouter.get('/facebook/token' ,cors.cors,passport.authenticate('facebook-token'), (req , res , next) => {
    if (req.user) {
        var token = authenticate.getToken({_id : req.user._id})
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({Success : true ,token : token , status : 'you are Succefully logged in !'})
    }
    else {
        res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({Success : false, status : 'you are failed logged in !'})
    }
})

UserRouter.get('/',authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    User.find({}).then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    },(err) => next(err))
    .catch(err => next(err))
})

UserRouter.post('/signup',cors.corsWithOptions,(req,res,next) => {
    User.register(new User({username : req.body.username}),
    req.body.password , (err , user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({Error : err})
        }else{
            if (req.body.firstname) {
                user.firstname =  req.body.firstname
            }
            if (req.body.lastname) {
                user.lastname =  req.body.lastname
            }
            user.save((err , user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type','application/json');
                    res.json({Error : err})
                }else {
                    passport.authenticate('local')(req , res , () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json({Success : true , status : 'registration Succefull !'})
                })}    
            })
        }
    } )
});

UserRouter.post('/login',cors.corsWithOptions,(req , res , next) => {
    passport.authenticate('local',(err , user , info) => {
        if (err) {
            return next(err);
        }
        if (!user){
            res.statusCode = 400;
           res.setHeader('Content-Type','application/json');
           res.json({Success : false , status : 'you are failed logged in !'})
        }
        req.logIn(user,(err) => {
            if (err) {
                res.statusCode = 400;
                res.setHeader('Content-Type','application/json');
                res.json({Success : false ,status : 'login Unsucceful' ,err : 'you are failed logged in !'})
            }
            var token = authenticate.getToken({_id : req.user._id})
            res.statusCode = 400;
            res.setHeader('Content-Type','application/json');
            res.json({Success : true ,status : 'login succeful' ,token : token})
        })
    })(req , res , next) ;
  
    
});

UserRouter.get('/logout',passport.authenticate('local'),(req,res,next) => {
    if (req.user) {
        req.user = null;
        res.redirect('/');
    }else {
        var err = new Error('you are not logged in !');
        err.status = 403;
        next(err)
    }
})

UserRouter.get('/checkJWTtoken',cors.corsWithOptions,(req,res,next) => {
    passport.authenticate('jwt',{session : false},(err,user , info )=> {
        if (err) {
            return next(err)
        }
        if (!user) {
            res.statusCode = 400;
           res.setHeader('Content-Type','application/json');
          return res.json({Success : false , status : 'jwt invalid',err : info})
        }else {
            res.statusCode = 400;
           res.setHeader('Content-Type','application/json');
          return res.json({Success : true, status : 'jwt valid',user : user})
        }
    })(req,res,next);
})



module.exports =UserRouter


/*
UserRouter.post('/signup',(req,res,next) => {
    User.findOne({username : req.body.username}).then((user) => {
        if (user !== null) {
            var err = new Error('user ' + req.body.username + ' existe deja')
            err.status = 403;
            next(err)
        }else {
            return User.create({
                username : req.body.username,
                password : req.body.password
            })
        }
    }).then((user) => {
        res.status = 200;
        res.setHeader('Content-Type','application/json');
        res.json({status : 'Redgistration Successful !',user : user})
    }).catch(err => next(err))
});

UserRouter.post('/login',(req , res , next) => {
    if (!req.session.user) {
        var authHeader = req.headers.authorization;
        if(!authHeader) {
            var err = new Error('you are not Authenticated');
            err.status = 403;
            next(err);
        }
        var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
        var username = auth[0];
        var password = auth[1]
        User.findOne({username :username}).then((user)=> {
            if (user === null) {
                var err = new Error('user ' + user + ' dont existe');
                err.status = 403;
                next(err);
            }else if (user.password !== password) {
                var err = new Error('your passwourd isn\'t correct ');
                err.status = 403;
                next(err);
            }else if (user.username === username && user.password === password ) {
                req.session.user = 'authenticated' ;
             
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain');
                res.end('you are authenticated');
            }
        }).catch((err) => next(err));
    }else {
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('you are already authenticated')
    }
});

UserRouter.get('/logout',(req,res,next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }else {
        var err = new Error('you are not logged in !');
        err.status = 403;
        next(err)
    }
})*/
