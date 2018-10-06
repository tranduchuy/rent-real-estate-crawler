const request = require('request');
var _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('Services');
require('../constants/api');
const crawlerProject = require('./crawlerProject');

const sendToQueue = function (content_id, ch, conn, type) {
    const obj = {objectId: content_id, target: type};
    
    logger.info(`apiService::sendToQueue obj  ${JSON.stringify(obj)}`);
    
    ch.sendToQueue(RABBIT_MQ.q, new Buffer(JSON.stringify(obj)), {persistent: true});
};

const postSale = function (par, ch, conn) {
    
    const params = par;
    
    const option = {
        uri: API.postSale,
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'accesstoken': API.tokenUser,
        },
        strictSSL: false, // allow us to use our self-signed cert for testing
        rejectUnauthorized: false
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (err || body.status != 1) {
                logger.error(`apiService::postSale error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info(`apiService::postSale info  ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            }
            
            if (body && body.data && body.data.content_id)
                sendToQueue(body.data.content_id, ch, conn, POST_TYPE.SALE);
        });
    } catch (e) {
        logger.error(`apiService::postSale error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
};

const postBuy = function (par, ch, conn) {
    
    const params = par;
    
    const option = {
        uri: API.postBuy,
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'accesstoken': API.tokenUser,
        }
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (err || body.status != 1) {
                logger.error(`apiService::postBuy error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info(`apiService::postBuy info  ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            }
    
            if (body && body.data && body.data.content_id)
                sendToQueue(body.data.content_id, ch, conn, POST_TYPE.BUY);
        });
    } catch (e) {
        logger.error(`apiService::postBuy error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
};

const postNews = function (par, ch, conn) {
    
    const params = par;
    
    const option = {
        uri: API.postNews,
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'accesstoken': API.tokenAdmin,
        }
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (err || body.status != 1) {
                logger.error(`apiService::postNews error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info(`apiService::postNews info  ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            }
    
            if (body && body.data && body.data.content_id)
                sendToQueue(body.data.content_id, ch, conn, POST_TYPE.NEWS);
        });
    } catch (e) {
        logger.error(`apiService::postNews error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
};

const postProject = function (c, url, par, ch, conn) {
    
    const params = par;
    
    const option = {
        uri: API.postProject,
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'accesstoken': API.tokenAdmin,
        }
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (err || body.status != 1) {
                logger.error(`apiService::postProject error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info(`apiService::postProject info  ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            }
    
            if (body && body.data && body.data.content_id){
                sendToQueue(body.data.content_id, ch, conn, POST_TYPE.PROJECT);
    
                const id = body.data._id;
    
                if (params.isShowLocationAndDesign)
                    require('./crawlerProject').crawlerTabLocationAndDesign(c, url, id, ch, conn);
                if (params.isShowGround)
                    require('./crawlerProject').crawlerTabGround(c, url, id, ch, conn);
                if (params.isShowImageLibs)
                    require('./crawlerProject').crawlerTabImageAlbums(c, url, id, ch, conn);
                if (params.isShowProjectProgress)
                    require('./crawlerProject').crawlerTabProjectProgress(c, url, id, ch, conn);
                // if (params.isShowTabVideo)
                // TODO
                if (params.isShowFinancialSupport)
                    require('./crawlerProject').crawlerTabFinancialSupport(c, url, id, ch, conn);
                if (params.isShowInvestor)
                    require('./crawlerProject').crawlerTabDetailInvestor(c, url, id, ch, conn);
            }
        });
    } catch (e) {
        logger.error(`apiService::postProject error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
};

const updateProject = function (par, id, ch, conn) {
    
    const params = par;
    
    const option = {
        uri: API.updateProject.replace('{id}', id),
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'accesstoken': API.tokenAdmin,
        }
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (err || body.status != 1) {
                logger.error(`apiService::updateProject error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info(`apiService::updateProject info  ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            }
    
            if (body && body.data && body.data._id)
                sendToQueue(body.data._id, ch, conn, POST_TYPE.PROJECT);
        });
    } catch (e) {
        logger.error(`apiService::updateProject error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
};

module.exports = {
    postSale,
    postBuy,
    postNews,
    postProject,
    updateProject,
    sendToQueue,
}
