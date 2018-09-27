const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const services = require('./services');
var config = require('config');
var _ = require('lodash');
var Crawler = require("crawler");
const cheerio = require('cheerio')
// var models = require('../models');
// var userModels = models['UserModel'];
const crawlerPostSale = require('./crawlerPostSale');
const crawlerPostBuy = require('./crawlerPostBuy');
const crawlerNews = require('./crawlerNews');
const crawlerProject = require('./crawlerProject');

try {
    var c = new Crawler({
        jQuery: CRAWLER_CONFIG.jQuery,
        retries: CRAWLER_CONFIG.retries,
        retryTimeout: CRAWLER_CONFIG.retryTimeout,
        rateLimit: CRAWLER_CONFIG.rateLimit,
        headers: CRAWLER_CONFIG.Headers,
        callback: function (error, res, done) {
            done();
        }
    });
}
catch (e) {
    logger.error('CRAWLER CATCH ERROR: ' + JSON.stringify(e));
}

const crawlerRun = () => {
    // crawlerPostSale.crawlerPostSaleListItem(c, services.getFullUrl(CRAWLER_CONFIG.POST_SALE[0]));
    // crawlerPostBuy.crawlerPostBuyListItem(c, services.getFullUrl(CRAWLER_CONFIG.POST_BUY[0]));
    // crawlerNews.crawlerNewsListItem(c, services.getFullUrl(CRAWLER_CONFIG.NEWS[0].url), CRAWLER_CONFIG.NEWS[0].id);
    crawlerProject.crawlerProjectListItem(c, services.getFullUrl(CRAWLER_CONFIG.PROJECT[0].url), CRAWLER_CONFIG.PROJECT[0].id);
};

module.exports = () => {
    // setInterval(crawlerRun, 1000 * 60 * config.get('timeInterval'));
    setInterval(crawlerRun, 1000);
}