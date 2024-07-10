const request = require('./request')
function sparkRoute(app) {
    app.post('/spark', async (req, res) => {
        const data = req.body;
        console.log(data);
        if (!data || !data.prompt) {
            res.json({code: -1, msg: '参数错误'});
            return
        }
        const message = [
            {
                "role": "user",
                "content": data.prompt
            }
        ] 
        const [err, result] = await request(message)
        if (err === 0) {
            res.json({code: 0, data: result, msg: '请求成功'});
        } else {
            res.json({code: err, msg: '异常错误'});
        }
    });
}

module.exports = sparkRoute