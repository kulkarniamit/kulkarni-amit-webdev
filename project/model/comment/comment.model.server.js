module.exports = function () {
    var model = null;
    var mongoose = require("mongoose");
    var CommentSchema = require('./comment.schema.server.js')();
    var CommentModel = mongoose.model('CommentModel', CommentSchema);

    var api = {
        "postComment":postComment,
        "deleteComment":deleteComment,
        "deleteCommentsOfArticle":deleteCommentsOfArticle,
        "setModel": setModel
    };

    return api;

    function postComment(articleId, newComment) {
        return CommentModel
            .create(newComment)
            .then(function (comment) {
                // Comment generated, now add it to article comments
                return model.articleModel
                        .findArticleById(articleId)
                        .then(function (article) {
                            article.comments.unshift(comment._id);
                            article.save();
                            return CommentModel
                                    .findById(comment._id)
                                    .populate('_user')
                                    .then(function (newcomment) {
                                        return newcomment;
                                    },function (err) {
                                        return err;
                                    });
                        },function (err) {
                            return err;
                        })
            },function (err) {
                return err;
            });
    }
    function deleteComment(userId, articleId, commentId) {
        return CommentModel
            .findById(commentId)
            .populate('_article')
            .then(function (comment) {
                // Found the comment
                // Delete the comment ID from the article array of comments
                // Then delete the comment
                comment._article.comments.splice(comment._article.comments.indexOf(commentId),1);
                comment._article.save();
                return CommentModel.remove({_id:commentId});
            },function (err) {
                return err;
            })
    }
    function deleteCommentsOfArticle(articleId) {
        return CommentModel
            .remove({_article: articleId});
    }

    function setModel(_model) {
        model = _model;
    }
};