module.exports = function () {
    var userModel       = require("./user/user.model.server")();
    var articleModel    = require("./article/article.model.server")();
    var commentModel    = require("./comment/comment.model.server")();

    var model = {
        userModel: userModel,
        articleModel: articleModel,
        commentModel: commentModel
    };

    userModel.setModel(model);
    articleModel.setModel(model);
    commentModel.setModel(model);

    return model;
};