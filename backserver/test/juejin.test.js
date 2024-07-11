const getJuejin = require('../tools/getJueJin');
let url = "https://juejin.cn/post/7340899332509876261";

async function main() {
    const result =  await  getJuejin(url)
    console.log(result)
}

 main()