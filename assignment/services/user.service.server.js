module.exports = function (app, userModel) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));

    app.post("/api/login", passport.authenticate('local'), login);
    app.post('/api/logout',logout);
    app.get("/api/user", findUser);
    app.get ('/api/loggedin', loggedin);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    // app.post("/api/user", createUser);
    app.post ('/api/register', register);
    app.delete("/api/user/:userId", deleteUser);
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function localStrategy(username, password, done) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    if(user != null && user.username === username && user.password === password) {
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
    function login(req, res) {
        var user = req.user;
        res.json(user);
    }
    function logout(req, res) {
        req.logOut();
        res.send(200);
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
            .then(function (users) {
                if(users.length != 0){
                    res.json(users[0]);
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
                res.sendStatus(500).send(err);
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
            }
        );
    }
    // function createUser(req, res){
    //     var user = req.body;
    //     userModel
    //         .createUser(user)
    //         .then(function (newUser) {
    //                 res.json(newUser);
    //         },function (err) {
    //             res.sendStatus(404).send(err);
    //         });
    // }
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
}