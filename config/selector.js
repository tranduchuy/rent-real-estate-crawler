global.SELECTOR = {
    POST_SALE: {
        listProductItem: 'div .search-productItem',
        hrefItem: 'h3 a',
        //detail
        urlSearchBox: '.get-bds-link #emailregister',
        title: '#product-detail .pm-title h1',
        price: 'span.gia-title.mar-right-15 > strong',
        area: '#product-detail > div.kqchitiet > span > span:nth-child(2) > strong',
        description: 'div.pm-desc', // nội dung
        listFeature: '#product-detail div.div-table div div.div-table-cell.table1 div div.table-detail',
        feature: 'div.row',
        featureLeft: 'div.left',
        featureRight: 'div.right',
        
        keywordList: '#LeftMainContent__productDetail_panelTag',
    
        imageList: '#thumbs',
        images: 'li img',
    
        googleAddress: '',
        
        contact: '#divCustomerInfo',
        contactRow: 'div.right-content',
        contactRowLeft: 'div.left',
        contactRowRight: 'div.right',
        
        priority: '#product-detail div.prd-more-info div:nth-child(2)',
        from: '#product-detail div.prd-more-info div:nth-child(3)',
        to: '#product-detail div.prd-more-info div:nth-child(4)',
    },
    POST_BUY: {
        listProductItem: 'div.p-title',
        hrefItem: 'a',
        //detail
        urlSearchBox: '#emailregister',
        title: '#product-detail > div.pm-title > h1',
        price: 'span.gia-title.mar-right-15 > strong',
        area: '#product-detail > div.kqchitiet > span > span:nth-child(2) > strong',
        description: '#product-detail > div.pm-content.stat', // nội dung
        listFeature: 'div.left-detail',
        feature: 'div',
        featureLeft: 'div.left',
        featureRight: 'div.right',
        
        keywordList: '#LeftMainContent__productDetail_panelTag',
    
        imageList: '#thumbs',
        images: 'li img',
    
        contactName: '#LeftMainContent__detail_contactName',
        contactAddress: '#LeftMainContent__detail_contactAddress',
        contactPhone: '#LeftMainContent__detail_contactPhone',
        contactMobile: '#LeftMainContent__detail_contactMobile',
        
        contactDivRight: 'div.right',
    },
    
    NEWS: {
        listProductItem: 'div.tintuc-row1.tintuc-list.tc-tit',
        hrefItem: 'h3 a.link_blue',
        image: 'img',
        //detail
        title:'#ctl23_ctl00_divArticleTitle',
        description: '#ctl23_ctl00_divSummary',
        content: '#divContents',
    },
    
    PROJECT: {
        listProductItem: 'ul.list-view > li> div.thumb',
        hrefItem: 'a',
        //detail
        introImages: '#imgslide',
        title: 'div.prj-detail > h1', //string // tên dự án
        divOverview: 'div.prj-right',
        divOverviewRow: 'div.prj-i',
        divOverviewRowLeft: 'div.fl',
        divOverviewRowRight: 'div.fr',
        
        constructionArea: null, //number // diện tích xây dựng
        descriptionInvestor: null, //string // giới thiệu chủ đầu tư
        description: 'div.prj-noidung.a1', //string
    
        isShowLocationAndDesign: null, //boolean // show tab vị trí hạ tầng, thiết kế
        location: null, //string // vị trí, string HTML
        infrastructure: null, //string // hạ tầng, string HTML
    
        isShowGround: null, //boolean // show tab mặt bằng
        overallSchema: null, //string[] // hình sơ đồ tổng thể
        groundImages: null, //string[] // hình mặt bằng, có thể có nhiều hình
    
        isShowImageLibs: null, //boolean / show tab thư viện ảnh
        imageAlbums: null, //string[] // thư viện ảnh
    
        isShowProjectProgress: null, //boolean // show tab tiến đọ dự án
        projectProgressTitle: null, //String
        projectProgressStartDate: null, //Number
        projectProgressEndDate: null, //Number
        projectProgressDate: null, //Number
        projectProgressImages: null, //string []
    
    
        isShowTabVideo: null, //boolean // show tab video
        video: null, //string // link video, tạm thời lấy từ youtube
    
        isShowFinancialSupport: null, //boolean // show tab hỗ trợ tài chính
        finalcialSupport: null, //string // hỗ trợ tài chính, string HTML
    
        isShowInvestor: null, //boolean // show tab chủ đầu tư
        detailInvestor: null, //string // chi tiết về chủ đầu tư, string HTML
    
    },
    
}