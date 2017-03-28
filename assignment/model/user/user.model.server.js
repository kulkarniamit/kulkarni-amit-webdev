module.exports = function () {
    var model = null;
    var mongoose = require("mongoose");
    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    var api = {
        "createUser": createUser,
        "findUserById":findUserById,
        "findUserbyUsername":findUserbyUsername,
        "findUserByCredentials":findUserByCredentials,
        "deleteUser":deleteUser,
        "updateUser":updateUser,
        "setModel":setModel
    };

    return api;

    function createUser(user) {
        // remember this _id from our local arrays, discard them
        // We don't need them anymore
        delete user._id;
        return UserModel.create(user);
    }
    function findUserById(userId) {
        return UserModel.findById(userId);
    }
    function findUserbyUsername(username) {
        return UserModel.find({"username":username});
    }
    function findUserByCredentials(_username, _password) {
        return UserModel.findOne({username:_username, password: _password});
    }

    function recursiveDelete(websitesOfUser, userId) {
        if(websitesOfUser.length == 0){
            // All websites of user successfully deleted
            // Delete the user
            return UserModel.remove({_id: userId})
                .then(function (response) {
                    if(response.result.n == 1 && response.result.ok == 1){
                        return response;
                    }
                }, function (err) {
                   return err;
                });
        }

        return model.websiteModel.deleteWebsiteAndChildren(websitesOfUser.shift())
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return recursiveDelete(websitesOfUser, userId);
                }
            }, function (err) {
                return err;
            });
    }

    function deleteUser(userId) {
        // Perform cascade delete to delete the associated websites
        // The websites will in turn delete the associated pages
        // The page delete will in turn delete the associated widgets
        // Perform a recursive function delete since the queries
        // are asynchronous
        return UserModel.findById({_id: userId})
            .then(function (user) {
                var websitesOfUser = user.websites;
                return recursiveDelete(websitesOfUser, userId);
            }, function (err) {
                return err;
            });
    }
    function updateUser(userId, updatedUser) {
        return UserModel.update({_id:userId},{$set:updatedUser});
    }
    function setModel(_model) {
        model = _model;
    }
};