module.exports = function (app) {
    var widgets = [
        {_id: "123", widgetType : "HEADER", pageId: "321", size:"1", text: "GIZMODO"},
        {_id: "234", widgetType : "HEADER", pageId: "123", size:"4", text: "Something"},
        {_id: "345", widgetType : "IMAGE", pageId: "321", width:"90%", url : "https://s-media-cache-ak0.pinimg.com/originals/a2/2a/0a/a22a0a7e624943303b23cc326598c167.jpg"},
        {_id: "456", widgetType : "HTML", pageId: "123", text: "<p>Some text of paragraph</p>"},
        {_id: "567", widgetType : "HEADER", pageId: "321", size:"5", text: "Something else"},
        {_id: "678", widgetType : "YOUTUBE", pageId: "321", width:"75%", url: "https://www.youtube.com/embed/vlDzYIIOYmM"},
        {_id: "789", widgetType : "HTML", pageId: "321", text: "<p>Lorem <i>Ipsum</i> something</p>"}
    ];

    var multer = require('multer'); // npm install multer --save
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+"/../../public/uploads")
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

    function createWidget(req, res){
        var pageId = req.params.pageId;
        var widget = req.body;
        var wgid = (parseInt(widgets[widgets.length -1]._id) + 1).toString();
        var newWidget;
        switch (widget.type){
            case "HEADER":
                newWidget = {   _id: wgid,
                    widgetType: widget.type,
                    pageId: pageId,
                    size: widget.size,
                    text: widget.text};
                break;
            case "HTML":
                newWidget = {   _id: wgid,
                    widgetType: widget.type,
                    pageId: pageId,
                    text: widget.text};
                break;
            case "IMAGE":
                newWidget = {   _id: wgid,
                    widgetType: widget.type,
                    pageId: pageId,
                    width: widget.width,
                    url: widget.url};
                break;
            case "YOUTUBE":
                newWidget = {   _id: wgid,
                    widgetType: widget.type,
                    pageId: pageId,
                    width: widget.width,
                    url: widget.url};
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
        res.json(widgetsList);
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
    function deleteWidget(req, res){
        var wgid = req.params.widgetId;
        for(var i in widgets) {
            var widget = widgets[i];
            if( widget._id === wgid ) {
                widgets.splice(i,1);
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
        var myFile = req.file;

        var originalname = myFile.originalname; // File name on user's computer
        // var filename = myFile.filename; // new file name in upload folder
        var path = myFile.path; // full path of uploaded file
        var destination = myFile.destination; // folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;

        var imageWidget = widgets.find(function (widget) {
            return widget._id == widgetId;
        })
        imageWidget.width = width;
        imageWidget.url = req.protocol + '://' +req.get('host')+"/uploads/"+myFile.filename;
        res.redirect("/assignment/#/user/"+uid+"/website/"+wid+"/page/"+imageWidget.pageId+"/widget");
    }
}