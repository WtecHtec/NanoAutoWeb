

/**
 *
 * 运行前：请先填写Appid、APIKey、APISecret
 *
 * 实时转写调用demo
 * 此demo只是一个简单的调用示例，不适合用到实际生产环境中
 * 
 * @author white
 *
 */
const CryptoJS = require('crypto-js')
const WebSocket = require('ws')
var fs = require('fs')
var log = require('log4node')

// 系统配置
const config = {
    // 请求地址
    hostUrl: "wss://rtasr.xfyun.cn/v1/ws",
    //在控制台-我的应用-实时语音转写获取
    appid: "********",
    //在控制台-我的应用-实时语音转写获取
    apiKey: "******************************",
    file: "./test_1.pcm",//请填写您的音频文件路径
    highWaterMark: 1280
}

// 获取当前时间戳
let ts = parseInt(new Date().getTime() / 1000)

let wssUrl = config.hostUrl + "?appid=" + config.appid + "&ts=" + ts + "&signa=" + getSigna(ts)
let ws = new WebSocket(wssUrl)

// 连接建立完毕，读取数据进行识别
ws.on('open', (event) => {
    log.info("websocket connect!")
})

// 得到识别结果后进行处理，仅供参考，具体业务具体对待
let rtasrResult = []


// 资源释放
ws.on('close', () => {
    log.info('connect close!')
})

// 建连错误
ws.on('error', (err) => {
    log.error("websocket connect err: " + err)
})

// 鉴权签名

class SparkWssAudio {

    constructor({ appid, apiKey, hostUrl }) {
        this.appid = appid;
        this.apiKey = apiKey;
        this.hostUrl = hostUrl;
        this.ws = null

    }
    startWss() {
        return new Promise((resolve, reject) => {
            // 获取当前时间戳
            const ts = parseInt(new Date().getTime() / 1000)
            const wssUrl = this.hostUrl + "?appid=" + this.appid + "&ts=" + ts + "&signa=" + this.getSigna(ts)
            const ws = new WebSocket(wssUrl)

            // 连接建立完毕，读取数据进行识别
            ws.on('open', (event) => {
                log.info("websocket connect!")
                this.ws = ws
                resolve(1)
            })
            // 建连错误
            ws.on('error', (err) => {
                log.error("websocket connect err: " + err)
                resolve(-1)
            })
        })
    }
    onAudioText(stream, callback){
        if (!this.ws) return;
        this.ws.on('message', (data, err) => {
            if (err) {
                log.info(`err:${err}`)
                return
            }
            let res = JSON.parse(data)
            switch (res.action) {
                case 'error':
                    log.info(`error code:${res.code} desc:${res.desc}`)
                    callback([-1, res])
                    break
                // 连接建立
                case 'started':
                    log.info('started!')
                    log.info('sid is:' + res.sid)
                    // 开始读取文件进行传输
                    var readerStream = fs.createReadStream(config.file, {
                        highWaterMark: config.highWaterMark
                    });
                    readerStream.on('data', function (chunk) {
                        ws.send(chunk)
                    });
                    readerStream.on('end', function () {
                        // 最终帧发送结束
                        ws.send("{\"end\": true}")
                    });
                    break
                case 'result':
                    // ... do something
                    let data = JSON.parse(res.data)
                    rtasrResult[data.seg_id] = data
                    // 把转写结果解析为句子
                    if (data.cn.st.type == 0) {
                        rtasrResult.forEach(i => {
                            let str = ''
                            str += (i.cn.st.type == 0) ? "【最终】识别结果：" : "【中间】识别结果："
                            i.cn.st.rt.forEach(j => {
                                j.ws.forEach(k => {
                                    k.cw.forEach(l => {
                                        str += l.w
                                    })
                                })
                            })
                            log.info(str)
                        })
        
                    }
                    break
            }
        })
    }
    close() {
        this.ws.close()
    }
    getSigna(ts) {
        let md5 = CryptoJS.MD5(this.appid + ts).toString()
        let sha1 = CryptoJS.HmacSHA1(md5, this.apiKey)
        let base64 = CryptoJS.enc.Base64.stringify(sha1)
        return encodeURIComponent(base64)
    }
}