(function () {
    angular
        .module('TheNewsNetwork')
        .controller("HomeController",HomeController);
    
    function HomeController() {
        var vm = this;
        console.log("I am in home controller now");
    }
})();
