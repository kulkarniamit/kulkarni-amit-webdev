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
            "deleteUser":deleteUser
        };

        return api;
        function createUser(user) {
            
        }
        function findUserById(userid) {
            for(var i = 0; i< users.length;i++){
                if(users[i]._id === userid){
                    var user = JSON.parse(JSON.stringify(users[i]));
                    return user;
                }
            }
            return null;
        }
        function findUserByUsername(usernamesent) {
            for(var i = 0; i< users.length;i++){
                if(users[i].username === usernamesent){
                    return users[i];
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
        function updateUser() {}
        function deleteUser() {}
    }
})();