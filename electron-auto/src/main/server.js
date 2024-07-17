const axios = require('axios')
const AGENT_URL = 'http://localhost:3000/spark/agent'

function post(prompt) {
  return new Promise((resolve, reject) => {
    axios.post(AGENT_URL, {
      prompt
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    })
  })
}

export { post }
