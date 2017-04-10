module.exports = function() {
    var mongoose = require("mongoose");
    var CommentSchema = mongoose.Schema({
        _userId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        _articleId:{type: mongoose.Schema.Types.ObjectId, ref: 'ArticleModel'},
        comment: String,
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "project.comments"});
    return CommentSchema;
};