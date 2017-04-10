module.exports = function () {
    var model = null;
    var mongoose = require("mongoose");
    var CommentSchema = require('./comment.schema.server.js')();
    var CommentModel = mongoose.model('CommentModel', CommentSchema);

    var api = {
        "setModel": setModel
    };

    return api;

    function setModel(_model) {
        model = _model;
    }
};