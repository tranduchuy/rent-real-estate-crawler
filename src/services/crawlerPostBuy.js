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
require('../constants/api');

const crawlerPostBuyListItem = function (c, url, ch, conn) {
    try {
        
        c.queue([{
            uri: url,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER POST BUY LIST ITEM CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER POST BUY LIST ITEM CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    const listProductItem = $(SELECTOR.POST_BUY.listProductItem);
                    if (listProductItem.html() === null)
                        logger.error('CRAWLER POST BUY LIST ITEM CALLBACK NULL');
                    else {
                        listProductItem.each(function (index, element) {
                            let hrefItem = $(SELECTOR.POST_BUY.hrefItem, element).attr('href');
                            if (hrefItem === null)
                                logger.error('CRAWLER POST BUY LIST ITEM CALLBACK HREF ITEM NULL');
                            else {
                                crawlerPostBuyDetail(c, services.getFullUrl(hrefItem), ch, conn);
                            }
                        });
                    }
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER POST BUY LIST ITEM CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
}

const crawlerPostBuyDetail = function (c, url, ch, conn) {
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
                
                logger.info('CRAWLER POST BUY DETAIL CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER POST BUY DETAIL CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        title: null, //String,
                        description: null, //String,
                        keywordList: [], //Array,
    
                        formality: null, //Number,
                        type: null, //Number,
                        city: null, //String,
                        district: null, //Number,
                        ward: null, //Number,
                        street: null, //Number,
                        project: null, //String,
                        area: null, //Number,
                        price: null, //Number,
                        unit: null, //Number,
    
                        address: null, //String,
    
                        images: [], //Array,
    
                        contactName: null, //String,
                        contactAddress: null, //String,
                        contactPhone: null, //String,
                        contactMobile: null, //String,
                        contactEmail: null, //String,
                        receiveMail: null, //Boolean,
                        
                        from: null,
                        to: null,
    
                        captchaToken: API.captchaToken,
                        createdByType: POST_TYPE.createdByTypeCraw,
                    };
    
                    var urlSearchBox = $(SELECTOR.POST_BUY.urlSearchBox);
                    (urlSearchBox.html() === null) ?
                        logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --URL SEARCH BOX-- FAIL')
                        :
                        services.getSearchBoxValueFromUrl(urlSearchBox.attr('href'), params);
                    
                    const title = $(SELECTOR.POST_BUY.title);
                    (title.html() === null) ?
                        logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --TITLE-- FAIL')
                        :
                        params.title = title.text().trim();
                    
                    // const area = $(SELECTOR.POST_BUY.area);
                    // (area.html() === null) ?
                    //     logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --AREA-- FAIL')
                    //     :
                    //     services.getAreaPostBuy(area.text(), params);
                    
                    const description = $(SELECTOR.POST_BUY.description);
                    (description.html() === null) ?
                        logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --DESCRIPTION-- FAIL')
                        :
                        params.description = description.html();
                    
                    const listFeature = $(SELECTOR.POST_BUY.listFeature);
                    (listFeature.html() === null) ?
                        logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --LIST FEATURE-- FAIL')
                        :
                        services.getFeaturePostBuy(listFeature.html(), params);
                    
                    const imageList = $(SELECTOR.POST_BUY.imageList);
                    (imageList.html() === null) ?
                        logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --IMAGES LIST-- FAIL')
                        :
                        params.images = services.getImageListPostSale(imageList.html());
    
                    const contactName = $(SELECTOR.POST_BUY.contactName);
                    (contactName.html() === null) ?
                        logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --CONTACT NAME-- FAIL')
                        :
                        params.contactName = services.getValueDivRight(contactName.html());
                    
                    const contactAddress = $(SELECTOR.POST_BUY.contactAddress);
                    (contactAddress.html() === null) ?
                        logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --CONTACT ADDRESS-- FAIL')
                        :
                        params.contactAddress = services.getValueDivRight(contactAddress.html());
                    
                    const contactPhone = $(SELECTOR.POST_BUY.contactPhone);
                    (contactPhone.html() === null) ?
                        logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --CONTACT PHONE-- FAIL')
                        :
                        params.contactPhone = services.getValueDivRight(contactPhone.html());
                    
                    const contactMobile = $(SELECTOR.POST_BUY.contactMobile);
                    (contactMobile.html() === null) ?
                        logger.error('CRAWLER POST BUY DETAIL CALLBACK GET --CONTACT MOBILE-- FAIL')
                        :
                        params.contactMobile = services.getValueDivRight(contactMobile.html());
    
                    apiService.postBuy(params, ch, conn);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER POST BUY DETAIL CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
}

module.exports = {
    crawlerPostBuyListItem,
    crawlerPostBuyDetail,
}