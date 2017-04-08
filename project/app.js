module.exports = function (app) {
    var models = require('./model/models.server')();
    require("./services/user.service.server.js")(app, models.userModel);
};