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

var CronJob = require('cron').CronJob;

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

const crawlerRun = (configCrawler) => {
    
    amqp.connect(getConnectStr(), function (err, conn) {
        conn.createChannel(function (err, ch) {
            ch.assertQueue(RABBIT_MQ.q, {durable: true});
            
            //Post Buy
            if (configCrawler.realEstateNeedBuy) {
                for (var i = 1; i <= (configCrawler.realEstateNeedBuy / 20); i++) {
                    crawlerPostBuy.crawlerPostBuyListItem(c, services.getFullUrl(CRAWLER_CONFIG.REAL_ESTATE_NEED_BUY.replace('{p}', i)), ch, conn);
                }
            }
            if (configCrawler.realEstateNeedRent) {
                for (var i = 1; i <= (configCrawler.realEstateNeedRent / 20); i++) {
                    crawlerPostBuy.crawlerPostBuyListItem(c, services.getFullUrl(CRAWLER_CONFIG.REAL_ESTATE_NEED_BUY.replace('{p}', i)), ch, conn);
                }
            }
            
            //Post SALE
            if (configCrawler.realEstateRent) {
                for (var i = 1; i <= (configCrawler.realEstateRent / 20); i++) {
                    crawlerPostSale.crawlerPostSaleListItem(c, services.getFullUrl(CRAWLER_CONFIG.REAL_ESTATE_RENT.replace('{p}', i)), ch, conn);
                }
            }
            if (configCrawler.realEstateSale) {
                for (var i = 1; i <= (configCrawler.realEstateSale / 20); i++) {
                    crawlerPostSale.crawlerPostSaleListItem(c, services.getFullUrl(CRAWLER_CONFIG.REAL_ESTATE_SALE.replace('{p}', i)), ch, conn);
                }
            }
            
            //NEWS
            if (configCrawler.news) {
                CRAWLER_CONFIG.NEWS.forEach(function (item) {
                    console.log(item);
                    for (var i = 1; i <= (configCrawler.news / CRAWLER_CONFIG.NEWS.length / 14); i++) {
                        crawlerNews.crawlerNewsListItem(c, services.getFullUrl(item.url.replace('{p}', i)), item.id, ch, conn);
                    }
                });
            }
            
            //PROJECT
            if (configCrawler.project) {
                CRAWLER_CONFIG.PROJECT.forEach(function (item) {
                    console.log(item);
                    // for (var i = 1; i <= (configCrawler.project / CRAWLER_CONFIG.PROJECT.length / 10); i++) {
                    //     crawlerProject.crawlerProjectListItem(c, services.getFullUrl(item.url.replace('{p}', i)), item.id, ch, conn);
                    // }
                    for (var i = 1; i <= (item.item / 10); i++) {
                        crawlerProject.crawlerProjectListItem(c, services.getFullUrl(item.url.replace('{p}', i)), item.id, ch, conn);
                    }
                });
            }
            //conn.close(); //close connection
        });
    });
    
};

module.exports = () => {
    // const timeCron = '* 0-23/5 * * *';
    //
    // logger.info(`CONFIG CRON JOB RUN AT ---${timeCron}---`);
    
    // new CronJob(timeCron, function () {
    //     logger.info(`CRON JOB RUN AT ${timeCron}`);
        
        // const configCrawler = require('./apiService').getConfigCrawler();
        
        configCrawler = {
            realEstateSale: 0,
            realEstateRent: 0,
            realEstateNeedBuy: 0,
            realEstateNeedRent: 0,
            news: 112,
            project: 0, //4000,
        }
        console.log(configCrawler);
        
        crawlerRun(configCrawler);
        
    // }, null, true, 'Asia/Ho_Chi_Minh');
}