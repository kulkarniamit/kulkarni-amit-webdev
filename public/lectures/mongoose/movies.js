module.exports = function (app) {

    app.post("/api/lectures/movie", createMovie);
    app.put("/api/lectures/movie/:movieId", updateMovie);
    app.get("/api/lectures/movie",findAllMovies);
    app.delete("/api/lectures/movie/:movieId",deleteMovie);
    app.get("/api/lectures/movie/:movieId",findMovieById);

    var mongoose  = require('mongoose');
    var MovieSchema = mongoose.Schema({
        title: {type:String, required:true},
        rating: {type:String, enum:['G','PG','R','PG-R']},
        plot: String,
        cast: [String],
        poster: String,
        releaseDate: Date,
        boxOffice: String,
        imdbID: String,
        created: {type:Date, default: Date.now()}
    },{collection: 'movies.friday'});
    var MovieModel = mongoose.model('MovieModel',MovieSchema);

    function createMovie(req, res) {
        var movie = req.body;
        MovieModel
            .create(movie)
            .then(function (movie) {
                res.json(movie);
            },function (err) {
                res.sendStatus(404);
            })
    }
    function findAllMovies(req, res) {
        MovieModel
            .find()
            .then(function (movies) {
                res.json(movies);
            },function (err) {
                res.sendStatus(404);
            })
    }
    function deleteMovie(req, res) {
        console.log(req.params.movieId);
        var movieId = req.params.movieId;
        MovieModel
            .remove({_id:movieId})
            .then(function (response) {
                res.sendStatus(200);
            },function () {
                res.sendStatus(404);
            });
    }
    function findMovieById(req, res) {
        var movieId = req.params.movieId;
        MovieModel
            .findById(movieId)
            .then(function (movie) {
                res.json(movie);
            },function (err) {
                res.sendStatus(404);
            })
    }
    function updateMovie(req, res){
        var movieId = req.params.movieId;
        var movie = req.body;
        MovieModel
            .update({_id:movieId},
                {$set: {title:movie.title}})
            .then(function (response) {
                res.json(200);
            },function (err) {
                res.sendStatus(404);
            });

    }






    // MovieModel.remove(function () {
    //     // Mandatory to have a callback function as first parameter
    //     // Otherwise, the collection will not be dropped
    // });
    // MovieModel.create(
    //             [{title:"Terminator"},
    //             {title:"Avatar"},
    //             {title: "Jogaiiah", cast:['SRK','Dellhudgi']}],function (err,movies) {
    //                 console.log("Created the movies documents");
    //                 console.log(movies);
    //     });

    // Querying everything
    // MovieModel
    //     .find()
    //     .then(function (movies) {
    //         console.log(movies);
    //     },function (error) {
    //         console.log(error);
    //     });

    // Querying specific documents
    // MovieModel
    //     .findById("58b8f54ab3610425b48f286f")
    //     .then(function (movie) {
    //         console.log(movie);
    //     },function (err) {
    //         console.log(err);
    //     });

    // Updating existing documents
    // MovieModel
    //     .update(
    //         {_id:"58b8f54ab3610425b48f286f"},
    //         {$set: {title:"Terminal"}})
    //     .then(function (movie) {
    //         console.log(movie);
    //     },function (err) {
    //         console.log(err);
    //     });

    // Removing documents
    // MovieModel
    //     .remove({_id:"58b8f54ab3610425b48f286f"})
    //     .then(function (response) {
    //         console.log(response);
    //     },function (err) {
    //         console.log(err);
    //     });
}
