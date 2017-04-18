module.exports = function (app, articleModel) {
    app.get("/api/project/articlecount",getArticleCount);
    app.post("/api/project/article", createArticle);
    app.delete("/api/project/user/:userId/publisher/article/:articleId",removeArticle);
    app.get("/api/project/user/publisher/articles/:publisherId",findArticlesByPublisher);
    app.get("/api/project/article/:articleId",findArticleById);
    app.get("/api/project/admin/articles",adminAuthentication, findAllArticles);

    function getArticleCount(req, res) {
        articleModel
            .getArticleCount()
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            })
    }
    function adminAuthentication(req, res, next) {
        if(req.user && req.isAuthenticated() && req.user.role == "ADMIN"){
            next();
        }
        else{
            // Unauthorized
            res.sendStatus(401);
        }
    }
    function findAllArticles(req, res) {
        articleModel
            .findAllArticles()
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            })
    }
    function createArticle(req, res) {
        if(req.user){
            var userId = req.user._id;
        }
        else{
            res.sendStatus(401);
            return;
        }
        var newArticle = req.body;
        articleModel
            .createArticle(userId, newArticle)
            .then(function (article) {
                res.send(article);
            },function (err) {
                res.sendStatus(404);
            })
    }

    function findArticlesByPublisher(req, res) {
        var publisherId = req.params.publisherId;
        articleModel
            .findArticlesByPublisher(publisherId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            })
    }

    function removeArticle(req, res) {
        var articleId = req.params.articleId;
        articleModel
            .removeArticle(articleId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            })
    }

    function findArticleById(req, res) {
        var articleId = req.params.articleId;
        articleModel
            .findArticleById(articleId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.send(err);
            });
    }
};

