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

const crawlerProjectListItem = function (c, url, type, ch, conn) {
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
                                crawlerProjectDetail(c, services.getFullUrl(hrefItem), type, ch, conn);
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

const crawlerProjectDetail = function (c, url, type, ch, conn) {
    try {
        
        c.queue([{
            uri: url,
            priority: CRAWLER_CONFIG.priorityPost,
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
                        
                        city: null, //cityCode String
                        district: null, //districtId Int
                        
                        isShowOverview: null, //boolean // show tab t???ng quan
                        type: null, //number // lo???i d??? ??n, lo???i h??nh ph??t tri???n
                        introImages: [], //string[] // list link h??nh
                        title: null, //string // t??n d??? ??n
                        address: null, //string // ?????a ch???
                        area: null, //number // t???ng di???n t??ch
                        projectScale: null, //string // quy m?? d??? ??n
                        price: null, //number // gi??
                        deliveryHouseDate: null, //number // ng??y b??n giao nh??
                        constructionArea: null, //number // di???n t??ch x??y d???ng
                        descriptionInvestor: null, //string // gi???i thi???u ch??? ?????u t??
                        description: null, //string // gi???i thi??? d??? ??n, string HTML
                        
                        isShowLocationAndDesign: null, //boolean // show tab v??? tr?? h??? t???ng, thi???t k???
                        location: null, //string // v??? tr??, string HTML
                        infrastructure: null, //string // h??? t???ng, string HTML
                        
                        isShowGround: null, //boolean // show tab m???t b???ng
                        overallSchema: [], //string[] // h??nh s?? ????? t???ng th???
                        groundImages: [], //string[] // h??nh m???t b???ng, c?? th??? c?? nhi???u h??nh
                        
                        isShowImageLibs: null, //boolean / show tab th?? vi???n ???nh
                        imageAlbums: [], //string[] // th?? vi???n ???nh
                        
                        isShowProjectProgress: null, //boolean // show tab ti???n ????? d??? ??n
                        projectProgressTitle: null, //String
                        projectProgressStartDate: null, //Number
                        projectProgressEndDate: null, //Number
                        projectProgressDate: null, //Number
                        projectProgressImages: [], //string []
                        
                        
                        isShowTabVideo: null, //boolean // show tab video
                        video: null, //string // link video, t???m th???i l???y t??? youtube
                        
                        isShowFinancialSupport: null, //boolean // show tab h??? tr??? t??i ch??nh
                        financialSupport: null, //string // h??? tr??? t??i ch??nh, string HTML
                        
                        isShowInvestor: null, //boolean // show tab ch??? ?????u t??
                        detailInvestor: null, //string // chi ti???t v??? ch??? ?????u t??, string HTML
                        createdByType: POST_TYPE.createdByTypeCraw,
                    };
                    
                    params.isShowOverview = true;
                    params.type = type;
                    params.status = STATUS.ACTIVE;
                    
                    const bannerContext = $(SELECTOR.PROJECT.bannerContext);
                    (bannerContext.html() === null) ?
                        logger.error('CRAWLER PROJECT DETAIL CALLBACK GET --BANNER CONTEXT-- FAIL')
                        :
                        services.getBannerContext(bannerContext.html(), params);
                    
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
    
                    require('./apiService').postProject(c, url, params, ch, conn);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT DETAIL CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
};

const crawlerTabLocationAndDesign = function (c, url, id, contentId, ch, conn) {
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
                        location: null, //string // v??? tr??, string HTML
                        infrastructure: null, //string // h??? t???ng, string HTML
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
                    
                    require('./apiService').updateProject(params, id, contentId, ch, conn);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB LOCATION AND DESIGN CALLBACK' + JSON.stringify(e));
    }
}

const crawlerTabGround = function (c, url, id, contentId, ch, conn) {
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
                        overallSchema: [], //string[] // h??nh s?? ????? t???ng th???
                        groundImages: [], //string[] // h??nh m???t b???ng, c?? th??? c?? nhi???u h??nh
                    };
                    
                    const overallSchema = $(SELECTOR.PROJECT.overallSchema);
                    (overallSchema.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB GROUND CALLBACK GET --OVERALL SCHEMA-- FAIL')
                        :
                        params.overallSchema.push({
                            id: overallSchema.attr('src').trim(),
                            text: ''
                        });
                    
                    const listGroundImages = $(SELECTOR.PROJECT.listGroundImages);
                    (listGroundImages.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB GROUND CALLBACK GET --LIST GROUND IMAGES-- FAIL')
                        :
                        params.groundImages = services.getlistGroundImagesProject(listGroundImages.html());
                    
                    require('./apiService').updateProject(params, id, contentId, ch, conn);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB GROUND CALLBACK' + JSON.stringify(e));
    }
};

const crawlerTabImageAlbums = function (c, url, id, contentId, ch, conn) {
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
                    
                    require('./apiService').updateProject(params, id, contentId, ch, conn);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB IMAGE ALBUMS CALLBACK' + JSON.stringify(e));
    }
};

const crawlerTabProjectProgress = function (c, url, id, contentId, ch, conn) {
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
                    
                    require('./apiService').updateProject(params, id, contentId, ch, conn);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB PROJECT PROGRESS CALLBACK' + JSON.stringify(e));
    }
};

const crawlerTabFinancialSupport = function (c, url, id, contentId, ch, conn) {
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
                        financialSupport: null, //string // h??? tr??? t??i ch??nh, string HTML
                    };
                    
                    const financialSupport = $(SELECTOR.PROJECT.financialSupport);
                    (financialSupport.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB FINACIAL SUPPORTS CALLBACK GET --FINACIAL SUPPORT-- FAIL')
                        :
                        params.financialSupport = financialSupport.html();
                    
                    require('./apiService').updateProject(params, id, contentId, ch, conn);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT TAB FINACIAL SUPPORT CALLBACK' + JSON.stringify(e));
    }
};

const crawlerTabDetailInvestor = function (c, url, id, contentId, ch, conn) {
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
                        detailInvestor: null, //string // h??? tr??? t??i ch??nh, string HTML
                    };
                    
                    const detailInvestor = $(SELECTOR.PROJECT.detailInvestor);
                    (detailInvestor.html() === null) ?
                        logger.error('CRAWLER PROJECT TAB DETAIL INVESTOR CALLBACK GET --DETAIL INVESTOR-- FAIL')
                        :
                        params.detailInvestor = detailInvestor.html();
                    
                    require('./apiService').updateProject(params, id, contentId, ch, conn);
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
    crawlerTabGround,
    crawlerTabImageAlbums,
    crawlerTabProjectProgress,
    crawlerTabFinancialSupport,
    crawlerTabDetailInvestor
}