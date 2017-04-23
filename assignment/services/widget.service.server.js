module.exports = function (app, widgetModel) {
    var multer = require('multer'); // npm install multer --save
    var fs = require("fs");
    var uploadsDirectory = __dirname+"/../../public/uploads";
    var publicDirectory =__dirname+"/../../public";
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(!fs.existsSync(uploadsDirectory)){
                // Directory does not exist, create one
                console.log("Going to create directory "+uploadsDirectory);
                fs.mkdir(uploadsDirectory, function(err){
                    if (err) {
                        return console.error(err);
                    }
                    console.log("Directory created successfully!");
                });
            }
            cb(null, uploadsDirectory);
        },
        filename: function (req, file, cb) {
            var extArray = file.mimetype.split("/");
            var extension = extArray[extArray.length - 1];
            cb(null, 'widget_image_' + Date.now()+ '.' +extension)
        }
    });
    var upload = multer({storage: storage});

    app.post("/api/upload",upload.single('myFile'), uploadImage);
    app.post("/api/page/:pageId/widget",createWidget);
    app.get("/api/page/:pageId/widget",findAllWidgetsForPage);
    app.get("/api/widget/:widgetId",findWidgetById);
    app.put("/api/widget/:widgetId",updateWidget);
    app.delete("/api/widget/:widgetId",deleteWidget);
    app.put("/page/:pid/widget", updateWidgetOrder);

    function createWidget(req, res){
        var pageId = req.params.pageId;
        var widget = req.body;
        var newWidget = {};
        switch (widget.type){
            case "HEADING":
                newWidget = {
                    type: widget.type,
                    size: widget.size,
                    text: widget.text};
                break;
            case "HTML":
                newWidget = {
                    type: widget.type,
                    text: widget.text};
                break;
            case "IMAGE":
                newWidget = {
                    type: widget.type,
                    width: widget.width,
                    url: widget.url};
                break;
            case "YOUTUBE":
                newWidget = {
                    type: widget.type,
                    width: widget.width,
                    url: widget.url};
                break;
            case "TEXT":
                newWidget = {
                    type: widget.type,
                    text: widget.text,
                    rows: widget.rows,
                    placeholder: widget.placeholder,
                    formatted: widget.formatted};
                break;
        }

        widgetModel
            .createWidget(pageId, newWidget)
            .then(function (widget) {
                res.json(widget);
            }, function (err) {
                res.sendStatus(404);
            });
    }
    function findAllWidgetsForPage(req, res){
        var pageId = req.params.pageId;
        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function (widgets) {
                res.json(widgets);
            }, function (err) {
                res.sendStatus(404);
            });
    }
    function findWidgetById(req, res){
        var widgetId = req.params.widgetId;
        widgetModel
            .findWidgetById(widgetId)
            .then(function (widget) {
                res.json(widget);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function widgetUpdateRequest(widgetId, updatedWidget, res) {
        widgetModel
            .updateWidget(widgetId, updatedWidget)
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
    function updateWidget(req, res){
        var widgetId = req.params.widgetId;
        var updatedWidget = req.body;

        if(updatedWidget.type == "IMAGE"){
            if(!updatedWidget.url){
                res.sendStatus(403);
                return;
            }
            if(updatedWidget.url.search('http') != -1){
                // A new URL has been inserted
                // Delete any existing image
                widgetModel
                    .findWidgetById(widgetId)
                    .then(function (widget) {
                        if(widget.url != "" && widget.url.search('http') == -1){
                            // The current URL is a stored image
                            // Delete the image
                            deleteUploadedImage(widget.url);
                        }
                        widgetUpdateRequest(widgetId, updatedWidget, res);
                    }, function (err) {
                        res.sendStatus(404);
                    });
            }
            else{
                // Ignore changes made to uploaded image path
                // User is not supposed to make changes to stored images anyway
                // User might have requested change in width of image
                widgetUpdateRequest(widgetId, updatedWidget, res);
            }
        }
        else{
            widgetUpdateRequest(widgetId, updatedWidget, res);
        }
    }
    function deleteUploadedImage(imageUrl) {
        // Local helper function
        if(imageUrl && imageUrl.search('http') == -1){
            // Locally uploaded image
            // Delete it
            fs.unlink(publicDirectory+imageUrl, function (err) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log('successfully deleted '+publicDirectory+imageUrl);
            });
        }
    }
    function deleteWidget(req, res){
        var widgetId = req.params.widgetId;
        widgetModel
            .deleteWidget(widgetId)
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    res.sendStatus(200);
                }
            }, function (err) {
                res.sendStatus(404);
            });
    }
    function uploadImage(req, res){
        var widgetId = req.body.widgetId;
        var width = req.body.width;
        var uid = req.body.uid;
        var websiteId = req.body.wid;
        var pageId = req.body.pid;
        var imageWidget = {
            width: width,
            _id:widgetId
        };

        if(req.file){
            // Make sure file was uploaded
            var myFile = req.file;
            var originalname = myFile.originalname; // File name on user's computer
            var filename = myFile.filename; // new file name in upload folder
            var path = myFile.path; // full path of uploaded file
            var destination = myFile.destination; // folder where file is saved to
            var size = myFile.size;
            var mimetype = myFile.mimetype;
            if(imageWidget.url){
                // An image URL already exists
                // User wants to replace an image, delete the old one
                deleteUploadedImage(imageWidget.url);
            }
            imageWidget.url = "/uploads/" + filename;

            widgetModel
                .updateWidget(widgetId, imageWidget)
                .then(function (response) {
                    if(response.ok === 1 && response.n === 1){
                        res.redirect("/assignment/#/user/"+uid+"/website/"+websiteId+"/page/"+pageId+"/widget");
                    }
                    else{
                        res.sendStatus(404);
                    }
                }, function (err) {
                    res.sendStatus(404);
                });

        }
        else{
            // File was not uploaded
            // Return the user to widget list page
            res.redirect("/assignment/#/user/"+uid+"/website/"+websiteId+"/page/"+pageId+"/widget");
        }
    }

    function updateWidgetOrder(req, res) {
        var pageId = req.params.pid;
        var startIndex = parseInt(req.query.initial);
        var endIndex = parseInt(req.query.final);

        widgetModel
            .reorderWidget(pageId, startIndex, endIndex)
            .then(function (response) {
                // Code will be returned
                res.sendStatus(response);
            }, function (err) {
                res.sendStatus(404);
            });
    }
};