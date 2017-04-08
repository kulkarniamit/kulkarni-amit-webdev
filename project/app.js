module.exports = function (app) {
    var models = require('./model/models.server')();
    require("./services/user.service.server.js")(app, models.userModel);
    require("./services/article.service.server.js")(app, models.articleModel);
};