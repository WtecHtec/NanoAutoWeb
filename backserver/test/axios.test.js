const axios = require('axios');
const ENV = require('../env.json');
async function main() {
  try {
    const header = {
        "Authorization": `Bearer ${ENV.API_KEY}:${ENV.SECERT}`,
    }
    const data = {
        "model": "generalv3.5", // 指定请求的模型
        "messages": [
            {
                "role": "user",
                "content": "你是谁"
            }
        ]
    }
    const response = await axios.post(ENV.BASE_URL, data, {headers: header});
    console.log(response.data.choices);
  } catch (error) {
    console.error(error);
  }
}

main();