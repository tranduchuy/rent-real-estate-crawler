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

const crawlerProjectListItem = function (c, url, cate) {
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
                                crawlerProjectDetail(c, services.getFullUrl(hrefItem), cate);
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

const crawlerProjectDetail = function (c, url, cate) {
    try {
        
        c.queue([{
            uri: url,
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
                        isShowOverview: null, //boolean // show tab tổng quan
                        cate: null, //number // loại dự án, loại hình phát triển
                        introImages: [], //string[] // list link hình
                        title: null, //string // tên dự án
                        address: null, //string // địa chỉ
                        area: null, //number // tổng diện tích
                        projectScale: null, //string // quy mô dự án
                        price: null, //number // giá
                        deliveryHouseDate: null, //number // ngày bàn giao nhà
                        constructionArea: null, //number // diện tích xây dựng
                        descriptionInvestor: null, //string // giới thiệu chủ đầu tư
                        description: null, //string // giới thiệ dự án, string HTML
    
                        isShowLocationAndDesign: null, //boolean // show tab vị trí hạ tầng, thiết kế
                        location: null, //string // vị trí, string HTML
                        infrastructure: null, //string // hạ tầng, string HTML
    
                        isShowGround: null, //boolean // show tab mặt bằng
                        overallSchema: [], //string[] // hình sơ đồ tổng thể
                        groundImages: [], //string[] // hình mặt bằng, có thể có nhiều hình
    
                        isShowImageLibs: null, //boolean / show tab thư viện ảnh
                        imageAlbums: [], //string[] // thư viện ảnh
    
                        isShowProjectProgress: null, //boolean // show tab tiến đọ dự án
                        projectProgressTitle: null, //String
                        projectProgressStartDate: null, //Number
                        projectProgressEndDate: null, //Number
                        projectProgressDate: null, //Number
                        projectProgressImages: [], //string []
    
    
                        isShowTabVideo: null, //boolean // show tab video
                        video: null, //string // link video, tạm thời lấy từ youtube
    
                        isShowFinancialSupport: null, //boolean // show tab hỗ trợ tài chính
                        finalcialSupport: null, //string // hỗ trợ tài chính, string HTML
    
                        isShowInvestor: null, //boolean // show tab chủ đầu tư
                        detailInvestor: null, //string // chi tiết về chủ đầu tư, string HTML
                    };
                    
                    params.isShowOverview = true;
                    params.cate = cate;
                    
                    const introImages = $(SELECTOR.PROJECT.introImages);
                    (introImages.html() === null) ?
                        logger.error('CRAWLER PROJECT DETAIL CALLBACK GET --INTRO IMAGES-- FAIL')
                        :
                        params.introImages = services.getIntroImagesProject(introImages.html());
                    
                    const divOverview = $(SELECTOR.PROJECT.divOverview);
                    (divOverview.html() === null) ?
                        logger.error('CRAWLER PROJECT DETAIL CALLBACK GET --DIV OVERVIEW-- FAIL')
                        :
                       services.getIntroImagesProject(divOverview.html(), params);
                    
                    console.log(params);
                    // apiService.postProject(params);
                }
                done();
            }
        }]);
    }
    catch (e) {
        logger.error('CRAWLER PROJECT DETAIL CALLBACK CATCH ERROR' + JSON.stringify(e));
    }
}

module.exports = {
    crawlerProjectListItem,
    crawlerProjectDetail,
}