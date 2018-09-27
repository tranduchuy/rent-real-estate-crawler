const Data = require('./selector');

const {cateList, cateListBuy, cityListOTher1, priceLevel, areaList} = Data;

var GlobalConstant = {

  SizeImage: {
    S120x90 : '120x90',
    S200x200 : '200x200',
    S82x82 : '82x82',
    S150x150 : '150x150',
    S745x510 : '745x510',
    S255x180 : '255x180',
    S640x430 : '640x430',
    S164x170 : '164x170',
  },

  SEOPrefix: {
    FB : 'og',
    GG : 'gg',
  },

  CateSaleList : cateList || [],
  CateBuyList : cateListBuy || [],
  CityListOther1 : cityListOTher1 || [],
  PriceLevel : priceLevel || [],
  AreaList : areaList || [],

  PriorityList : [
    {id: -1, name: 'Chọn loại tin'},
    {id: 1, name: 'Tin vip đặc biệt'},
    {id: 2, name: 'Tin vip 1'},
    {id: 3, name: 'Tin vip 2'},
    {id: 4, name: 'Tin vip 3'},
    {id: 5, name: 'Tin ưu đãi'},
    {id: 6, name: 'Tin thường'},
  ],

}

module.exports = GlobalConstant;
