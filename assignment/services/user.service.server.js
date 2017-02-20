module.exports = function (app) {
    var users = [
        {_id: "123", username : "alice", password : "alice", email:"alice@gmail.com", firstName: "Alice", lastName: "Wonder"},
        {_id: "234", username : "bob", password : "bob", email:"bob@gmail.com", firstName: "Bob", lastName: "Marley"},
        {_id: "345", username : "charly", password : "charly", email:"charly@gmail.com", firstName: "Charly", lastName: "Garcia"},
        {_id: "456", username : "jannunzi", password : "jannunzi", email:"jannunaziato@gmail.com", firstName: "Jose", lastName: "Annunzi"}
    ];

    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.post("/api/user", createUser);
    app.delete("/api/user/:userId", deleteUser);

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
        var user = users.find(function (user) {
            return user.username == usernamesent;
        })
        if(user){
            // Username already taken
            res.json(user);
        }
        else{
            // Username available for registration
            res.sendStatus(404);
        }
    }
    function findUserByCredentials(req, res) {
        var username = req.query["username"];
        var password = req.query["password"];
        var user = users.find(function(u){
            return u.username == username && u.password == password;
        })
        res.send(user);
    }
    function findUserById(req, res) {
        var userId = req.params.userId;
        var user = users.find(function (user) {
            return user._id == userId;
        });
        res.json(user);
    }
    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        for(var u in users) {
            var user = users[u];
            if( user._id === userId ) {
                users[u].firstName = newUser.firstName;
                users[u].lastName = newUser.lastName;
                users[u].email = newUser.email;
                res.json(users[u]);
                return;
            }
        }
    }
    function createUser(req, res){
        var user = req.body;
        var userId = (parseInt(users[users.length -1]._id) + 1).toString();
        var newUser = {_id: userId,
                        username: user.username,
                        password: user.password,
                        email: user.email,
                        firstName: user.firstname,
                        lastName: user.lastname};
        users.push(newUser);
        res.json(newUser);
    }
    function deleteUser(req, res) {
        var userId = req.params.userId;
        for(var u in users) {
            var user = users[u];
            if( user._id === userId ) {
                users.splice(u,1);
                res.sendStatus(200);
                return;
            }
        }
        // User not found
        res.sendStatus(404);
    }
}