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
var amqp = require('amqplib/callback_api');

const rabbitMQConfig = config.get('rabbitmq');

const getConnectStr = () => {
    return `amqp://${rabbitMQConfig.username}:${rabbitMQConfig.password}@${rabbitMQConfig.host}:${rabbitMQConfig.port}/`;
};

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
    
    // for (var i = 1; i < 10; i++) {
    //     crawlerPostSale.crawlerPostSaleListItem(c, services.getFullUrl(CRAWLER_CONFIG.POST_SALE[0]).replace('{p}', i));
    // }
    
    // var ch;
    // var conn;
    // var q;
    
    amqp.connect(getConnectStr(), function (err, conn) {
        conn.createChannel(function (err, ch) {
             ch.assertQueue(RABBIT_MQ.q, { durable: true });
    
            // Note: on Node 6 Buffer.from(msg) should be used
            // const obj = {objectId: '5baeff3c7c90e813fb3288a4', target: 3};
            // ch.sendToQueue(q, new Buffer(JSON.stringify(obj)), {persistent: true});
            
            crawlerPostSale.crawlerPostSaleListItem(c, services.getFullUrl(CRAWLER_CONFIG.POST_SALE[0]), ch, conn);
    // crawlerPostBuy.crawlerPostBuyListItem(c, services.getFullUrl(CRAWLER_CONFIG.POST_BUY[0]));
    // crawlerNews.crawlerNewsListItem(c, services.getFullUrl(CRAWLER_CONFIG.NEWS[0].url), CRAWLER_CONFIG.NEWS[0].id);
    // crawlerProject.crawlerProjectListItem(c, services.getFullUrl(CRAWLER_CONFIG.PROJECT[0].url.replace('{p}', 1)), CRAWLER_CONFIG.PROJECT[0].id);
    //conn.close(); close connection
        });
    });
    
};

module.exports = () => {
    // setInterval(crawlerRun, 1000 * 60 * config.get('timeInterval'));
    setInterval(crawlerRun, 1000);
}