(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, $location, WidgetService, $sce) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.checkSafeHtml = checkSafeHtml;
        vm.checkSafeYouTubeUrl = checkSafeYouTubeUrl;

        function init(){
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
            if(vm.widgets.length == 0){
                vm.error = "No widgets used yet";
            }
        }
        init();

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function checkSafeYouTubeUrl(url) {
            var parts = url.split('/');
            var id = parts[parts.length - 1];
            url = "https://www.youtube.com/embed/"+id;
            console.log(url);
            return $sce.trustAsResourceUrl(url);
        }
    }
    
    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        vm.createHeaderWidget = createHeaderWidget;
        vm.createHTMLWidget = createHTMLWidget;
        vm.createImageWidget = createImageWidget;
        vm.createYoutubeWidget = createYoutubeWidget;

        function createHeaderWidget(headerSize) {
            var widget = {type: "HEADER",
                          size: headerSize.toString(),
                          text: "Sample Heading "+headerSize}
            var newWidget = WidgetService.createWidget(vm.pid, widget);
            if(newWidget != null){
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget/"+newWidget._id);
            }
        }
        function createHTMLWidget() {
            var widget = {type: "HTML",
                          text: "Sample <i>HTML</i> text"};
            var newWidget = WidgetService.createWidget(vm.pid, widget);
            if(newWidget != null){
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget/"+newWidget._id);
            }
        }
        function createImageWidget() {
            var widget = {type: "IMAGE",
                width: "100%",
                url: "https://www.djaysgourmet.com.au/wp-content/uploads/2016/02/sample.jpg"}
            var newWidget = WidgetService.createWidget(vm.pid, widget);
            if(newWidget != null){
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget/"+newWidget._id);
            }
        }
        function createYoutubeWidget() {
            var widget = {type: "YOUTUBE",
                width: "100%",
                url: "https://www.youtube.com/embed/vlDzYIIOYmM"}
            var newWidget = WidgetService.createWidget(vm.pid, widget);
            if(newWidget != null){
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget/"+newWidget._id);
            }
        }
    }
    
    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;

        vm.hasEmptyProperties = hasEmptyProperties;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function init() {
            vm.widget = WidgetService.findWidgetById(vm.wgid);
        }
        init();

        // Helper function to check if any object attribute is empty
        // Need not be exposed using vm
        function hasEmptyProperties(target) {
            for (var member in target) {
                if (target[member] == "")
                    return true;
            }
            return false;
        }

        function updateWidget(updatedWidget) {
            vm.updateerror = null;
            if(vm.hasEmptyProperties(updatedWidget)){
                // User did not set required fields
                vm.updateerror = "Could not update the widget!";
                return;
            }
            var updatedWidgetObject = WidgetService.updateWidget(vm.wgid, updatedWidget);
            if(updatedWidgetObject == null){
                vm.updateerror = "Could not update the widget!";
                return;
            }
            else{
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget");
            }
        }
        function deleteWidget(wgid) {
            var deleteResult = WidgetService.deleteWidget(wgid);
            if(deleteResult == null){
                vm.deleteerror = "Could not delete the widget!";
                return;
            }
            else{
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget");
            }
        }
    }
})();