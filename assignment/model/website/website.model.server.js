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
        "deleteWebsiteOfUser"   :deleteWebsiteOfUser,
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
        // To be called when a website is to be deleted
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

    function recursiveDelete(pagesOfWebsite, websiteId) {
        if(pagesOfWebsite.length == 0){
            // All pages of website successfully deleted
            // Delete the website
            return WebsiteModel.remove({_id: websiteId})
                .then(function (response) {
                    if(response.result.n == 1 && response.result.ok == 1){
                        return response;
                    }
                }, function (err) {
                    return err;
                });
        }

        return model.pageModel.deletePageOfWebsite(pagesOfWebsite.shift())
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return recursiveDelete(pagesOfWebsite, websiteId);
                }
            }, function (err) {
                return err;
            });
    }

    function deleteWebsiteOfUser(websiteId){
        // To be called when a user is deleted
        // No need to delete the website reference from the users collection
        // We have already dont a shift() in users collection
        // Delete the pages of this website and delete this website
        // INCOMPLETE
        // Delete all the pages
        // Delete all the widgets of those pages

        return WebsiteModel.findById({_id: websiteId})
            .then(function (website) {
                var pagesOfWebsite = website.pages;
                return recursiveDelete(pagesOfWebsite, websiteId);
            }, function (err) {
                return err;
            });
        //
        // return WebsiteModel.remove({_id: websiteId})
        //     .then(function (response) {
        //         if(response.result.n == 1 && response.result.ok == 1){
        //             return response;
        //         }
        //         else{
        //             return 404;
        //         }
        //     }, function (err) {
        //         return err;
        //     });
    }

    function setModel(_model) {
        model = _model;
    }
};