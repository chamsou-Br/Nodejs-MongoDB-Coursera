const express = require('express');

const cookieParser = require('cookie-parser');

const app = express();

const path = require('path');

const mongoose = require('mongoose');

const bodybarser = require('body-parser');

const dishRouter = require('./Routers/dishRouter')

const PromoRouter = require('./Routers/promoRouter')

const LeaderRouter = require('./Routers/leaderRouter')

const uploadRouter = require('./routers/uploadRouter');

const session = require('express-session');

var passport = require('passport');
 
var authenticate = require('./authenticated');

const UserRouter = require('./Routers/userRouter');

const FavoriteRouter = require('./Routers/favoriteRoter')



// connection to Server 

const connect = mongoose.connect('mongodb://localhost:27017/conFusion',{ useUnifiedTopology: true , useNewUrlParser: true });

connect.then((db) => {
    console.log('Connected Correctly to Server')
}).catch((err) => console.log(err));

app.use(bodybarser.json());
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser('2002-2002-2002'));




app.use(passport.initialize());
app.use('/users',UserRouter);
/* authenticate with passport and session
app.use(session({
    name : 'session-id',
    secret : '12345-67890-09876-54321',
    saveUninitialized : false,
    resave :false,
}))
app.use(passport.session());


app.use((req, res , next) => {
    if (!req.user) {
        var err  = new Error('you are not athenticated') ;
        err.status = 403;
        next('err');
    }else {
        next();
    } 
})

// athenticate with express-session
app.use((req, res , next) => {
    if (!req.session.user) {
        var err  = new Error('you are not athenticated') ;
        err.status = 403;
        next('err');
    }else {
        if (req.session.user === 'authenticated') {
            next()
        }else {
            var err = new Error('you are not ethenticated');
            err.status = 403;
            next(err);
        }
    } 
})

// authentification with basic authentification && cookies
app.use((req, res, next) =>{
        if (!req.signedCookies.user) {
            
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
            return;
        }
      
        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            res.cookie('user','admin',{signed : true});
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');      
            err.status = 401;
            next(err);
        }      
    }else if (req.signedCookies.user === 'admin') {
        next()
    }else {
        var err = new Error('You are not atheniticated');
        err.status = 401;
        next(err)
    }
   
  })
  */

app.use('/dishes', dishRouter);

app.use('/promotions', PromoRouter);

app.use('/leaders', LeaderRouter);

app.use('/imageUpload',uploadRouter);

app.use('/favorite',FavoriteRouter);

app.use((req , res , next) => {
   
    res.statusCode = 200 ;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an express Server </h1>')
})






app.listen(5000 , () => {
    console.log('This is an express Server');
});