module.exports = function() {
    var mongoose = require("mongoose");
    var CommentSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        _article:{type: mongoose.Schema.Types.ObjectId, ref: 'ArticleModel'},
        comment: String
    }, {
        collection: "project.comments",
        timestamps: true
    });
    return CommentSchema;
};