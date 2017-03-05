module.exports = function () {
    var model = null;
    var mongoose = require("mongoose");
    var WebsiteSchema = require('./website.schema.server')();
    var WebsiteModel = mongoose.model('WebsiteModel', WebsiteSchema);

    var api = {
        "createWebsiteForUser"  :createWebsiteForUser,
        "findAllWebsitesForUser":findAllWebsitesForUser,
        "findWebsiteById"       :findWebsiteById,
        "updateWebsite"         :updateWebsite,
        "deleteWebsite"         :deleteWebsite,
        "setModel"              :setModel
    };

    return api;

    function createWebsiteForUser(userId, website) {
        return WebsiteModel
            .create(website)
            .then(
                function(website){
                    return model.userModel
                            .findUserById(userId)
                            .then(function (user) {
                                website._user = user._id;
                                user.websites.push(website._id);
                                website.save();
                                user.save();
                                return website;
                            },function (err) {
                                return err;
                            })
                },
                function(err){
                    return err;
            });
    }
    function findWebsiteById(websiteId){
        return WebsiteModel.findOne({_id:websiteId});
    }
    function findAllWebsitesForUser(userId){
        return WebsiteModel.find({"_user": userId});
    }
    function updateWebsite(websiteId, updatedWebsite){
        return WebsiteModel.update({_id:websiteId},{$set:updatedWebsite});
    }
    function deleteWebsite(websiteId){
        // INCOMPLETE
        // Delete all the pages
        // Delete all the widgets of those pages

        return WebsiteModel
            .findOne({_id:websiteId})
            .then(function (website) {
                // delete the references of this website
                return model.userModel
                        .findUserById(website._user)
                        .then(function (user) {
                            var websites = user.websites;
                            websites.splice(websites.indexOf(websiteId),1);
                            user.save();
                            return WebsiteModel.remove({_id:websiteId});
                        },function (err) {
                            return err;
                        })
            }, function (err) {
                console.log(repsonse);
            });
    }

    function setModel(_model) {
        model = _model;
    }
};