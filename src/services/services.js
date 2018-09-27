var _ = require('lodash');
var config = require('config');
var url = require('url');
const cheerio = require('cheerio');
require('../../config/globalConstant');
var HelperService = require('./helper.service');

const services = {
    getFullUrl: function (url) {
        if (url.charAt(0) === '/')
            return CRAWLER_CONFIG.SOURCE + url;
        else
            return CRAWLER_CONFIG.SOURCE + '/' + url;
    },
    
    getAreaPostSale(area) {
        if (area.indexOf('Không xác định') > -1) return null;
        
        area = services.cleanString(area.replace('m²', ''));
        return parseInt(area);
    },
    
    getAreaPostBuy(area, params) {
        if (area.indexOf('Không xác định') > -1) return null;
        if (area.indexOf('Thỏa thuận') > -1) return null;
        if (area.indexOf('Trên') > -1) {
            var tmp = services.cleanString(area.replace('m²', '')).trim().split(' ');
            var min = tmp[1].trim();
            params.areaMin = HelperService.parserStringToInt(min);
            return params;
        }
        if (area.indexOf('Dưới') > -1) {
            var tmp = services.cleanString(area.replace('m²', '')).trim().split(' ');
            var max = tmp[1].trim();
            params.areaMax = HelperService.parserStringToInt(max);
            return params;
        }
        
        var tmp = services.cleanString(area.replace('m²', '')).trim().split('-');
        var min = tmp[0].trim();
        var max = tmp[1].trim();
        
        params.areaMin = HelperService.parserStringToInt(min);
        params.areaMax = HelperService.parserStringToInt(max);
        return params;
    },
    
    getPriceAUnitPostSale(price, formality, params) {
        if (price.indexOf('Không xác định') > -1) return null;
        if (price.indexOf('Thỏa thuận') > -1) {
            params.price = null;
            params.unit = HelperService.getUnitByValue(formality, 'Thỏa thuận').id;
            return params;
        }
        
        price = services.cleanString(price).trim();
        
        var tmp = price.split(' ');
        params.price = parseFloat(tmp[0]);
        
        var unit = price.replace(tmp[0], '');
        
        params.unit = HelperService.parserStringToInt(HelperService.getUnitByValue(formality, unit).id);
        
        return params;
    },
    
    getFromDatePostSale(string) {
        
        string = services.cleanString(string);
        var tmp = string.split(':');
        
        return (tmp[1]);
    },
    
    getToDatePostSale(string) {
        
        string = services.cleanString(string);
        var tmp = string.split(':');
        
        return (tmp[1]);
    },
    
    parserStringToDate(string) {
        var parts = string.split('-');
        var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
        return mydate.getTime();
    },
    
    getPriorityByName(name) {
        return GlobalConstant.PriorityList.find(i => {
            return i.name.toString() === name.toString();
        });
    },
    
    getPriorityPostSale(priority, params) {
        let prio = null;
        if (priority.indexOf('đặc biệt') > -1) prio = services.getPriorityByName('Tin vip đặc biệt');
        if (priority.indexOf('vip 1') > -1) prio = services.getPriorityByName('Tin vip 1');
        if (priority.indexOf('vip 2') > -1) prio = services.getPriorityByName('Tin vip 2');
        if (priority.indexOf('vip 3') > -1) prio = services.getPriorityByName('Tin vip 3');
        if (priority.indexOf('ưu đãi') > -1) prio = services.getPriorityByName('Tin ưu đãi');
        if (priority.indexOf('thường') > -1) prio = services.getPriorityByName('Tin thường');
        
        if (prio) params.priorityId = prio._id;
        
        return params;
    },
    
    cleanString(string) {
        return string.replace(/\n/g, '')
    },
    
    getFeaturePostSale(listFeature, params) {
        
        const $ = cheerio.load(listFeature);
        const feature = $(SELECTOR.POST_SALE.feature);
        
        feature.each(function (index, element) {
            
            const left = $(SELECTOR.POST_SALE.featureLeft, element).text();
            
            if (left.indexOf('Địa chỉ') > -1) params.address = services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text());
            if (left.indexOf('Đường vào') > -1) params.streetWidth = HelperService.parserStringToInt(services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text().trim().replace('(m)', '')));
            if (left.indexOf('Mặt tiền') > -1) params.frontSize = HelperService.parserStringToInt(services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text().trim().replace('(m)', '')));
            if (left.indexOf('Hướng nhà') > -1) params.direction = HelperService.parserStringToInt(HelperService.getDirectionsByValue(services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text())).value);
            if (left.indexOf('Hướng ban công') > -1) params.balconyDirection = HelperService.parserStringToInt(HelperService.getDirectionsByValue(services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text())).value);
            if (left.indexOf('Số tầng') > -1) params.floorCount = HelperService.parserStringToInt(services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text().trim().replace('(tầng)', '')));
            if (left.indexOf('Số phòng ngủ') > -1) params.bedroomCount = HelperService.parserStringToInt(services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text().trim().replace('(phòng)', '')));
            if (left.indexOf('Số toilet') > -1) params.toiletCount = HelperService.parserStringToInt(services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text()));
            if (left.indexOf('Nội thất') > -1) params.furniture = $(SELECTOR.POST_SALE.featureRight, element).text().trim();
        });
        
        return params;
    },
    
    getFeaturePostBuy(listFeature, params) {
        
        const $ = cheerio.load(listFeature);
        const feature = $(SELECTOR.POST_BUY.feature);
        
        feature.each(function (index, element) {
            
            const left = $(SELECTOR.POST_SALE.featureLeft, element).text();
            
            if (left.indexOf('Địa chỉ') > -1) params.address = services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text().trim());
            if (left.indexOf('Ngày đăng tin') > -1) params.from = services.parserStringToDate(services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text().trim()));
            if (left.indexOf('Ngày hết hạn') > -1) params.to = services.parserStringToDate(services.cleanString($(SELECTOR.POST_SALE.featureRight, element).text().trim()));
        });
        
        return params;
    },
    
    getContactPostSale(contact, params) {
        
        const $ = cheerio.load(contact);
        const contactRow = $(SELECTOR.POST_SALE.contactRow);
        
        contactRow.each(function (index, element) {
            
            const left = $(SELECTOR.POST_SALE.contactRowLeft, element).text();
            
            if (left.indexOf('Tên liên lạc') > -1) params.contactName = services.cleanString($(SELECTOR.POST_SALE.contactRowRight, element).text());
            if (left.indexOf('Địa chỉ') > -1) params.contactAddress = services.cleanString($(SELECTOR.POST_SALE.contactRowRight, element).text());
            if (left.indexOf('Mobile') > -1) params.contactMobile = services.cleanString($(SELECTOR.POST_SALE.contactRowRight, element).text());
            // if (left.indexOf('Email') > -1) params.contactEmail = services.cleanString($(SELECTOR.POST_SALE.contactRowRight, element).text());
        });
        
        return params;
    },
    
    getKeywordListPostSale(keywordList) {
        
        let keyList = [];
        
        const $ = cheerio.load(keywordList);
        const keyword = $('a');
        
        keyword.each(function (index, element) {
            
            keyList.push($(this).text());
        });
        
        return keyList;
    },
    
    getImageListPostSale(imageList) {
        
        let imgList = [];
        
        const $ = cheerio.load(imageList);
        const image = $(SELECTOR.POST_SALE.images);
        
        image.each(function (index, element) {
            
            imgList.push($(this).attr('src').toString().replace('200x200', '745x510'));
        });
        
        return imgList;
    },
    
    getSearchBoxValueFromUrl(urlSearchBox, params) {
        
        var queryData = url.parse(urlSearchBox, true).query;
        
        params.formality = queryData.pType ? parseInt(queryData.pType) : null;
        params.type = queryData.cateId ? parseInt(queryData.cateId) : null;
        params.city = queryData.cityCode ? queryData.cityCode : null;
        params.district = queryData.distId ? parseInt(queryData.distId) : null;
        params.ward = queryData.wardId ? parseInt(queryData.wardId) : null;
        params.street = queryData.streetId ? parseInt(queryData.streetId) : null;
        params.project = queryData.projId ? parseInt(queryData.projId) : null;
        // params.area = queryData.area ? parseInt(queryData.area) : null;
        // params.price = queryData.price ? parseInt(queryData.price) : null;
        // params.direction = queryData.direction ? parseInt(queryData.direction) : null;
        // params.bedroomCount = queryData.room ? parseInt(queryData.room) : null;
        
        return params;
    },
    
    getValueDivRight(right) {
        const $ = cheerio.load(right);
        return $(SELECTOR.POST_BUY.contactDivRight).text().trim();
    },
    
    //PROJECT
    getIntroImagesProject(introImages) {
        
        let imgList = [];
        
        const $ = cheerio.load(introImages);
        const image = $("img");
        
        image.each(function (index, element) {
            imgList.push($(this).attr('src').toString().trim().replace('640x430', '745x510'));
        });
        
        return imgList;
    },
    
    getDivOverviewProject(divOverview, params) {
        
        const $ = cheerio.load(divOverview);
        const feature = $(SELECTOR.PROJECT.divOverviewRow);
        
        feature.each(function (index, element) {
            
            const left = $(SELECTOR.PROJECT.divOverviewRowLeft, element).text();
            
            if (left.indexOf('Địa chỉ') > -1) params.address = services.cleanString($(SELECTOR.PROJECT.divOverviewRowRight, element).text().trim());
            if (left.indexOf('Tổng diện tích') > -1) params.area = HelperService.parserStringToInt(services.cleanString($(SELECTOR.PROJECT.divOverviewRowRight, element).text().replace('.', '').replace('m²', '').trim()));
            if (left.indexOf('Quy mô dự án') > -1) params.projectScale = services.cleanString($(SELECTOR.PROJECT.divOverviewRowRight, element).text().trim());
            if (left.indexOf('Giá bán') > -1) params.price = HelperService.parserStringToInt(services.cleanString($(SELECTOR.PROJECT.divOverviewRowRight, element).text().replace('triệu/m²', '').replace('m²', '').replace('triệu', '').replace('/', '').trim()));
            
        });
        return params;
    },
    
}

module.exports = services;