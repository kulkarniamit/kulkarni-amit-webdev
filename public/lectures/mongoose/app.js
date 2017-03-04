(function () {
    angular
        .module("MovieApp",[])
        .controller("MovieController",MovieController);

    function MovieController($http) {
        var vm = this;
        vm.createMovie = createMovie;
        vm.deleteMovie = deleteMovie;
        vm.selectMovie = selectMovie;
        vm.updateMovie = updateMovie;
        vm.searchMovie = searchMovie;
        vm.searchMovieDetails = searchMovieDetails;
        vm.likeMovie = likeMovie;

        function init() {
            findAllMovies();
        }
        init();

        function likeMovie(movie) {
            var title = movie.Title;
            var imdbId = movie.imdbID;
            var poster = movie.Poster;
            var movie ={
                title: title,
                poster:poster,
                imdbID:imdbId
            }
            createMovie(movie);
        }
        function searchMovieDetails(imdbId) {
            var url = "http://www.omdbapi.com/?i="+imdbId;
            $http
                .get(url)
                .then(renderMovieDetails, function (err) {
                    console.log(err);
                })
        }
        function renderMovieDetails(result) {
            console.log(result.data);
            vm.movieDetails = result.data;
        }
        function searchMovie(movie) {
            var url = "http://www.omdbapi.com/?s="+movie.searchTitle;
            $http
                .get(url)
                .then(renderSearchResults, function (err) {
                    console.log(err);
                })
        }
        function renderSearchResults(results) {
            vm.movieSearchResults = results.data.Search;
            console.log(vm.movieSearchResults);
        }
        function updateMovie(movie) {
            $http
                .put("/api/lectures/movie/"+movie._id, movie)
                .then(findAllMovies,function (err) {
                    console.log(err);
                });
        }
        function renderMovie(response) {
            vm.movie = response.data;
        }
        function selectMovie(movieId) {
            $http
                .get("/api/lectures/movie/"+movieId)
                .then(renderMovie,function (err) {
                    console.log(err);
                });
        }
        function findAllMovies() {
            $http
                .get("/api/lectures/movie")
                .then(renderMovies);
        }
        function createMovie(movie) {
            // delete movie._id;
            $http
                .post("/api/lectures/movie", movie)
                .then(findAllMovies,function (err) {
                });
        }
        function renderMovies(response) {
            var movies = response.data;
            vm.movies = movies;
        }
        function deleteMovie(movieId) {
            $http
                .delete("/api/lectures/movie/"+movieId)
                .then(findAllMovies,function (err) {
                    console.log(err);
                });
        }
    }
})();
