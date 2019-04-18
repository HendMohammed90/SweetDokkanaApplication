/*jshint esversion: 6 */
/* jshint ignore:start */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//saving user object in the session
module.exports =function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'Email',passwordField: 'Password' }, (Email, Password, done) => {
          // Match user
          User.findOne({
            Email: Email
          }).then(user => {
                if (!user) {
                return done(null, false, { message: 'That Email is not registered' });
                }
        
                // Match Password
                bcrypt.compare(Password, user.Password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    // console.log(user);
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
                });
          }).catch(err => console.log(err));
        })
    );

    passport.serializeUser(function(user, done) {
    done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
    });
};


