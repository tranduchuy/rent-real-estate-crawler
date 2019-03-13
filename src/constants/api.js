const API_HOST = 'https://api.hecta.vn/';

global.API = {
    captchaToken: 'captchaToken',
    tokenUser: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ndXllbmJpbmhsb25nOTJAZ21haWwuY29tIiwiaWF0IjoxNTUwMzA0ODEwLCJleHAiOjE1NTA0Nzc2MTB9.HvHv3MuH3T4Geym3fPUHRO_fVqocUUSUjoYjaiRUSx4',
    tokenAdmin: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hc3RlckBnbWFpbC5jb20iLCJpYXQiOjE1NTI0NDA3ODcsImV4cCI6MTU1MjYxMzU4N30.49XHvEP9peSKjePvguuQ8yT6DVVHryAjj78Gea7fzJo',
    postSale: API_HOST + 'api/v1/sales/add',
    postBuy: API_HOST + 'api/v1/buys/add',
    postNews: API_HOST + 'admin/v1/news/add',
    postProject: API_HOST + 'admin/v1/projects/add',
    updateProject: API_HOST + 'admin/v1/projects/update/{id}',
    getConfigCrawler: API_HOST + 'api/v1/system/statistic',
}