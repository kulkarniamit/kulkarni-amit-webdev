module.exports = function () {
    // var mongoose = require('mongoose');
    // // var connectionString = 'mongodb://127.0.0.1:27017/test';
    // var connectionString = 'mongodb://127.0.0.1:27017/assignment';
    // if(process.env.MLAB_USERNAME) {
    //     connectionString = process.env.MLAB_USERNAME + ":" +
    //         process.env.MLAB_PASSWORD + "@" +
    //         process.env.MLAB_HOST + ':' +
    //         process.env.MLAB_PORT + '/' +
    //         process.env.MLAB_APP_NAME;
    // }
    // mongoose.connect(connectionString);
    //
    var userModel       = require("./user/user.model.server")();
    var articleModel    = require("./article/article.model.server")();
    var commentModel    = require("./comment/comment.model.server")();
    // var pageModel       = require("./page/page.model.server")();
    // var widgetModel     = require("./widget/widget.model.server")();

    var model = {
        userModel: userModel,
        articleModel: articleModel,
        commentModel: commentModel
        // pageModel:pageModel,
        // widgetModel:widgetModel
    };

    userModel.setModel(model);
    articleModel.setModel(model);
    commentModel.setModel(model);
    // pageModel.setModel(model);
    // widgetModel.setModel(model);

    return model;
};