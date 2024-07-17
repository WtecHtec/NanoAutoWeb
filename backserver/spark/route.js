const summaryPrompt = require('../prompts/summary');
const getJueJin = require('../tools/getJueJin');
const request = require('./request')
const express = require('express');
const router = express.Router();
// const writeFile = require('../tools/writeFile')
const WorkLLM = require('../scripts/work.llm')

router.post('/chat', async (req, res) => {
    const data = req.body;
    console.log(data);
    if (!data || !data.prompt) {
        res.json({ code: -1, msg: '参数错误' });
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
        res.json({ code: 0, data: result, msg: '请求成功' });
    } else {
        res.json({ code: err, msg: '异常错误' });
    }
});

// 总结
router.post('/summary', async (req, res) => {
    const data = req.body;
    console.log(data);
    if (!data || !data.prompt) {
        res.json({ code: -1, msg: '参数错误' });
        return
    }
    const content = await getJueJin(data.prompt)
    if (!content) {
        res.json({ code: err, msg: '异常错误' });
        return
    }
    const message = [
        {
            "role": "user",
            "content":  summaryPrompt + content
        }
    ]
    const [err, result] = await request(message)
    if (err === 0) {
        // writeFile('./summary.md', result[0].message.content)
        res.json({ code: 0, data: result, msg: '请求成功' });
    } else {
        res.json({ code: err, msg: '异常错误' });
    }
});

// agent
router.post('/agent', async (req, res) => {
    const data = req.body;
    console.log(data);
    if (!data || !data.prompt) {
        res.json({ code: -1, msg: '参数错误' });
        return
    }
    const [code, result] =  await WorkLLM(data.prompt)
    res.json({ code, data: result, msg: '请求成功' });
});


// 导出路由模块  
module.exports = router;