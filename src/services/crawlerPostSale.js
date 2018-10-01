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

const crawlerPostSaleListItem = function (c, url, ch, conn) {
    try {
        
        c.queue([{
            uri: url,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER POST SALE LIST ITEM CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER POST SALE LIST ITEM CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    const listProductItem = $(SELECTOR.POST_SALE.listProductItem);
                    if (listProductItem.html() === null)
                        logger.error('CRAWLER POST SALE LIST ITEM CALLBACK NULL');
                    else {
                        listProductItem.each(function (index, element) {
                            let hrefItem = $(SELECTOR.POST_SALE.hrefItem, element).attr('href');
                            if (hrefItem === null)
                                logger.error('CRAWLER POST SALE LIST ITEM CALLBACK HREF ITEM NULL');
                            else {
                                crawlerPostSaleDetail(c, services.getFullUrl(hrefItem), ch, conn);
                            }
                        });
                    }
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER POST SALE LIST ITEM CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
}

const crawlerPostSaleDetail = function (c, url, ch, conn) {
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
                
                logger.info('CRAWLER POST SALE DETAIL CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER POST SALE DETAIL CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        title: null, // tiêu đề,
                        
                        formality: null,
                        type: null,
                        city: null,
                        district: null,
                        ward: null, // phường
                        street: null, // duong
                        project: null, // dự án
                        area: null,
                        price: null, // gig
                        unit: null, // đơn vị
                        address: null, // địa chỉ
                        description: null, // nội dung
                        keywordList: [],
                        streetWidth: null,
                        frontSize: null,
                        direction: null,
                        balconyDirection: null,
                        floorCount: null,
                        bedroomCount: null,
                        toiletCount: null,
                        furniture: null, // nội thất
                        
                        images: [],
                        
                        googleAddress: null,
                        
                        contactName: null,
                        contactAddress: null,
                        contactPhone: null,
                        contactMobile: null,
                        contactEmail: null,
                        receiveMail: null,
                        
                        // priority: null,
                        priorityId: null,
                        from: null,
                        to: null,
                        
                        captchaToken: API.captchaToken,
                    };
                    
                    var urlSearchBox = $(SELECTOR.POST_SALE.urlSearchBox);
                    (urlSearchBox.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --URL SEARCH BOX-- FAIL')
                        :
                        services.getSearchBoxValueFromUrl(urlSearchBox.attr('href'), params);
                    
                    const formality = HelperService.getFormilitySaleByValue(params.formality);
                    
                    const title = $(SELECTOR.POST_SALE.title);
                    (title.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --TITLE-- FAIL')
                        :
                        params.title = title.text().trim();
                    
                    const area = $(SELECTOR.POST_SALE.area);
                    (area.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --AREA-- FAIL')
                        :
                        params.area = services.getAreaPostSale(area.text());
                    
                    const price = $(SELECTOR.POST_SALE.price);
                    (price.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --PRICE-- FAIL')
                        :
                        services.getPriceAUnitPostSale(price.text(), formality, params);
                    
                    const description = $(SELECTOR.POST_SALE.description);
                    (description.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --DESCRIPTION-- FAIL')
                        :
                        params.description = description.html();
                    
                    const listFeature = $(SELECTOR.POST_SALE.listFeature);
                    (listFeature.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --LIST FEATURE-- FAIL')
                        :
                        services.getFeaturePostSale(listFeature.html(), params);
                    
                    const contact = $(SELECTOR.POST_SALE.contact);
                    (contact.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --LIST CONTACT-- FAIL')
                        :
                        services.getContactPostSale(contact.html(), params);
                    
                    const priority = $(SELECTOR.POST_SALE.priority);
                    (priority.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --PRIORITY-- FAIL')
                        :
                        services.getPriorityPostSale(priority.text(), params);
                    
                    const from = $(SELECTOR.POST_SALE.from);
                    (from.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --FROM DAY-- FAIL')
                        :
                        params.from = services.parserStringToDate(services.getFromDatePostSale(from.text()));
                    
                    const to = $(SELECTOR.POST_SALE.to);
                    (to.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --TO DAY-- FAIL')
                        :
                        params.to = services.parserStringToDate(services.getToDatePostSale(to.text()));
                    
                    const keywordList = $(SELECTOR.POST_SALE.keywordList);
                    (keywordList.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --KEY WORD LIST-- FAIL')
                        :
                        params.keywordList = services.getKeywordListPostSale(keywordList.html());
                    
                    const imageList = $(SELECTOR.POST_SALE.imageList);
                    (imageList.html() === null) ?
                        logger.error('CRAWLER POST SALE DETAIL CALLBACK GET --IMAGES LIST-- FAIL')
                        :
                        params.images = services.getImageListPostSale(imageList.html());
                    
                    apiService.postSale(params, ch, conn);
                    
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER POST SALE DETAIL CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
}

module.exports = {
    crawlerPostSaleListItem,
    crawlerPostSaleDetail,
}