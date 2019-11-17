const uuid = require('uuid');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').User;

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

// Passport strategy for user registration
passport.use(
    'localRegister',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        User.findOne(
            {
                $or: [{ email: email }, { username: req.body.username }]
            },
            (err, user) => {
                if (err)
                    return done(err);
                if (user) {
                    if (user.email === email) {
                        req.flash('email', 'Email is already taken');

                        if (user.username === req.body.username) {
                            req.flash('username', 'Username is already taken');
                            return done(null, false);
                        } else {
                            let user = new User();
                            user.email = email;
                            user.password = user.generateHash(password);
                            user.username = req.body.username;
                            user.stream_key = uuid();
                            user.save((err) => {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
                    }
                }
            });
    }),
);

// Стратегия passport, описывающая аутентификацию пользователя
passport.use('localLogin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    (req, email, password, done) => {

        User.findOne({ 'email': email }, (err, user) => {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('email', 'Email doesn\'t exist.'));

            if (!user.validPassword(password))
                return done(null, false, req.flash('password', 'Oops! Wrong password.'));

            return done(null, user);
        });
    }));


module.exports = passport;
