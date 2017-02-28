(function(){
    angular
        .module('DirectiveApp',[])
        .directive('hello', helloDir)
        .directive('helloWorld', helloWorldDir)
        .directive('hahaWorld', quick)
        .directive('colorMeRed',colormeredDir)
        .directive("makeMeDraggable",makeMeDraggableDir)
        .directive('makeMeSortable',makemesortableDir);

/*
    hello can be a directive
    hello can be an attribute
    hello can be a class too
    Usually, we want it as an attribute
*/

    function  makemesortableDir() {
        function linkfunc(scope, element, attributes) {
            element.sortable({
                axis: 'y',
                scroll: false
            });
        }
        return {
            link: linkfunc
        }
    }
    function helloDir() {
        var config = {
            template:'<h2>hello from hello directive</h2>'
        }
        return config;
    }

    function helloWorldDir(){
        var config = {
            template:'<h2>Camel cased hello-world directive</h2>'
        };
        return config;
    }

    function quick() {
        var config = {
            template:'<h2>Underscores</h2>'
        };
        return config;
    }

    function colormeredDir() {
        function linkFunction(scope, element) {
            console.log(element);
            element.css('color','red');
        }
        var config ={
            link: linkFunction
        };
        return config;
    }

    function  makeMeDraggableDir() {
        function linkFunc(scope, element) {
            element.draggable();
        }
        return {
            link: linkFunc
        }
    }
})();
