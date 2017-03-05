module.exports = function (app, websiteModel) {
    // var websites = [
    //     {_id: "123", name : "Facebook", developerId: "123", description:"Connect with friends and the world around you on Facebook."},
    //     {_id: "234", name : "Twitter", developerId: "123", description:"Our mission: To give everyone the power to create and share ideas and information instantly, without barriers."},
    //     {_id: "345", name : "Gizmodo", developerId: "111", description:"Gizmodo is a design, technology, science and science fiction website that often writes articles on politics. It was originally launched as part of the Gawker Media"},
    //     {_id: "456", name : "Tic Tac Toe", developerId: "111", description:"Tic-tac-toe is a paper-and-pencil game for two players, X and O, who take turns marking the spaces in a 3×3 grid."},
    //     {_id: "567", name : "Checkers", developerId: "333", description:"Checkers is a group of strategy board games for two players which involve diagonal moves of uniform game pieces and mandatory captures by jumping over opponent pieces. Draughts developed from alquerque."},
    //     {_id: "678", name : "Chess", developerId: "123", description:"Play chess on Chess.com - the #1 chess community with millions of members around the world. Fun stats, analysis, and training tools for players of all levels."}
    // ];

    app.post("/api/user/:userId/website",createWebsite);
    app.get("/api/user/:userId/website",findAllWebsitesForUser);
    app.get("/api/website/:websiteId",findWebsiteById);
    app.put("/api/website/:websiteId",updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function createWebsite(req, res){
        var userId = req.params.userId;
        var newwebsite = req.body;

        websiteModel
            .createWebsiteForUser(userId, newwebsite)
            .then(function (website) {
                res.json(website);
            },function (err) {
                res.sendStatus(404);
            });
        // var wid = (parseInt(websites[websites.length -1]._id) + 1).toString();
        // var newWebsite = {_id: wid,
        //     name: newwebsite.name,
        //     developerId: userId,
        //     description: newwebsite.description};
        //
        // websites.push(newWebsite);
        // res.json(newWebsite);
    }
    function findAllWebsitesForUser(req, res){
        var userId = req.params.userId;
        websiteModel
            .findAllWebsitesForUser(userId)
            .then(function (response) {
                res.json(response);
            },function (err) {
                res.sendStatus(404);
            })
        // var websitesList = websites.filter(function (website) {
        //                         return website.developerId === userId;
        //                     });
        // res.json(websitesList);
    }
    function findWebsiteById(req, res){
        var websiteId = req.params.websiteId;
        websiteModel
            .findWebsiteById(websiteId)
            .then(function (response) {
                res.json(response);
            }, function (err) {
                res.sendStatus(404);
            });
        // var website = websites.find(function (websiteObject) {
        //     return websiteObject._id == websiteId;
        // });
        // res.json(website);
    }
    function updateWebsite(req, res){
        var websiteId = req.params.websiteId;
        var updatedWebsite = req.body;
        websiteModel
            .updateWebsite(websiteId, updatedWebsite)
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
        // for(var i in websites) {
        //     var website = websites[i];
        //     if( website._id === websiteId ) {
        //         websites[i].name = updatedWebsite.name;
        //         websites[i].description = updatedWebsite.description;
        //         res.json(website);
        //     }
        // }
    }
    function deleteWebsite(req, res){
        var websiteId = req.params.websiteId;
        websiteModel
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
        // for(var i in websites) {
        //     var website = websites[i];
        //     if( website._id === websiteId ) {
        //         websites.splice(i,1);
        //         res.sendStatus(200);
        //         return;
        //     }
        // }
        // res.sendStatus(404);
    }
}
