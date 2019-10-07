const config = require('config');
const API_HOST = config.get('apiHost');

global.API = {
    captchaToken: 'captchaToken',
    tokenUser: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjAzOTQ0NTQ3OTMiLCJpYXQiOjE1NzA0NTM3NTQsImV4cCI6MTU3MDYyNjU1NH0.reQvjHi7ModzHt3-x50rJwcKekpHGDGXTgyugrY5M18',
    tokenAdmin: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRodWViYXRkb25nc2FuLmNvbS52biIsImlhdCI6MTU2NTY0OTg2MCwiZXhwIjoxNTY1ODIyNjYwfQ.cjxw1ZusnrxVRhsDbQlMsul8dGwocx2vA45ZUuLxzEc',
    postSale: API_HOST + 'api/v1/sales/add',
    postBuy: API_HOST + 'api/v1/buys/add',
    postNews: API_HOST + 'admin/v1/news/add',
    postProject: API_HOST + 'admin/v1/projects/add',
    updateProject: API_HOST + 'admin/v1/projects/update/{id}',
    getConfigCrawler: API_HOST + 'api/v1/system/statistic',
}
