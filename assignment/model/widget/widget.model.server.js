module.exports = function () {
    var model = null;
    var mongoose = require("mongoose");
    var WidgetSchema = require('./widget.schema.server')();
    var WidgetModel = mongoose.model('WidgetModel', WidgetSchema);
    var fs = require("fs");
    var publicDirectory =__dirname+"/../../../public";

    var api = {
        "createWidget":createWidget,
        "findAllWidgetsForPage":findAllWidgetsForPage,
        "findWidgetById":findWidgetById,
        "updateWidget":updateWidget,
        "deleteWidget":deleteWidget,
        "deleteWidgetOfPage":deleteWidgetOfPage,
        "reorderWidget":reorderWidget,
        "setModel":setModel
    };

    return api;

    // Clean up method
    // Since we need to get rid of uploaded image for widgets of a page,
    // This model has to be prepared to delete a widget and clean up the
    // uploaded image if it is of type IMAGE
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

    function createWidget(pageId, newWidget){
        return WidgetModel
            .create(newWidget)
            .then(function (widget) {
                return model
                    .pageModel
                    .findPageById(pageId)
                    .then(function (page) {
                        widget._page = page._id;
                        page.widgets.push(widget._id);
                        widget.save();
                        page.save();
                        return widget;
                    }, function (err) {
                        return err;
                    });
            }, function (err) {
                return err;
            });
    }

    function getWidgetsRecursively(count, widgetsOfPage, widgetCollectionForPage) {
        if(count == 0){
            return widgetCollectionForPage;
        }

        return WidgetModel.findById(widgetsOfPage.shift()).select('-__v')
            .then(function (widget) {
                widgetCollectionForPage.push(widget);
                return getWidgetsRecursively(--count, widgetsOfPage, widgetCollectionForPage);
            }, function (err) {
                return err;
            });
    }
    function findAllWidgetsForPage(pageId){
        // We cannot directly perform this search  on widgets collection
        // Even though we may filter out just the documents with _page = pageId,
        // that won't maintain the order of widgets
        // Order of widgets will only be maintained in the [widgets] in
        // pages collections
        // We will have to accumulate widget[model] objects in an array
        // and then return that array
        return model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                var widgetsOfPage = page.widgets;
                var numberOfWidgets = widgetsOfPage.length;
                var widgetCollectionForPage = [];

                return getWidgetsRecursively(numberOfWidgets, widgetsOfPage, widgetCollectionForPage);
                // for(var w in widgetsOfPage){
                //     // Wont work due to asynchronous calls :(
                //     WidgetModel.findById(widgetsOfPage[w])
                //         .then(function (widget) {
                //             widgetCollectionForPage.push(widget);
                //         }, function (err) {
                //             return err;
                //         });
                // }
            }, function (err) {
                return err;
            });
    }
    function findWidgetById(widgetId){
        return WidgetModel.findById(widgetId).select('-__v');
    }
    function updateWidget(widgetId, updatedWidget){
        return WidgetModel.update({_id:widgetId},{$set: updatedWidget});
    }
    function deleteWidget(widgetId){
        return WidgetModel
            .findById(widgetId)
            .then(function (widget) {
                return model.pageModel
                    .findPageById(widget._page)
                    .then(function (page) {
                        page.widgets.splice(page.widgets.indexOf(widget._id),1);
                        page.save();
                        if(widget.type == "IMAGE"){
                            deleteUploadedImage(widget.url);
                        }
                        return WidgetModel.remove({_id:widgetId});
                    }, function (err) {
                       return err;
                    });
            }, function (err) {
               return err;
            });
    }

    function deleteWidgetOfPage(widgetId) {
        // To be called when a page is deleted
        // No need to delete the widget reference from the pages collection
        // We have already done a shift() in pages collection
        // Delete this widget and the associated local image (if present)
        // INCOMPLETE
        // Delete all the widgets
        return WidgetModel.findById(widgetId)
            .then(function (widget) {
                if(widget.type == "IMAGE"){
                    deleteUploadedImage(widget.url);
                }
                return WidgetModel.remove({_id: widgetId});
            }, function (err) {
                return err;
            });
    }

    function reorderWidget(pageId, start, end) {
        return model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);
                page.save();
                return 200;
            }, function (err) {
                return err;
            });
    }

    function setModel(_model) {
        model = _model;
    }
};