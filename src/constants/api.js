const API_HOST = 'https://api.hecta.vn/';

global.API = {
    captchaToken: 'captchaToken',
    tokenUser: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ndXllbmJpbmhsb25nOTJAZ21haWwuY29tIiwiaWF0IjoxNTUwMzA0ODEwLCJleHAiOjE1NTA0Nzc2MTB9.HvHv3MuH3T4Geym3fPUHRO_fVqocUUSUjoYjaiRUSx4',
    tokenAdmin: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFwcG5ldHdhbWFuYWdlckBnbWFpbC5jb20iLCJpYXQiOjE1NTI1NjgwNDIsImV4cCI6MTU1Mjc0MDg0Mn0.qAIkpSfxWprtW_jgcWnUb6fKbMlFpkdj5R0zTELeQ3A',
    postSale: API_HOST + 'api/v1/sales/add',
    postBuy: API_HOST + 'api/v1/buys/add',
    postNews: API_HOST + 'admin/v1/news/add',
    postProject: API_HOST + 'admin/v1/projects/add',
    updateProject: API_HOST + 'admin/v1/projects/update/{id}',
    getConfigCrawler: API_HOST + 'api/v1/system/statistic',
}