module.exports = function() {
    var mongoose = require("mongoose");
    var ArticleSchema = mongoose.Schema({
        // Store the publisher ID if created by publisher
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        title: String,
        urlToImage: String,
        description: String,
        author: String,
        url: String,
        publishedAt: String,
        comments:[{type: mongoose.Schema.Types.ObjectId, ref:'CommentModel'}],
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "project.articles"});
    return ArticleSchema;
};