module.exports = function () {
    var model = null;
    var mongoose = require("mongoose");
    var PageSchema = require('./page.schema.server')();
    var PageModel = mongoose.model('PageModel', PageSchema);

    var api = {
        "createPage":createPage,
        "findAllPagesForWebsite":findAllPagesForWebsite,
        "findPageById":findPageById,
        "updatePage":updatePage,
        "deletePage":deletePage,
        "setModel":setModel
    };

    return api;

    function createPage(websiteId, newPage){
        return PageModel
            .create(newPage)
            .then(function (page) {
                return model
                    .websiteModel
                    .findWebsiteById(websiteId)
                    .then(function (website) {
                        website.pages.push(page);
                        page._website = website._id;
                        website.save();
                        page.save();
                        return page;
                    }, function (err) {
                        return err;
                    });
            }, function (err) {
                return err;
            });
    }
    function findAllPagesForWebsite(websiteId){
        return PageModel.find({_website:websiteId});
    }
    function findPageById(pageId){
        return PageModel.findOne({_id:pageId});
    }
    function updatePage(pageId, updatedPage){
        return PageModel.update({_id:pageId},{$set: updatedPage});
    }
    function deletePage(pageId) {
        // INCOMPLETE
        // Delete the page reference in websites : DONE
        // Delete all the widgets of this page
        return PageModel
            .findOne({_id:pageId})
            .then(function (page) {
                return model
                        .websiteModel
                        .findWebsiteById({_id:page._website})
                        .then(function (website) {
                            var pages = website.pages;
                            pages.splice(pages.indexOf(page._id),1);
                            website.save();
                            return PageModel.remove({_id:pageId});
                        }, function (err) {
                            return err;
                        });
            }, function (err) {
                return err;
            });;
    }
    function setModel(_model) {
        model = _model;
    }
};