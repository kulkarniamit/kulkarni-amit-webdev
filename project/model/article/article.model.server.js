module.exports = function () {
    var model = null;
    var mongoose = require("mongoose");
    var ArticleSchema = require('./article.schema.server.js')();
    var ArticleModel = mongoose.model('ArticleModel', ArticleSchema);

    var api = {
        "createArticle"             :createArticle,
        "findAllArticles"           :findAllArticles,
        "findArticleById"           :findArticleById,
        "findArticlesByPublisher"   :findArticlesByPublisher,
        "removeArticle"             :removeArticle,
        "setModel"                  :setModel
    };

    return api;

    function createArticle(userId, newarticle) {
        // new: bool - if true, return the modified document rather than the original. defaults to false (changed in 4.0)
        // upsert: bool - creates the object if it doesn't exist. defaults to false.

        return ArticleModel
            .findOneAndUpdate({title:newarticle.title},newarticle,{new: true,upsert:true})
            .then(function (article) {
                // Article was saved, now save the reference in user
                return model.userModel
                    .findUserById(userId)
                    .then(function (user) {
                        var articleIndex = user.articles.map(function(x){return x._id.toString()}).indexOf(article._id.toString());
                        if(articleIndex == -1){
                            // Article has not been saved before
                            user.articles.push(article._id);
                            user.save();
                        }
                        return article;
                    },function (err) {
                        return err;
                    });
            },function (err) {
                        return err;
            });
    }

    function findAllArticles() {
        return ArticleModel.find();
    }
    function findArticleById(articleId) {
        return ArticleModel
            .findById(articleId)
            .populate('_user')
            .populate({
                path: 'comments',
                model: 'CommentModel',
                populate: {
                    path: '_user',
                    model: 'UserModel'
                }
            });
    // .populate('comments');
    }
    function findArticlesByPublisher(publisherId) {
        return ArticleModel
            .find({_user:publisherId})
            .sort('-createdAt');
    }

    function removeArticle(articleId) {
        return ArticleModel
            .findById({_id:articleId})
            .populate('_user')
            .then(function (article) {
                if(article._user){
                    // If the article was published by a publisher on TNN
                    article._user.articles.splice(article._user.articles.indexOf(articleId),1);
                    article._user.save();
                }
                // Delete the comments of this article as well !
                return model.commentModel
                    .deleteCommentsOfArticle(articleId)
                    .then(function (response) {
                        return ArticleModel.remove({_id: articleId});
                    },function (err) {
                        return err;
                    });
            },function (err) {
                return err;
            });
    }
/*

    function createArticleForUser(userId, article) {
        return ArticleModel
            .create(article)
            .then(
                function(article){
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
        // Delete a website, its reference in parent and its children
        return WebsiteModel.findOne({_id:websiteId}).populate('_user').then(function (website) {
            website._user.websites.splice(website._user.websites.indexOf(websiteId),1);
            website._user.save();
            return deleteWebsiteAndChildren(websiteId);
        }, function (err) {
           return err;
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

        return model.pageModel.deletePageAndChildren(pagesOfWebsite.shift())
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return recursiveDelete(pagesOfWebsite, websiteId);
                }
            }, function (err) {
                return err;
            });
    }
    function deleteWebsiteAndChildren(websiteId){
        // Delete the website and its children (pages)
        return WebsiteModel.findById({_id: websiteId}).select({'pages':1})
            .then(function (website) {
                var pagesOfWebsite = website.pages;
                return recursiveDelete(pagesOfWebsite, websiteId);
            }, function (err) {
                return err;
            });
    }

*/

    function setModel(_model) {
        model = _model;
    }
};