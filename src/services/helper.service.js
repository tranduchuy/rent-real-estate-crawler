const GlobalConstant = require('../constants/globalConstant');
const directions = require('../constants/direction.constant');
const infoTypes = require('../constants/infoTypes.constant');

const CityListOther1 = GlobalConstant.CityListOther1;
const CateSaleList = GlobalConstant.CateSaleList;
const CateBuyList = GlobalConstant.CateBuyList;


const HelperService = {
    
    parserStringToInt: function(srt) {
        try {
            return parseInt(srt);
        } catch (e) {
            return null;
        }
    },
    
    getProjectTypeBuyCode: function (id) {
        return GlobalConstant.ProjectTypes.find(p => {
            return p.id === id;
        });
    },
    
    getCityByCode: function (cd) {
        return CityListOther1.find(city => {
            return city.code === cd;
        });
    },
    
    getDistrictByValue: function (city, value) {
        return city.district.find(d => {
            return d.id === value;
        });
    },
    
    getWardByValue: function (district, value) {
        return district.ward.find(w => {
            return w.id === value;
        });
    },
    getStreetByValue: function (district, value) {
        return district.street.find(w => {
            return w.id === value;
        });
    },
    getProjectByValue: function (district, value) {
        return district.project.find(w => {
            return w.id.toString() === value;
        });
    },
    
    getBedroomCountByValue: function (value) {
        if (value > 5)
            return {text: value.toString() + "+", value: value.toString()};
        if (value > 0 && value < 5)
            return {text: value.toString() + "+", value: value.toString()};
        return {text: "Không xác định", value: value.toString()};
    },
    
    getFormilitySaleByValue: function (value) {
        return CateSaleList.find(c => {
            return c.id === value;
        });
    },
    
    getFormilityBuyByValue: function (value) {
        return CateBuyList.find(c => {
            return c.id.toString() === (value || '').toString();
        });
    },
    
    getTypeByValue: function (formality, value) {
        if (this.isUndefinedOrNull(value)) {
            return null;
        }
        
        return formality.children.find(t => {
            return t.id.toString() === value.toString();
        });
    },
    
    getUnitByValue: function (formality, value) {

        if (this.isUndefinedOrNull(formality)) {
            return {id: -1}; // thỏa thuận
        }

        if (this.isUndefinedOrNull(value)) {
            return null;
        }
        
        let val = value.trim();
        val = val.charAt(0).toUpperCase() + val.slice(1);
        return formality.prices.find(p => {
            return p.name.toString().trim() === val.toString().trim();
        });
    },
    
    getDirectionsByValue: function (value) {
        if (this.isUndefinedOrNull(value)) {
            return null;
        }
        
        return directions.find(d => {
            return d.text.toString().trim() === value.toString().trim();
        });
    },
    
    getPriorityByValue: function (value) {
        return infoTypes.find(i => {
            return i.value.toString() === value.toString();
        });
    },
    
    
    isUndefinedOrNull: function (value) {
        return value === undefined || value === null;
    },
}

module.exports = HelperService;
