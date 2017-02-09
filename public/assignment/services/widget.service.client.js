(function(){
    angular
        .module("WebAppMaker")
        .factory("WidgetService",WidgetService);

    function WidgetService() {
        var widgets = [
            {_id: "123", widgetType : "HEADER", pageId: "321", size:"1", text: "GIZMODO"},
            {_id: "234", widgetType : "HEADER", pageId: "123", size:"4", text: "Something"},
            {_id: "345", widgetType : "IMAGE", pageId: "321", width:"90%", url : "https://s-media-cache-ak0.pinimg.com/originals/a2/2a/0a/a22a0a7e624943303b23cc326598c167.jpg"},
            {_id: "456", widgetType : "HTML", pageId: "123", text: "<p>Some text of paragraph</p>"},
            {_id: "567", widgetType : "HEADER", pageId: "321", size:"5", text: "Something else"},
            {_id: "678", widgetType : "YOUTUBE", pageId: "321", width:"90%", url: "https://www.youtube.com/embed/vlDzYIIOYmM"},
            {_id: "789", widgetType : "HTML", pageId: "321", text: "<p>Lorem <i>Ipsum</i> something</p>"}
        ];

        var api = {
            "createWidget":createWidget,
            "findWidgetsByPageId":findWidgetByPageId,
            "findWidgetById":findWidgetById,
            "updateWidget":updateWidget,
            "deleteWidget":deleteWidget
        };

        return api;
        function createWidget(pageId, widget) {
        }
        function findWidgetByPageId(pid) {
            var widgetsList = [];
            for(var i = 0; i< widgets.length;i++){
                if(widgets[i].pageId === pid){
                    var widget = angular.copy(widgets[i]);
                    widgetsList.push(widget);
                }
            }
            return widgetsList;
        }
        function findWidgetById(widgetId) {
            for(var i = 0; i< widgets.length;i++){
                if(widgets[i]._id === widgetId){
                    var widget = angular.copy(widgets[i]);
                    return widget;
                }
            }
            return null;
        }
        function updateWidget() {}
        function deleteWidget() {}
    }
})();