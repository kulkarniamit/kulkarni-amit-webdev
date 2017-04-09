module.exports = function() {
    var mongoose = require("mongoose");
    var UserSchema = mongoose.Schema({
        username: {type:String, required:true},
        password: String,
        firstName: String,
        lastName: String,
        email: {type:String, required:true},
        school: String,
        city: String,
        organization: String,   // Applicable if the user is a publisher
        // articles has 2 meanings depending on the user
        // [1] List of articles saved by the user for later reading
        // [2] List of articles published by a publisher
        articles: [{type: mongoose.Schema.Types.ObjectId, ref:'ArticleModel'}],
        publishers:[{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        followers:[{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        following:[{type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}],
        role: {type: String, enum: ['READER', 'ADMIN', 'PUBLISHER'], default: 'READER'},
        dateCreated: {type:Date, default: Date.now()},
        facebook: {id:String, token: String},
        google: {id:String, token: String}
    }, {collection: "project.users"});

    return UserSchema;
};