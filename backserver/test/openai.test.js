
const  OpenAI  = require('openai');
const ENV = require('../env.json');
const openai = new OpenAI({
    // 控制台获取key和secret拼接，假使APIKey是key123456，APISecret是secret123456
    apiKey: `${ENV.API_KEY}:${ENV.SECERT}`, 
    baseURL: 'https://spark-api-open.xf-yun.com/v1/chat/completions', // 指向讯飞星火的请求地址
    defaultheaders: {
        "Authorization": `Bearer ${ENV.API_KEY}:${ENV.SECERT}`,
    }
});

async function main() {
  const chatCompletion = await openai.chat.completions.create( 
    model='generalv3.5', // 指定请求的版本
    messages=[
        {
            "role": "user",
            "content": '你是谁'
        }
    ]);
  console.log(chatCompletion);
}

main();
