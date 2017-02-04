(function(){
    angular
        .module("WebAppMaker")
        .factory("WidgetService",WidgetService);

    function WidgetService() {
        var widgets = [
            {_id: "123", widgetType : "HEADER", pageId: "321", size:"2", text: "GIZMODO"},
            {_id: "234", widgetType : "HEADER", pageId: "321", size:"4", text: "Something"},
            {_id: "345", widgetType : "IMAGE", pageId: "321", width:"100%", url : "http://www.google.com"},
            {_id: "456", widgetType : "HTML", pageId: "321", text: "<p>Some text of paragraph</p>"},
            {_id: "567", widgetType : "HEADER", pageId: "321", size:"4", text: "Something else"},
            {_id: "678", widgetType : "YOUTUBE", pageId: "321", width:"100%", url: "http://www.youtube.com/"},
            {_id: "789", widgetType : "HTML", pageId: "321", text: "<p>Lorem Ipsum something</p>"}
        ];

        var api = {
            "createWidget":createWidget,
            "findWidgetsByPageId":findWidgetByWebsiteId,
            "findWidgetById":findWidgetById,
            "updateWidget":updateWidget,
            "deleteWidget":deleteWidget
        };

        return api;
        function createWidget(pageId, widget) {
        }
    }
})();