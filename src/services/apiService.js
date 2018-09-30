const request = require('request');
var _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger('Services');
require('../constants/api');

const postSale = function (params) {
    // logger.info('apiService::postSale was called with: ' + JSON.stringify(params));
    const option = {
        uri: API.postSale,
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'access_token': API.tokenUser,
        }
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (body.status != 1) {
                logger.error(`apiService::postSale error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info('apiService::postSale info' + JSON.stringify(option));
            }
            return body;
        });
    } catch (e) {
        logger.error(`apiService::postSale error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
};

const postBuy = function (params) {
    const option = {
        uri: API.postBuy,
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'access_token': API.tokenUser,
        }
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (body.status != 1) {
                logger.error(`apiService::postBuy error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info('apiService::postBuy info' + JSON.stringify(option));
            }
            return body;
        });
    } catch (e) {
        logger.error(`apiService::postBuy error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
};

const postNews = function (params) {
    const option = {
        uri: API.postNews,
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'access_token': API.tokenAdmin,
        }
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (body.status != 1) {
                logger.error(`apiService::postNews error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info('apiService::postNews info' + JSON.stringify(option));
            }
            return body;
        });
    } catch (e) {
        logger.error(`apiService::postNews error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
};

const postProject = function (params) {
    const option = {
        uri: API.postProject,
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'access_token': API.tokenAdmin,
        }
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (body.status != 1) {
                logger.error(`apiService::postProject error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info(`apiService::postProject info ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            }
            return body;
        });
    } catch (e) {
        logger.error(`apiService::postProject error: ${JSON.stringify(e)}. Params: ${JSON.stringify(option)}`);
    }
};

const updateProject = function (params, id) {
    console.log('updateProject', params);
    const option = {
        uri: API.updateProject.replace('{id}', id),
        json: params,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'access_token': API.tokenAdmin,
        }
    };
    try {
        request(option, (err, httpResponse, body) => {
            if (body.status != 1) {
                logger.error(`apiService::updateProject error: ${JSON.stringify(err)}. Params: ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            } else {
                logger.info(`apiService::updateProject info ${JSON.stringify(option)}. Body: ${JSON.stringify(body)}`);
            }
            return body;
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
    updateProject
}
