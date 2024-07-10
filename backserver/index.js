const express = require('express');
const cors = require('cors');
const app = express();
const sparkRoute = require('./spark/route');

// 使用 CORS 中间件
app.use(cors());

// 解析 JSON 和 URL 编码格式的请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  const data = req.body;
  console.log(data);
  res.send('POST request received!');
});

sparkRoute(app);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
