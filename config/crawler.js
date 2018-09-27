global.POST_TYPE = {
    SALE: 1,
    BUY: 2,
    PROJECT: 3,
    NEWS: 4,
    
};

global.CRAWLER_CONFIG = {
    SOURCE: 'https://batdongsan.com.vn',
    POST_SALE: [
        'nha-dat-ban/',
        'nha-dat-cho-thue/',
    ],
    POST_BUY: [
        'nha-dat-can-mua/',
        'nha-dat-can-thue/',
    ],
    NEWS: [
        {id: 1, url: "tin-thi-truong/"},
        {id: 2, url: 'phan-tich-nhan-dinh/'},
        {id: 3, url: 'chinh-sach-quan-ly/'},
        {id: 4, url: 'thong-tin-quy-hoach/'},
        {id: 5, url: 'bat-dong-san-the-gioi/'},
        {id: 6, url: 'tai-chinh-chung-khoan-bds/'},
        {id: 7, url: 'tu-van-luat/'},
        {id: 8, url: 'loi-khuyen/'},
    ],
    PROJECT: [
        {id: 1, url: 'can-ho-chung-cu/'},
        {id: 2, url: 'cao-oc-van-phong/'},
        {id: 3, url: 'trung-tam-thuong-mai/'},
        {id: 4, url: 'khu-do-thi-moi/'},
        {id: 5, url: 'khu-phuc-hop/'},
        {id: 6, url: 'nha-o-xa-hoi/'},
        {id: 7, url: 'khu-nghi-duong-sinh-thai/'},
        {id: 8, url: 'khu-cong-nghiep/'},
        {id: 9, url: 'du-an-khac/'},
        {id: 10, url: 'biet-thu-lien-ke/'}
    ],
    
    PAGE: 'p/{p}',
    
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
