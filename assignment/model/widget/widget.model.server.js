module.exports = function () {
    var model = null;
    var mongoose = require("mongoose");
    var WidgetSchema = require('./widget.schema.server')();
    var WidgetModel = mongoose.model('WidgetModel', WidgetSchema);

    var api = {
        "createWidget":createWidget,
        "findAllWidgetsForPage":findAllWidgetsForPage,
        "findWidgetById":findWidgetById,
        "updateWidget":updateWidget,
        "deleteWidget":deleteWidget,
        "reorderWidget":reorderWidget,
        "setModel":setModel
    };

    return api;

    function createWidget(pageId, newWidget){

    }
    function findAllWidgetsForPage(pageId){}
    function findWidgetById(widgetId){}
    function updateWidget(widgetId, updatedWidget){}
    function deleteWidget(widgetId){}
    function reorderWidget(pageId, start, end) {}

    function setModel(_model) {
        model = _model;
    }
};