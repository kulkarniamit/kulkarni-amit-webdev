(function(){
    angular
        .module("WebAppMaker")
        .factory("UserService",UserService);

    function UserService() {
        var users = [
            {_id: "123", username : "alice", password : "alice", email:"alice@gmail.com", firstName: "Alice", lastName: "Wonder"},
            {_id: "234", username : "bob", password : "bob", email:"bob@gmail.com", firstName: "Bob", lastName: "Marley"},
            {_id: "345", username : "charly", password : "charly", email:"charly@gmail.com", firstName: "Charly", lastName: "Garcia"},
            {_id: "456", username : "jannunzi", password : "jannunzi", email:"jannunaziato@gmail.com", firstName: "Jose", lastName: "Annunzi"}
        ];

        var api={
            "createUser":createUser,
            "findUserById":findUserById,
            "findUserByUsername":findUserByUsername,
            "findUserByCredentials":findUserByCredentials,
            "updateUser":updateUser,
            "deleteUserById":deleteUserById
        };

        return api;
        function createUser(user) {
            var userId = (parseInt(users[users.length -1]._id) + 1).toString();
            var newUser = {_id: userId,
                            username: user.username,
                            password: user.password,
                            email: user.email,
                            firstName: user.firstname,
                            lastName: user.lastname};
            users.push(newUser);
            return angular.copy(newUser);
        }
        function findUserById(userid) {
            for(var u in users) {
                var user = users[u];
                if( user._id === userid ) {
                    return angular.copy(user);
                }
            }
            return null;
        }
        function findUserByUsername(usernamesent) {
            for(var i = 0; i< users.length;i++){
                if(users[i].username === usernamesent){
                    return angular.copy(users[i]);
                }
            }
            return null;
        }
        function findUserByCredentials(username, password) {
            for(var i = 0; i < users.length; i++){
                if(users[i].username === username && users[i].password === password){
                    return users[i];
                }
            }
            return null;
        }
        function updateUser(userId, newUser) {
            for(var u in users) {
                var user = users[u];
                if( user._id === userId ) {
                    users[u].firstName = newUser.firstName;
                    users[u].lastName = newUser.lastName;
                    users[u].email = newUser.email;
                    return angular.copy(user);
                }
            }
            return null;
        }
        function deleteUserById(uid) {
            for(var u in users) {
                var user = users[u];
                if( user._id === uid ) {
                    users.splice(u,1);
                    return "success";
                }
            }
            return null;
        }
    }
})();