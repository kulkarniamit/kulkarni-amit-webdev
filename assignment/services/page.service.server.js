module.exports = function (app, pageModel) {
    app.post("/api/website/:websiteId/page",createPage);
    app.get("/api/website/:websiteId/page",findAllPagesForWebsite);
    app.get("/api/page/:pageId",findPageById);
    app.put("/api/page/:pageId",updatePage);
    app.delete("/api/page/:pageId", deletePage);

    function createPage(req, res){
        var wid = req.params.websiteId;
        var newPage = req.body;
        pageModel
            .createPage(wid, newPage)
            .then(function (page) {
                res.json(page);
            }, function (err) {
                res.sendStatus(404);
            });
    }
    function findAllPagesForWebsite(req, res){
        var wid = req.params.websiteId;

        pageModel
            .findAllPagesForWebsite(wid)
            .then(function (pages) {
                res.json(pages);
            }, function (err) {
                res.sendStatus(404);
            });
    }
    function findPageById(req, res){
        var pageId = req.params.pageId;
        pageModel
            .findPageById(pageId)
            .then(function (page) {
                res.json(page);
            }, function (err) {
                res.sendStatus(404);
            });
    }
    function updatePage(req, res){
        var pageId = req.params.pageId;
        var updatedPage = req.body;
        pageModel
            .updatePage(pageId, updatedPage)
            .then(function (response) {
                if(response.ok === 1 && response.n === 1){
                // if(response.nModified === 1 && response.ok === 1 && response.n === 1){
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(404);
            });
    }
    function deletePage(req, res){
        var pageId = req.params.pageId;
        pageModel
            .deletePage(pageId)
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
};