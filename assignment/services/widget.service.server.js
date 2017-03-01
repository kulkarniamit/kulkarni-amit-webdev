module.exports = function (app) {
    var widgets = [
        {_id: "123", widgetType : "HEADER", pageId: "321", size:"1", text: "GIZMODO", index: 4},
        {_id: "234", widgetType : "HEADER", pageId: "123", size:"4", text: "Something", index: 1},
        {_id: "345", widgetType : "IMAGE", pageId: "321", width:"90%", url : "", index:3},
        {_id: "456", widgetType : "HTML", pageId: "123", text: "<p>Some text of paragraph</p>", index:0},
        {_id: "567", widgetType : "HEADER", pageId: "321", size:"5", text: "Something else", index:0},
        {_id: "678", widgetType : "YOUTUBE", pageId: "321", width:"75%", url: "https://www.youtube.com/embed/vlDzYIIOYmM", index:2},
        {_id: "789", widgetType : "HTML", pageId: "321", text: "<p>Lorem <i>Ipsum</i> something</p>", index:1}
    ];

    var multer = require('multer'); // npm install multer --save
    var fs = require("fs");
    var uploadsDirectory = __dirname+"/../../public/uploads";
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
            // else{
            //     console.log("uploads directory already exists");
            // }
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

    function updateWidgetOrder(req, res) {
        var pageId = req.params.pid;
        var startIndex = parseInt(req.query.initial);
        var endIndex = parseInt(req.query.final);
        var widgetsOfPage = widgets.filter(function (w) {
            return w.pageId === pageId;
        })

        var fromWidget = widgetsOfPage.find(function (w) {
            return w.index === startIndex;
        })
        var toWidget = widgetsOfPage.find(function (w) {
            return w.index === endIndex;
        })

        fromWidget.index = endIndex;

        if(startIndex < endIndex){
            // A widget moved down
            // Other widget index -= 1
            widgetsOfPage.filter(function (w) {
                return w.index > startIndex && w.index < endIndex;
            }).map(function (w) {
                    w.index -= 1;
            });
            toWidget.index -=1;
        }
        else {
            // A widget moved up
            // Other widget index += 1
            widgetsOfPage.filter(function (w) {
                return w.index < startIndex && w.index > endIndex;
            }).map(function (w) {
                w.index += 1;
            });
            toWidget.index +=1;
        }
        res.sendStatus(200);
    }
    function createWidget(req, res){
        var pageId = req.params.pageId;
        var widget = req.body;
        var wgid = (parseInt(widgets[widgets.length -1]._id) + 1).toString();
        // Find the highest index in that page and increment it by 1 for the new widget
        var sortedWidgetsList = widgets.filter(function (w) {
                                        return w.pageId == pageId;
                                    })
                                     .sort(function (a, b) {
                                        return a.index < b.index;
                                     });
        var newHighestIndex = 0;
        if(sortedWidgetsList.length != 0){
            newHighestIndex = sortedWidgetsList[0].index + 1;
        }
        var newIndex = newHighestIndex;

        var newWidget = {};
        switch (widget.type){
            case "HEADER":
                newWidget = {   _id: wgid,
                    widgetType: widget.type,
                    pageId: pageId,
                    size: widget.size,
                    text: widget.text,
                    index: newIndex};
                break;
            case "HTML":
                newWidget = {   _id: wgid,
                    widgetType: widget.type,
                    pageId: pageId,
                    text: widget.text,
                    index: newIndex};
                break;
            case "IMAGE":
                newWidget = {   _id: wgid,
                    widgetType: widget.type,
                    pageId: pageId,
                    width: widget.width,
                    url: widget.url,
                    index: newIndex};
                break;
            case "YOUTUBE":
                newWidget = {   _id: wgid,
                    widgetType: widget.type,
                    pageId: pageId,
                    width: widget.width,
                    url: widget.url,
                    index: newIndex};
                break;
        }
        widgets.push(newWidget);
        res.json(newWidget);
    }
    function findAllWidgetsForPage(req, res){
        var pageId = req.params.pageId;
        var widgetsList = widgets.filter(function(widget){
            return widget.pageId === pageId;
        });
        // Sort by index
        var sortedWidgetList = widgetsList.sort(function (widgeta, widgetb) {
            return widgeta.index > widgetb.index;
        })
        res.json(sortedWidgetList);
    }
    function findWidgetById(req, res){
        var widgetId = req.params.widgetId;
        var widget = widgets.find(function (widget) {
            return widget._id === widgetId;
        })
        res.json(widget);
    }
    function updateWidget(req, res){
        var wgid = req.params.widgetId;
        var updatedWidget = req.body;
        for(var i in widgets) {
            var widget = widgets[i];
            if( widget._id === wgid) {
                widgets[i] = updatedWidget;
                res.json(widget);
                return;
            }
        }
        res.sendStatus(404);
    }
    function updateIndexesAfterDelete(deletedIndex, deletedWidgetPageId) {
        var widgetsToUpdate = widgets.filter(function (w) {
            return w.pageId == deletedWidgetPageId;
        })
        var widgetsToUpdateIndex = widgetsToUpdate.filter(function (w) {
            return w.index > deletedIndex;
        })
        if(widgetsToUpdateIndex){
            widgetsToUpdateIndex.map(function (widget) {
                widget.index--;
            })
        }
    }
    function deleteUploadedImage(imageName) {
        fs.unlink(uploadsDirectory+"/"+imageName, function(err){
                if (err) throw err;
                console.log('successfully deleted '+uploadsDirectory+"/"+imageName);
        });
    }
    function deleteWidget(req, res){
        var wgid = req.params.widgetId;
        var deletedIndex, deletedWidgetPageId;
        for(var i in widgets) {
            var widget = widgets[i];
            if( widget._id === wgid ) {
                deletedIndex = widget.index;
                deletedWidgetPageId = widget.pageId;
                if(widget.widgetType === "IMAGE"){
                    // Remove the uploaded image
                    var imageName = widget.url.split('//').pop().split("/").pop();
                    deleteUploadedImage(imageName);
                }
                widgets.splice(i,1);
                updateIndexesAfterDelete(deletedIndex, deletedWidgetPageId);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }
    function uploadImage(req, res){
        var widgetId = req.body.widgetId;
        var width = req.body.width;
        var uid = req.body.uid;
        var wid = req.body.wid;
        var imageWidget = widgets.find(function (widget) {
            return widget._id == widgetId;
        })
        imageWidget.width = width;

        if(req.file){
            // Make sure file was uploaded
            var myFile = req.file;
            var originalname = myFile.originalname; // File name on user's computer
            // var filename = myFile.filename; // new file name in upload folder
            var path = myFile.path; // full path of uploaded file
            var destination = myFile.destination; // folder where file is saved to
            var size = myFile.size;
            var mimetype = myFile.mimetype;
            imageWidget.url = req.protocol + '://' +req.get('host')+"/uploads/"+myFile.filename;
        }
        res.redirect("/assignment/#/user/"+uid+"/website/"+wid+"/page/"+imageWidget.pageId+"/widget");
    }
}