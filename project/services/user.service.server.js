module.exports = function (app, userModel) {

    var bcrypt = require("bcrypt-nodejs");
    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL:process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id','displayName', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    };
    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.use(new LocalStrategy(localStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    app.get('/auth/facebook',passport.authenticate('facebook',{ scope : 'email'}));
    app.get('/auth/facebook/callback',passport.authenticate('facebook', {
            failureRedirect: '/project/#/login'
        }), function(req, res){
        var url = '/project/#/user/' + req.user._id.toString();
        res.redirect(url);
    });

    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(function(user) {
                    if(user) {
                        // If User exists
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            firstName:  names[0],
                            lastName:  names[1],
                            facebook: {
                                id:    profile.id,
                                token: token
                            },
                            email: profile.emails[0].value,
                            // username is a mandatory field for creating user
                            // facebook does not give username
                            username: profile.emails[0].value
                        };
                        userModel
                            .createUser(newFacebookUser)
                            .then(function (user) {
                                return done(null, user);
                            });
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                });
    }
    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel
                            .createUser(newGoogleUser)
                            .then(function (user) {
                                return done(null, user);
                            });
                    }
                },
            function(err) {
                if (err) { return done(err); }
            });
    }

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/project/#/login'
        }), function(req, res){
            var url = '/project/#/user/' + req.user._id.toString();
            res.redirect(url);
        });

    app.post("/api/project/login", passport.authenticate('local'), login);
    app.post('/api/project/logout',logout);
    app.get("/api/project/isAdmin",isAdmin);
    app.get("/api/project/admin/user",adminAuthentication, findAllUsers);
    app.post("/api/project/admin/user/create",adminAuthentication, createUser);
    app.post ('/api/project/register', register);
    app.get("/api/project/user", findUser);
    app.get ('/api/project/loggedin', loggedin);
    app.get("/api/project/user/publishers",findAllPublishers);
    app.get("/api/project/user/:userId", findUserById);
    app.get("/api/project/user/:userId/subscriber/articles",findAllSubscribedArticlesOfUser);
    app.get("/api/project/:userId/saved",findAllSavedArticlesForUser);
    app.put("/api/project/user/:userId", updateUser);
    app.put("/api/project/user/:userId/follow/:userIdToFollow",followAPerson);
    app.put("/api/project/user/:userId/unfollow/:userIdToUnfollow",unfollowAPerson);
    app.put("/api/project/user/:userId/subscribe/:publisherId",subscribe);
    app.put("/api/project/user/:userId/unsubscribe/:publisherId",unsubscribe);
    app.put("/api/project/user/:userId/article/:articleId",bookmarkArticleById);
    app.delete("/api/project/user/:userId", deleteUser);
    app.delete("/api/project/user/:userId/article/:articleId",removeBookmark);

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function localStrategy(username, password, done) {
        userModel
            // .findUserByCredentials(username, password)
            .findUserbyUsername(username)
            .then(
                function(user) {
                    if(user != null && user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function adminAuthentication(req, res, next) {
        if(req.user && req.isAuthenticated() && req.user.role == "ADMIN"){
            next();
        }
        else{
            // Unauthorized
            res.sendStatus(401);
        }
    }
    function login(req, res) {
        var user = req.user;
        res.json(user);
    }
    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }
    function isAdmin(req, res) {
        res.send(req.user && req.isAuthenticated() && req.user.role == 'ADMIN' ? req.user : '0');
    }
    function findAllUsers(req, res) {
        userModel
            .findAllUsers()
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            })
    }
    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }
    function serializeUser(user, done) {
        done(null, user);
    }
    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }
    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password){
            findUserByCredentials(req,res);
        }
        else if(username){
            findUserbyUsername(req,res);
        }
    }
    function findUserbyUsername(req, res) {
        var usernamesent = req.query.username;
        userModel
            .findUserbyUsername(usernamesent)
            .then(function (user) {
                if(user){
                    res.json(user);
                }
                else{
                    res.sendStatus(404);
                }
            },function (err) {
                res.sendStatus(404);
            });
    }
    function findUserByCredentials(req, res) {
        var username = req.query["username"];
        var password = req.query["password"];

        userModel
            .findUserByCredentials(username, password)
            .then(function (response) {
                if(response.length != 0){
                    res.json(response[0]);
                }
                else{
                    res.sendStatus(404);
                }
            },function (err) {
                res.sendStatus(404);
            });
    }
    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(function (user) {
                res.json(user);
            },function (err) {
                res.sendStatus(500);
            });
    }
    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(userId, newUser)
            .then(function (response) {
                if(response.nModified === 1){
                    // Update was successful
                    userModel
                        .findUserById(userId)
                        .then(function (response) {
                            res.json(response);
                        },function () {
                            res.sendStatus(404);
                        })
                }
                else{
                    res.sendStatus(404);
                }
            },function () {
                res.sendStatus(404);
            });
    }
    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        if(user.role == "PUBLISHER"){
            if(!user.organization || user.organization == ""){
                //Prevent a publisher from registering without an oranization name
                res.sendStatus(403);
                return;
            }
        }
        userModel
            .createUser(user)
            .then(function(user){
                if(user){
                    req.login(user, function(err) {
                        if(err) {
                            res.status(400).send(err);
                        } else {
                            res.json(user);
                        }
                    });
                }
            },function (err) {
                res.status(403).send(err.errors.username.message);
            }
        );
    }
    function createUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(function(user){
                // No need to login since the administrator has created this user
                res.json(user);
                },function (err) {
                res.send(err);
            });
    }
    function deleteUser(req, res) {
        var userId = req.params.userId;
        userModel
            .deleteUser(userId)
            .then(function (response) {
                res.sendStatus(200);
            },function (err) {
                res.sendStatus(404);
            });
    }
    function findAllSavedArticlesForUser(req, res){
        var userId = req.params.userId;
        userModel
            .findAllSavedArticlesForUser(userId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.sendStatus(404);
            });
    }
    function removeBookmark(req, res) {
        var userId = req.params.userId;
        var articleId = req.params.articleId;
        userModel
            .removeBookmark(userId,articleId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.sendStatus(404);
            })
    }
    function followAPerson(req, res) {
        var userId = req.params.userId;
        var userIdToFollow = req.params.userIdToFollow;
        userModel
            .followAPerson(userId,userIdToFollow)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            });
    }
    function unfollowAPerson(req, res) {
        var userId = req.params.userId;
        var userIdToUnfollow = req.params.userIdToUnfollow;
        userModel
            .unfollowAPerson(userId,userIdToUnfollow)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            });
    }
    function findAllPublishers(req, res) {
        userModel
            .findAllPublishers()
            .then(function (publishers) {
                res.json(publishers);
            },function (err) {
                res.sendStatus(404);
            })
    }
    function subscribe(req, res) {
        var userId = req.params.userId;
        var publisherId = req.params.publisherId;
        userModel
            .subscribe(userId,publisherId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            });
    }
    function unsubscribe(req, res) {
        var userId = req.params.userId;
        var publisherId = req.params.publisherId;
        userModel
            .unsubscribe(userId,publisherId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            });
    }
    function findAllSubscribedArticlesOfUser(req, res) {
        var userId = req.params.userId;
        userModel
            .findAllSubscribedArticlesOfUser(userId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            })
    }
    function bookmarkArticleById(req, res) {
        var userId      = req.params.userId;
        var articleId   = req.params.articleId;
        userModel
            .bookmarkArticleById(userId, articleId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            })
    }
};