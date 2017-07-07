const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('./config');

let app = express();

var port = 3000;

//this order is important session
app.use(session({secret: config.secret}))
//passport init
app.use(passport.initialize())
//passport session
app.use(passport.session())

// javascript
passport.use(new Auth0Strategy({
    domain: config.domain,
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL
}, function (accessToken, refreshToken, extraParams, profile, done) {
    console.log("Logged In: ", profile);
    //DO DATABASE STUFF HERE
    //Use profile.id to find user
        //if user -> done
        //else create user
            // -> done
    return done(null, profile);
}));

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {successRedirect: '/me', failureRedirect: '/login'}));

passport.serializeUser(function(user,done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.get('/me', function(req, res){
    res.send(req.user);
});

app.listen(port, function () {
    console.log("Started server on port", port);
});