(function() {
    angular
        .module('WebAppMaker')
        .directive('jgaSortable', jgaSortable);

//Create a directive called jga-sortable that uses jQuery and jQueryUI to implement the reordering behavior.
    function jgaSortable() {
        function linkfunc(scope, element, attributes) {
            element.sortable({
                axis: 'y',
                cursor: "move",
                handle: ".wbdev-hamburger-style"
                // scroll: false
            });
        }
        return {
            link: linkfunc
        }
    }
})();
