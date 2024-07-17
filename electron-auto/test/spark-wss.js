/* eslint-disable  */
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
const CryptoJS = require('crypto-js');
const WebSocket = require('ws');



// 鉴权签名

class SparkWssAudio {

    constructor({ appid, apiKey, hostUrl }) {
        this.appid = appid;
        this.apiKey = apiKey;
        this.hostUrl = hostUrl;
        this.ws = null
				this.rtasrResult = [];
				this.status = 'start';
    }
    startWss() {
        return new Promise((resolve, reject) => {
            // 获取当前时间戳
            const ts = parseInt(new Date().getTime() / 1000)
            const wssUrl = this.hostUrl + "?appid=" + this.appid + "&ts=" + ts + "&signa=" + this.getSigna(ts)
            const ws = new WebSocket(wssUrl)

            // 连接建立完毕，读取数据进行识别
            ws.on('open', (event) => {
                console.log("websocket connect!")
                this.ws = ws
                resolve(1)
            })
            // 建连错误
            ws.on('error', (err) => {
							console.log("websocket connect err: " + err)
                resolve(-1)
            })
        })
    }
    onMessage(callback){
        if (!this.ws) return;
        this.ws.on('message', (data, err) => {
            if (err) {
							console.log(`err:${err}`)
                return
            }
						
            let res = JSON.parse(data)
						console.log(res)
            switch (res.action) {
                case 'error':
									console.log(`error code:${res.code} desc:${res.desc}`)
                    callback([-1, res])
                    break
                // 连接建立
                case 'started':
										console.log('started!')
                    console.log('sid is:' + res.sid)
										callback([1, res])
                    break
                case 'result':
                    // ... do something
                    let data = JSON.parse(res.data)
										console.log(data)
                    this.rtasrResult[data.seg_id] = data
                    // 把转写结果解析为句子
                    if (data.cn.st.type == 0) {
											this.rtasrResult.forEach(i => {
                            let str = ''
                            str += (i.cn.st.type == 0) ? "【最终】识别结果：" : "【中间】识别结果："
                            i.cn.st.rt.forEach(j => {
                                j.ws.forEach(k => {
                                    k.cw.forEach(l => {
                                        str += l.w
                                    })
                                })
                            })
                            console.log(str)
                        })
												// if (this.status == 'end') {
												// 	this.clearRtasrResult()
												// }
												callback([2,])
                    }
                    break
            }
        })
    }
		sendAudioStream(stream) {
				if (!this.ws) return;
				this.status = 'start'
				this.ws.send(stream)
		}
		endAudioStream() {
				if (!this.ws) return;
				this.status = 'end'
				this.ws.send("{\"end\": true}")
		}
		clearRtasrResult() {
			this.rtasrResult = []
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

module.exports = SparkWssAudio