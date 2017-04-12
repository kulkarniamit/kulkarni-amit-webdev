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
        "setModel":setModel,
        "findUserByFacebookId": findUserByFacebookId,
        "findUserByGoogleId":findUserByGoogleId,
        "findAllSavedArticlesForUser":findAllSavedArticlesForUser,
        "removeBookmark":removeBookmark,
        "followAPerson":followAPerson,
        "unfollowAPerson":unfollowAPerson,
        "findAllPublishers":findAllPublishers,
        "subscribe":subscribe,
        "unsubscribe":unsubscribe,
        "findAllSubscribedArticlesOfUser":findAllSubscribedArticlesOfUser,
        "bookmarkArticleById":bookmarkArticleById,
        "findAllUsers":findAllUsers
    };

    return api;

    function findAllSavedArticlesForUser(userId){
        return UserModel
            .findOne({_id: userId})
            .select({"articles":1})
            .populate({
                path: 'articles',
                model: 'ArticleModel',
                options: { sort: { createdAt: -1 }}
            });
            // .populate('articles');
    }
    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }
    function findUserByGoogleId(googleId) {
        return UserModel.findOne({'google.id': googleId});
    }

    function createUser(user) {
        return UserModel.create(user);
    }
    function findUserById(userId) {
        return UserModel
            .findById(userId)
            .populate('followers')
            .populate('following')
            .populate('subscribers')
            .populate('articles');
    }
    function findUserbyUsername(username) {
        return UserModel.findOne({"username":username});
        // return UserModel.findOne({"username":username}).select({ "password": 0, "dateCreated":0});
    }
    function findUserByCredentials(_username, _password) {
        return UserModel.findOne({username:_username, password: _password});
    }
    function recursiveDelete(articlesOfUser, userId) {
        if(articlesOfUser.length == 0){
            // All articles of user successfully deleted
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

        return model.articleModel.removeArticle(articlesOfUser.shift())
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return recursiveDelete(articlesOfUser, userId);
                }
            }, function (err) {
                return err;
            });
    }
    function deleteUser(userId) {
        // Perform cascade delete to delete the associated articles if
        // the user is a publisher
        // The articles will in turn delete the associated comments
        // Perform a recursive function delete since the queries
        // are asynchronous
        // return UserModel.remove({_id: userId});

        return UserModel
            .findById(userId)
            .then(function (user) {
                // Delete all the comments of this user first
                return model.commentModel
                    .deleteAllCommentsOfUser(user._id)
                    .then(function (response) {
                        // Check if the user is a publisher, if yes, delete his articles
                        if(user.role == "PUBLISHER"){
                            var articles = user.articles;
                            return recursiveDelete(articles, userId);
                        }
                        else{
                            return UserModel.remove({_id:userId});
                        }
                    },function (err) {
                        return err;
                    });
            },function (err) {
                return err;
            });

        // return UserModel.findById({_id: userId})
        //     .then(function (user) {
        //         return user;
        //         // var websitesOfUser = user.websites;
        //         // return recursiveDelete(websitesOfUser, userId);
        //     }, function (err) {
        //         return err;
        //     });
    }
    function updateUser(userId, updatedUser) {
        return UserModel.update({_id:userId},{$set:updatedUser});
    }
    function removeBookmark(userId, articleId) {
        return UserModel
            .findOne({_id:userId})
            .then(function (user) {
                user.articles.splice(user.articles.indexOf(articleId),1);
                user.save();
                return user;
            },function (err) {
                return err;
            })
    }
    function followAPerson(userId, userIdToFollow) {
        return UserModel
            .findOne({_id:userId})
            .then(function (user) {
                user.following.push(userIdToFollow);
                user.save();
                return UserModel
                    .findOne({_id:userIdToFollow})
                    .then(function (followedUser) {
                        followedUser.followers.push(userId);
                        followedUser.save();
                        return user;
                    },function (err) {
                        return err;
                    });
            },function (err) {
                return err;
            });
    }
    function unfollowAPerson(userId, userIdToUnfollow) {
        return UserModel
            .findOne({_id:userId})
            .then(function (user) {
                user.following.splice(user.following.indexOf(userIdToUnfollow),1);
                user.save();
                return UserModel
                    .findOne({_id:userIdToUnfollow})
                    .then(function (followedUser) {
                        followedUser.followers.splice(followedUser.followers.indexOf(userId),1);
                        followedUser.save();
                        return user;
                    },function (err) {
                        return err;
                    });
            },function (err) {
                return err;
            });
    }
    function findAllPublishers() {
        return UserModel.find({role:"PUBLISHER"});
    }
    function subscribe(userId, publisherId) {
        return UserModel
            .findOne({_id:userId})
            .then(function (user) {
                user.publishers.push(publisherId);
                user.save();
                return UserModel
                    .findOne({_id:publisherId})
                    .then(function (publisher) {
                        publisher.subscribers.push(userId);
                        publisher.save();
                        return user;
                    },function (err) {
                        return err;
                    });
            },function (err) {
                return err;
            });
    }
    function unsubscribe(userId, publisherId) {
        return UserModel
            .findOne({_id:userId})
            .then(function (user) {
                user.publishers.splice(user.publishers.indexOf(publisherId),1);
                user.save();
                return UserModel
                    .findOne({_id:publisherId})
                    .then(function (publisher) {
                        publisher.subscribers.splice(publisher.subscribers.indexOf(userId),1);
                        publisher.save();
                        return user;
                    },function (err) {
                        return err;
                    });
            },function (err) {
                return err;
            });
    }
    function findAllSubscribedArticlesOfUser(userId) {
        return UserModel
            .findOne({_id:userId})
            .select({"publishers":1})
            .populate({
                path: 'publishers',
                model: 'UserModel',
                populate: {
                    path: 'articles',
                    model: 'ArticleModel',
                    options: { sort: { 'createdAt': -1 }}
                }
            });
    }
    function bookmarkArticleById(userId, articleId) {
        return UserModel
            .findById(userId)
            .then(function (user) {
                user.articles.push(articleId);
                user.save();
                return user;
            },function (err) {
                return err;
            })
    }

    function findAllUsers() {
        // Retrieve all users who are not ADMIN
        return UserModel.find({ "role": { "$ne": "ADMIN" } });
    }
    function setModel(_model) {
        model = _model;
    }
};