const axios = require("axios");
const cheerio = require("cheerio");
const TurndownService = require('turndown')

const turndownService = new TurndownService()


module.exports = function (url) {
    // 判断链接是否为 https://juejin.cn 的文章
    if (!/https:\/\/juejin\.cn/.test(url)) {
        return null;
    }
    return new Promise((resolve,) => {
        axios.get(url).then((res) => {
            const $ = cheerio.load(res.data);
            const content = $('.markdown-body').html();
            turndownService.remove('style')
            turndownService.remove('script')
            turndownService.remove('img')
            const markdown = turndownService.turndown(content);
            const filename = $('title').text()
            resolve(`TITLE: ${filename}\n${markdown}` );
        });
    })
}
