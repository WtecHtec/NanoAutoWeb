const axios = require('axios');
const ENV = require('../env.json');
/**
 * 
 * @param {*} messages  数组
 * @returns 
 */
function request(messages) {
  return new  Promise( async (resolve, reject) => {
    try {
        const header = {
            "Authorization": `Bearer ${ENV.API_KEY}:${ENV.SECERT}`,
        }
        const data = {
            "model": ENV.MODEL, // 指定请求的模型
            "messages": [
                ...messages
            ]
        }
        const response = await axios.post(ENV.BASE_URL, data, {headers: header});
        if ( response  && response.data && response.data.code === 0 && response.data.choices) {
            resolve([0, response.data.choices])
        } else {
            resolve([response.data.code, ''])
        }
      } catch (error) {
        console.error(error);
        resolve([-1, error])
      }
  })

}

module.exports = request