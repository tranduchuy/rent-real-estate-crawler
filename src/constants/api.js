const API_HOST = 'https://api.hecta.vn/';

global.API = {
    captchaToken: 'captchaToken',
    tokenUser: 'CdobeBaJgq9Ap3L8cNUxQqXEddNfgkXBrPn3e0hXKQUPMvSoa02SGkzgAPpS6NKuzozwKg28jFixuCHtWKPb6Lg6letQRjMapiLN1549954745048',
    tokenAdmin: 'hVxHG4EfKwnA74qK3d67wW454Abvy5TQGOs6aHbxE5f6vs1Y4SqqQWi70CxvZx1jy6wSazs3uNLYjUdUuOjoe6NHsnqPb7dAxcoy1538057473842',
    postSale: API_HOST + 'api/v1/sales/add',
    postBuy: API_HOST + 'api/v1/buys/add',
    postNews: API_HOST + 'admin/v1/news/add',
    postProject: API_HOST + 'admin/v1/projects/add',
    updateProject: API_HOST + 'admin/v1/projects/update/{id}',
    getConfigCrawler: API_HOST + 'api/v1/system/statistic',
}