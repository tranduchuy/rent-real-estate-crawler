const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const services = require('./services');
var _ = require('lodash');
const cheerio = require('cheerio')
// var models = require('../models');
// var userModels = models['UserModel'];
var config = require('config');
var HelperService = require('./helper.service');
var fs = require('fs');

const crawlerImage = function (c, url) {
    try {
        
        c.queue([{
            uri: url,
            jQuery: CRAWLER_CONFIG.jQuery,
            retries: CRAWLER_CONFIG.retries,
            retryTimeout: CRAWLER_CONFIG.retryTimeout,
            rateLimit: CRAWLER_CONFIG.rateLimit,
            headers: CRAWLER_CONFIG.Headers,
            
            callback: function (error, res, done) {
                
                logger.info('CRAWLER IMAGE CALLBACK STATUSCODE: ' + JSON.stringify(res.statusCode) + '. REQUEST.URI.HREF: ' + JSON.stringify(res.request.uri.href));
                
                if (error)
                    logger.error('CRAWLER IMAGE CALLBACK GET DOCUMENT FROM SOURCE ERROR' + JSON.stringify(error.stack));
                
                else {
                    fs.createWriteStream(res.options.filename).write(res.body);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER IMAGE CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
}

module.exports = {
    crawlerImage,
}