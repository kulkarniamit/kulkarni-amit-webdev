module.exports = function (app, commentModel) {
    app.post("/api/project/article/:articleId/comment",postComment);
    app.delete("/api/project/article/:articleId/comment/:commentId",deleteComment);

    function postComment(req, res) {
        var articleId = req.params.articleId;
        var comment = req.body.text;
        var userId = req.user._id;
        var newComment = {
            _user: userId,
            _article: articleId,
            comment: comment
        };
        commentModel
            .postComment(articleId, newComment)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            })
    }

    function deleteComment(req, res) {
        var articleId = req.params.articleId;
        var commentId = req.params.commentId;
        // Since the logged in user is the only person
        // who can delete his/her comment, no need to
        // pass that userId from view
        // Use it from session
        commentModel
            .deleteComment(req.user._id, articleId, commentId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            })
    }
};