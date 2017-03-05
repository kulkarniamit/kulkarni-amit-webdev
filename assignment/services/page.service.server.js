module.exports = function (app, pageModel) {
    // var pages = [
    //     {_id: "321", name : "Post 1", websiteId: "123", description:"Lorem"},
    //     {_id: "432", name : "Post 2", websiteId: "111", description:"Lorem"},
    //     {_id: "543", name : "Post 3", websiteId: "111", description:"Lorem"},
    //     {_id: "123", name : "Post 4", websiteId: "123", description:"Lorem"},
    //     {_id: "456", name : "Post 5", websiteId: "123", description:"Lorem"}
    // ];

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
        // var pid = (parseInt(pages[pages.length -1]._id) + 1).toString();
        // var page = {_id: pid,
        //     name: newPage.name,
        //     websiteId: wid,
        //     description: newPage.description};
        // pages.push(page);
        // res.json(pages);
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

        // var pagesList = pages.filter(function (page) {
        //     return page.websiteId === wid;
        // });
        // res.json(pagesList);
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
        // var page = pages.find(function (page) {
        //     return page._id === pageId;
        // });
        // res.json(page);
    }
    function updatePage(req, res){
        var pageId = req.params.pageId;
        var updatedPage = req.body;
        pageModel
            .updatePage(pageId, updatedPage)
            .then(function (response) {
                if(response.nModified === 1 && response.ok === 1 && response.n === 1){
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(404);
            });
        // for(var i in pages) {
        //     var page = pages[i];
        //     if( page._id === pageId) {
        //         pages[i].name = updatedPage.name;
        //         pages[i].description = updatedPage.description;
        //         res.json(page);
        //         return;
        //     }
        // }
        // res.sendStatus(404);
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
        // for(var i in pages) {
        //     var page = pages[i];
        //     if( page._id === pageId) {
        //         pages.splice(i,1);
        //         res.sendStatus(200);
        //         return;
        //     }
        // }
        // res.sendStatus(404);
    }
}