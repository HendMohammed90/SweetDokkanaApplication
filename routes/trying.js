/*jshint esversion: 6 */
/* jshint ignore:start */

const express = require('express');
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../../models/User');
const bcrypt = require('bcryptjs')
const session = require('express-session')
router.use(passport.initialize());
router.use(passport.session());


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'login';
    next();
})

//get login
router.get('/', (req, res) => {
    res.render('login/index');
})


//login
passport.use(new LocalStrategy({ usernameField: 'username' }
    , (username, password, done) => {
        User.findOne({ username: username }).then(user => {
            if (!user) return done(null, false, { message: 'no user found' });
            bcrypt.compare(password, user.password, (err, matched) => {
                if (err) return err;
                if (matched) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password .' })
                };
            });
        });
    }));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

router.use((req, res, next) => {
    res.locals.user = req.user
    next()
});


router.post('/', (req, res, next) => {
    var user = req.body.username
    var customRedirect = user.substring(0, 1)

    if (customRedirect === "a") {
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next)
    } else if (customRedirect === "r") {
        passport.authenticate('local', {
            successRedirect: '/reception',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next)
    } else if (customRedirect === "d") {
        passport.authenticate('local', {
            successRedirect: '/doctor',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next)
    } else {
        passport.authenticate('local', {
            successRedirect: '/nurse',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next)
    }
});



//logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})




module.exports = router;const express = require('express');
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../../models/User');
const bcrypt = require('bcryptjs')
const session = require('express-session')
router.use(passport.initialize());
router.use(passport.session());


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'login';
    next();
})

//get login
router.get('/', (req, res) => {
    res.render('login/index');
})


//login
passport.use(new LocalStrategy({ usernameField: 'username' }
    , (username, password, done) => {
        User.findOne({ username: username }).then(user => {
            if (!user) return done(null, false, { message: 'no user found' });
            bcrypt.compare(password, user.password, (err, matched) => {
                if (err) return err;
                if (matched) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password .' })
                };
            });
        });
    }));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

router.use((req, res, next) => {
    res.locals.user = req.user
    next()
});


router.post('/', (req, res, next) => {
    var user = req.body.username
    var customRedirect = user.substring(0, 1)

    if (customRedirect === "a") {
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next)
    } else if (customRedirect === "r") {
        passport.authenticate('local', {
            successRedirect: '/reception',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next)
    } else if (customRedirect === "d") {
        passport.authenticate('local', {
            successRedirect: '/doctor',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next)
    } else {
        passport.authenticate('local', {
            successRedirect: '/nurse',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next)
    }
});



//logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})




module.exports = router;