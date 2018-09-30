var amqp = require('amqplib/callback_api');
const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const services = require('./services');
var _ = require('lodash');
const cheerio = require('cheerio')
// var models = require('../models');
// var userModels = models['UserModel'];
var config = require('config');
var HelperService = require('./helper.service');
const apiService = require('./apiService');

const crawlerProjectListItem = function (c, url, type) {
    try {
        
        c.queue([{
            uri: url,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER PROJECT LIST ITEM CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER PROJECT LIST ITEM CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    const listProductItem = $(SELECTOR.PROJECT.listProductItem);
                    if (listProductItem.html() === null)
                        logger.error('CRAWLER PROJECT LIST ITEM CALLBACK NULL');
                    else {
                        listProductItem.each(function (index, element) {
                            let hrefItem = $(SELECTOR.PROJECT.hrefItem, element).attr('href');
                            if (hrefItem === null)
                                logger.error('CRAWLER PROJECT LIST ITEM CALLBACK HREF ITEM NULL');
                            else {
                                crawlerProjectDetail(c, services.getFullUrl(hrefItem), type);
                            }
                        });
                    }
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT LIST ITEM CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
}

const crawlerProjectDetail = function (c, url, type) {
    try {
        
        c.queue([{
            uri: url,
            timeout: CRAWLER_CONFIG.timeout,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER PROJECT DETAIL CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER PROJECT DETAIL CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        isShowOverview: null, //boolean // show tab tổng quan
                        type: null, //number // loại dự án, loại hình phát triển
                        introImages: [], //string[] // list link hình
                        title: null, //string // tên dự án
                        address: null, //string // địa chỉ
                        area: null, //number // tổng diện tích
                        projectScale: null, //string // quy mô dự án
                        price: null, //number // giá
                        deliveryHouseDate: null, //number // ngày bàn giao nhà
                        constructionArea: null, //number // diện tích xây dựng
                        descriptionInvestor: null, //string // giới thiệu chủ đầu tư
                        description: null, //string // giới thiệ dự án, string HTML
    
                        isShowLocationAndDesign: null, //boolean // show tab vị trí hạ tầng, thiết kế
                        location: null, //string // vị trí, string HTML
                        infrastructure: null, //string // hạ tầng, string HTML
    
                        isShowGround: null, //boolean // show tab mặt bằng
                        overallSchema: [], //string[] // hình sơ đồ tổng thể
                        groundImages: [], //string[] // hình mặt bằng, có thể có nhiều hình
    
                        isShowImageLibs: null, //boolean / show tab thư viện ảnh
                        imageAlbums: [], //string[] // thư viện ảnh
    
                        isShowProjectProgress: null, //boolean // show tab tiến đọ dự án
                        projectProgressTitle: null, //String
                        projectProgressStartDate: null, //Number
                        projectProgressEndDate: null, //Number
                        projectProgressDate: null, //Number
                        projectProgressImages: [], //string []
    
    
                        isShowTabVideo: null, //boolean // show tab video
                        video: null, //string // link video, tạm thời lấy từ youtube
    
                        isShowFinancialSupport: null, //boolean // show tab hỗ trợ tài chính
                        financialSupport: null, //string // hỗ trợ tài chính, string HTML
    
                        isShowInvestor: null, //boolean // show tab chủ đầu tư
                        detailInvestor: null, //string // chi tiết về chủ đầu tư, string HTML
                    };
                    
                    params.isShowOverview = true;
                    params.type = type;
    
                    const title = $(SELECTOR.PROJECT.title);
                    (title.html() === null) ?
                        logger.error('CRAWLER PROJECT DETAIL CALLBACK GET --TITLE-- FAIL')
                        :
                        params.title = title.text().trim();
                    
                    const introImages = $(SELECTOR.PROJECT.introImages);
                    (introImages.html() === null) ?
                        logger.error('CRAWLER PROJECT DETAIL CALLBACK GET --INTRO IMAGES-- FAIL')
                        :
                        params.introImages = services.getIntroImagesProject(introImages.html());
                    
                    const divOverview = $(SELECTOR.PROJECT.divOverview);
                    (divOverview.html() === null) ?
                        logger.error('CRAWLER PROJECT DETAIL CALLBACK GET --DIV OVERVIEW-- FAIL')
                        :
                       services.getDivOverview(divOverview.html(), params);
    
                    const description = $(SELECTOR.PROJECT.description);
                    (description.html() === null) ?
                        logger.error('CRAWLER PROJECT DETAIL CALLBACK GET --DESCRIPTION-- FAIL')
                        :
                        params.description = description.html();
                    
                    const tabs = $(SELECTOR.PROJECT.tabs);
                    (tabs.html() === null) ?
                        logger.error('CRAWLER PROJECT DETAIL CALLBACK GET --TABS-- FAIL')
                        :
                        services.getTabsUrl(tabs.html(), params);
                    
                    console.log(params);
                    // apiService.postProject(params);
                    
                    var id = '5baeff3c7c90e813fb3288a5';
                    // if (params.isShowLocationAndDesign)
                    //     crawlerTabLocationAndDesign(c, url, id);
                    // if (params.isShowGround)
                    //     crawlerTabGround(c, url, id);
                    // if (params.isShowImageLibs)
                    //     crawlerTabImageAlbums(c, url, id);
                    // if (params.isShowProjectProgress)
                    //     crawlerTabProjectProgress(c, url, id);
                    // if (params.isShowTabVideo)
                    //     //TODO
                    if (params.isShowFinancialSupport)
                        crawlerTabFinancialSupport(c, url, id);
                    // if (params.isShowInvestor)
                    //     crawlerTabDetailInvestor(c, url, id);
                    
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT DETAIL CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
};

const crawlerTabLocationAndDesign= function (c, url, id) {
    try {
        
        c.queue([{
            priority: CRAWLER_CONFIG.priority,
            uri: url + SELECTOR.PROJECT_TABS.locationAndDesign,
            timeout: CRAWLER_CONFIG.timeout,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER PROJECT TAB LOCATION AND DESIGN CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER PROJECT TAB LOCATION AND DESIGN CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        location: null, //string // vị trí, string HTML
                        infrastructure: null, //string // hạ tầng, string HTML
                    };
    
                    const location = $(SELECTOR.PROJECT.location);
                    (location.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB LOCATION AND DESIGN CALLBACK GET --LOCATION-- FAIL')
                        :
                        params.location = location.html();
    
                    const infrastructure = $(SELECTOR.PROJECT.infrastructure);
                    (infrastructure.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB LOCATION AND DESIGN CALLBACK GET --INFRASTRUCTURE-- FAIL')
                        :
                        params.infrastructure = infrastructure.html();
                    
                    apiService.updateProject(params, id);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB LOCATION AND DESIGN CALLBACK' + JSON.stringify(e));
    }
}

const crawlerTabGround= function (c, url, id) {
    try {
        
        c.queue([{
            priority: CRAWLER_CONFIG.priority,
            uri: url + SELECTOR.PROJECT_TABS.ground,
            timeout: CRAWLER_CONFIG.timeout,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER PROJECT TAB GROUND CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER PROJECT TAB GROUND CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        overallSchema: null, //string[] // hình sơ đồ tổng thể
                        groundImages: null, //string[] // hình mặt bằng, có thể có nhiều hình
                    };
    
                    const overallSchema = $(SELECTOR.PROJECT.overallSchema);
                    (overallSchema.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB GROUND CALLBACK GET --OVERALL SCHEMA-- FAIL')
                        :
                        params.overallSchema = {
                            id: overallSchema.attr('src').trim(),
                            text: ''
                        };
    
                    const listGroundImages = $(SELECTOR.PROJECT.listGroundImages);
                    (listGroundImages.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB GROUND CALLBACK GET --LIST GROUND IMAGES-- FAIL')
                        :
                        params.groundImages = services.getlistGroundImagesProject(listGroundImages.html());
                    
                    apiService.updateProject(params, id);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB GROUND CALLBACK' + JSON.stringify(e));
    }
};

const crawlerTabImageAlbums= function (c, url, id) {
    try {
        
        c.queue([{
            priority: CRAWLER_CONFIG.priority,
            uri: url + SELECTOR.PROJECT_TABS.imageLibs,
            timeout: CRAWLER_CONFIG.timeout,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER PROJECT TAB IMAGE ALBUMS CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER PROJECT TAB IMAGE ALBUMS CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        imageAlbums: null,
                    };
    
                    const imageAlbums = $(SELECTOR.PROJECT.imageAlbums);
                    (imageAlbums.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB IMAGE ALBUMS CALLBACK GET --IMAGE ALBUMS-- FAIL')
                        :
                        params.imageAlbums = services.getlistImagesAlbumsProject(imageAlbums.html());
                    
                    apiService.updateProject(params, id);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB IMAGE ALBUMS CALLBACK' + JSON.stringify(e));
    }
};

const crawlerTabProjectProgress= function (c, url, id) {
    try {
        
        c.queue([{
            priority: CRAWLER_CONFIG.priority,
            uri: url + SELECTOR.PROJECT_TABS.projectProgress,
            timeout: CRAWLER_CONFIG.timeout,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER PROJECT TAB PROJECT PROGRESS CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER PROJECT TAB PROJECT PROGRESS CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        projectProgressTitle: null, //String
                        projectProgressStartDate: null, //Number
                        projectProgressEndDate: null, //Number
                        projectProgressDate: null, //Number
                        projectProgressImages: null, //string []
                    };
    
                    const projectProgressTitle = $(SELECTOR.PROJECT.projectProgressTitle);
                    (projectProgressTitle.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB PROJECT PROGRESS CALLBACK GET --PROJECT PROGRESS TITLE-- FAIL')
                        :
                        params.projectProgressTitle = projectProgressTitle.text().trim();
    
                    const projectProgressDate = $(SELECTOR.PROJECT.projectProgressDate).attr('data-date').toString().trim();
                    (projectProgressDate === null) ?
                        logger.error('CRAWLER PROJECT TAB PROJECT PROGRESS CALLBACK GET --PROJECT PROGRESS DATE-- FAIL')
                        :
                        params.projectProgressDate = services.getProgressDateProject(projectProgressDate.toString().trim());
    
                    const projectProgressImages = $(SELECTOR.PROJECT.projectProgressImages);
                    (projectProgressImages.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB PROJECT PROGRESS CALLBACK GET --PROJECT PROGRESS IMAGE-- FAIL')
                        :
                        params.projectProgressImages = services.getProgressImageProject(projectProgressImages.html());
                    
                    apiService.updateProject(params, id);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB PROJECT PROGRESS CALLBACK' + JSON.stringify(e));
    }
};

const crawlerTabFinancialSupport= function (c, url, id) {
    try {
        
        c.queue([{
            priority: CRAWLER_CONFIG.priority,
            uri: url + SELECTOR.PROJECT_TABS.financialSupport,
            timeout: CRAWLER_CONFIG.timeout,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER PROJECT TAB FINACIAL SUPPORT STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER PROJECT TAB FINACIAL SUPPORT CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        financialSupport: null, //string // hỗ trợ tài chính, string HTML
                    };
                    
                    const financialSupport = $(SELECTOR.PROJECT.financialSupport);
                    (financialSupport.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB FINACIAL SUPPORTS CALLBACK GET --FINACIAL SUPPORT-- FAIL')
                        :
                        params.financialSupport = financialSupport.html();
                    
                    apiService.updateProject(params, id);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB FINACIAL SUPPORT CALLBACK' + JSON.stringify(e));
    }
};

const crawlerTabDetailInvestor= function (c, url, id) {
    try {
        
        c.queue([{
            priority: CRAWLER_CONFIG.priority,
            uri: url + SELECTOR.PROJECT_TABS.investor,
            timeout: CRAWLER_CONFIG.timeout,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER PROJECT TAB DETAIL INVESTOR STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER PROJECT TAB DETAIL INVESTOR CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        detailInvestor: null, //string // hỗ trợ tài chính, string HTML
                    };
                    
                    const detailInvestor = $(SELECTOR.PROJECT.detailInvestor);
                    (detailInvestor.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB DETAIL INVESTOR CALLBACK GET --DETAIL INVESTOR-- FAIL')
                        :
                        params.detailInvestor = detailInvestor.html();
                    
                    apiService.updateProject(params, id);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB DETAIL INVESTOR CALLBACK' + JSON.stringify(e));
    }
};

module.exports = {
    crawlerProjectListItem,
    crawlerProjectDetail,
    crawlerTabLocationAndDesign,
}