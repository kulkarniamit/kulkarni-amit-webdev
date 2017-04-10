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
        comments:[{type: mongoose.Schema.Types.ObjectId, ref:'CommentModel'}]
        // Since we use findOneAndUpdate, default date wont be applied, and query needs to change
        // Read more: http://mongoosejs.com/docs/defaults.html
        // dateCreated: {type:Date, default: Date.now()}
    }, {
        collection: "project.articles",
        timestamps: true
    });
    return ArticleSchema;
};