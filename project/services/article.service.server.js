module.exports = function (app, articleModel) {
    app.post("/api/project/article", createArticle);

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
/****************************************************************************
    app.post("/api/user/:userId/website",createWebsite);
    app.get("/api/user/:userId/website",findAllWebsitesForUser);
    app.get("/api/website/:websiteId",findWebsiteById);
    app.put("/api/website/:websiteId",updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function createWebsite(req, res){
        var userId = req.params.userId;
        var newwebsite = req.body;

        articleModel
            .createWebsiteForUser(userId, newwebsite)
            .then(function (website) {
                res.json(website);
            },function (err) {
                res.sendStatus(404);
            });
    }
    function findAllWebsitesForUser(req, res){
        var userId = req.params.userId;
        articleModel
            .findAllWebsitesForUser(userId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.sendStatus(404);
            });
    }
    function findWebsiteById(req, res){
        var websiteId = req.params.websiteId;
        articleModel
            .findWebsiteById(websiteId)
            .then(function (response) {
                res.json(response);
            }, function (err) {
                res.sendStatus(404);
            });
    }
    function updateWebsite(req, res){
        var websiteId = req.params.websiteId;
        var updatedWebsite = req.body;
        articleModel
            .updateWebsite(websiteId, updatedWebsite)
            .then(function (response) {
                // if(response.nModified === 1 && response.ok === 1 && response.n === 1){
                if(response.ok === 1 && response.n === 1){
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(404);
            });
    }
    function deleteWebsite(req, res){
        var websiteId = req.params.websiteId;
        articleModel
            .deleteWebsite(websiteId)
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(404);
            });
    }

****************************************************************************/
};

