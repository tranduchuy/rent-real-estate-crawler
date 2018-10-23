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
        soucenews: 'div.soucenews',
    },
    
    PROJECT: {
        listProductItem: 'ul.list-view > li> div.thumb',
        hrefItem: 'a',
        //detail
        introImages: '#imgslide',
        bannerContext: '#form1 > script:nth-child(2)',
        title: '#form1 > div.site-center > div.prj-detail > h1', //string // tên dự án
        divOverview: 'div.prj-right',
        divOverviewRow: 'div.prj-i',
        divOverviewRowLeft: 'div.fl',
        divOverviewRowRight: 'div.fr',
        
        description: 'div.prj-noidung.a1', //string
        
        tabs: '#form1 > div.site-center > div.prj-detail > div.prj-tab > ul',
        
        location: '#form1 > div.site-center > div.project-body-left > div:nth-child(4)', //string // vị trí, string HTML
        infrastructure: '#form1 > div.site-center > div.project-body-left > div:nth-child(6)', //string // hạ tầng, string HTML
    
        overallSchema: '#TopContent_ProjectDetail1_ctl00_imgOveralView', //string[] // hình sơ đồ tổng thể
        listGroundImages: '#TopContent_ProjectDetail1_ctl00_pnlFlat', //string[] // hình mặt bằng, có thể có nhiều hình
        groundImages: 'img.mapster',
    
        imageAlbums: 'div.album', //string[] // thư viện ảnh
        imageAlbumsDetail: 'span.imageGallery', //string[] // thư viện ảnh
    
        projectProgressTitle: '#form1 > div.site-center > div.project-body-left > div.prj-timeline > div > div.prj-title-group.bord', //String
        projectProgressStartDate: null, //Number
        projectProgressEndDate: null, //Number
        projectProgressDate: 'div.events-content.bord.btn > ul > li', //Number
        projectProgressImages: '#carousel0', //string []
    
    
        isShowTabVideo: null, //boolean // show tab video
        video: null, //string // link video, tạm thời lấy từ youtube
    
        financialSupport: '#pnlPaymentPlan', //string // hỗ trợ tài chính, string HTML
        
        detailInvestor: '#form1 > div.site-center > div.project-body-left > div.prj-enterprise', //string // chi tiết về chủ đầu tư, string HTML
    
    },
    
    PROJECT_TABS: {
        locationAndDesign: '/p1',
        ground: '/p2',
        imageLibs: '/p3',
        projectProgress: '/p4',
        tabVideo: '/p5',
        financialSupport: '/p6',
        investor: '/p7',
    },
    
}