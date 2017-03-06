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
        "deletePageOfWebsite":deletePageOfWebsite,
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
                            // Remove the reference of this page from the websites collection
                            var pages = website.pages;
                            pages.splice(pages.indexOf(page._id),1);
                            website.save();
                            return deletePageOfWebsite(pageId);
                            // return PageModel.remove({_id:pageId});
                        }, function (err) {
                            return err;
                        });
            }, function (err) {
                return err;
            });
    }

    function recursiveDelete(widgetsOfPage, pageId) {
        if(widgetsOfPage.length == 0){
            // All widgets of page successfully deleted
            // Delete the page
            return PageModel.remove({_id: pageId})
                .then(function (response) {
                    if(response.result.n == 1 && response.result.ok == 1){
                        return response;
                    }
                }, function (err) {
                    return err;
                });
        }

        return model.widgetModel.deleteWidgetOfPage(widgetsOfPage.shift())
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return recursiveDelete(widgetsOfPage, pageId);
                }
            }, function (err) {
                return err;
            });
    }

    function deletePageOfWebsite(pageId) {
        // To be called when a website is deleted
        // No need to delete the page reference from the websites collection
        // We have already done a shift() in websites collection
        // Delete the widgets of this page and delete this page

        return PageModel.findById({_id: pageId})
            .then(function (page) {
                var widgetsOfPage = page.widgets;
                return recursiveDelete(widgetsOfPage, pageId);
            }, function (err) {
                return err;
            });

        // return PageModel.remove({_id: pageId})
        //     .then(function (response) {
        //         if(response.result.n == 1 && response.result.ok == 1){
        //             return response;
        //         }
        //         else{
        //             return 404;
        //         }
        //     }, function (err) {
        //         return err;
        //     });
    }

    function setModel(_model) {
        model = _model;
    }
};