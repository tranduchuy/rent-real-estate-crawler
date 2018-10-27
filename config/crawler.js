global.POST_TYPE = {
    SALE: 1,
    BUY: 2,
    PROJECT: 3,
    NEWS: 4,
    createdByTypeCraw: 2
};

global.RABBIT_MQ = {
    q: 'RESIZE_IMAGES_FOR_CRAWLER2',
}

global.MAX_PAGE = {
    POST_SALE: 10,
    POST_BUY: 5,
    NEWS: 5,
    PROJECT: 5,
}

global.CRAWLER_CONFIG = {
    SOURCE: 'https://batdongsan.com.vn',
    REAL_ESTATE_SALE: 'nha-dat-ban/p{p}',
    REAL_ESTATE_RENT: 'nha-dat-cho-thue/p{p}',
    REAL_ESTATE_NEED_BUY: 'nha-dat-can-mua/p{p}',
    REAL_ESTATE_NEED_RENT: 'nha-dat-can-thue/p{p}',
    NEWS: [
        {id: 8, url: 'loi-khuyen/p{p}'},
        {id: 7, url: 'tu-van-luat-bat-dong-san/p{p}'},
        {id: 6, url: 'tai-chinh-chung-khoan-bat-dong-san/p{p}'},
        {id: 5, url: 'bat-dong-san-the-gioi/p{p}'},
        {id: 4, url: 'thong-tin-quy-hoach/p{p}'},
        {id: 3, url: 'chinh-sach-quan-ly/p{p}'},
        {id: 2, url: 'phan-tich-nhan-dinh/p{p}'},
        {id: 1, url: "tin-thi-truong/p{p}"},
    ],
    PROJECT: [
        {id: 10, url: 'biet-thu-lien-ke/p{p}'},
        {id: 9, url: 'du-an-khac/p{p}'},
        {id: 8, url: 'khu-cong-nghiep/p{p}'},
        {id: 7, url: 'khu-nghi-duong-sinh-thai/p{p}'},
        {id: 6, url: 'nha-o-xa-hoi/p{p}'},
        {id: 5, url: 'khu-phuc-hop/p{p}'},
        {id: 4, url: 'khu-do-thi-moi/p{p}'},
        {id: 3, url: 'trung-tam-thuong-mai/p{p}'},
        {id: 2, url: 'cao-oc-van-phong/p{p}'},
        {id: 1, url: 'can-ho-chung-cu/p{p}'},
    ],
    
    PAGE: 'p/{p}',
    
    priority: 1,
    priorityPost: 3,
    
    jQuery: false,
    timeout: 1000 * 30,
    retries: 3,
    retryTimeout: 1000 * 10,
    maxConnections : 5,
    rateLimit: 1000 * 10,
    Max_Item: 1,
    Headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'DNT': 1,
        'Host': 'batdongsan.com.vn',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    },
};
