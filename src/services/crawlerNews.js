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

const crawlerNewsListItem = function (c, url, cate, ch, conn) {
    try {
        
        c.queue([{
            uri: url,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER NEWS LIST ITEM CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER NEWS LIST ITEM CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    const listProductItem = $(SELECTOR.NEWS.listProductItem);
                    if (listProductItem.html() === null)
                        logger.error('CRAWLER NEWS LIST ITEM CALLBACK NULL');
                    else {
                        listProductItem.each(function (index, element) {
                            let hrefItem = $(SELECTOR.NEWS.hrefItem, element).attr('href');
                            if (hrefItem === null)
                                logger.error('CRAWLER NEWS LIST ITEM CALLBACK HREF ITEM NULL');
                            else {
                                let image = $(SELECTOR.NEWS.image, element).attr('src');
                                
                                crawlerNewsDetail(c, services.getFullUrl(hrefItem), cate, image, ch, conn);
                            }
                        });
                    }
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER NEWS LIST ITEM CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
}

const crawlerNewsDetail = function (c, url, cate, image, ch, conn) {
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
                
                logger.info('CRAWLER NEWS DETAIL CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER NEWS DETAIL CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error));
                
                else {
                    const $ = cheerio.load(res.body);
                    
                    var params = {
                        title: null, //String,
                        content: null, //String,
                        cate: null, //Number,
                        image: null, //String,
                        description: null,
                        createdByType: POST_TYPE.createdByTypeCraw,
                    };
                    
                    params.cate = cate;
                    
                    if (image === null)
                        logger.error('CRAWLER NEWS DETAIL CALLBACK GET --IMAGE-- FAIL');
                    else
                        params.image = image.toString().replace('132x100', '745x510');
                    
                    const title = $(SELECTOR.NEWS.title);
                    (title.html() === null) ?
                        logger.error('CRAWLER NEWS DETAIL CALLBACK GET --TITLE-- FAIL')
                        :
                        params.title = title.text().trim();
                    
                    const description = $(SELECTOR.NEWS.description);
                    (description.html() === null) ?
                        logger.error('CRAWLER NEWS DETAIL CALLBACK GET --DESCRIPTION-- FAIL')
                        :
                        params.description = description.text().trim();
                    
                    const content = $(SELECTOR.NEWS.content);
                    (content.html() === null) ?
                        logger.error('CRAWLER NEWS DETAIL CALLBACK GET --CONTENT-- FAIL')
                        :
                        params.content = content.html();
    
                    apiService.postNews(params, ch, conn);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER NEWS DETAIL CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
}

module.exports = {
    crawlerNewsListItem,
    crawlerNewsDetail,
}