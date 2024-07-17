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
    appid: any;
    apiKey: any;
    hostUrl: any;
    ws: any;
    rtasrResult: any[];
    status: boolean;
    constructor({ appid, apiKey, hostUrl }: any) {
        this.appid = appid;
        this.apiKey = apiKey;
        this.hostUrl = hostUrl;
        this.ws = null;
        this.rtasrResult = [];
    }
    startWss() {
        return new Promise((resolve, reject) => {
            // 获取当前时间戳
            const ts = parseInt(String(new Date().getTime() / 1000), 10)
            const wssUrl = this.hostUrl + "?appid=" + this.appid + "&ts=" + ts + "&signa=" + this.getSigna(ts)
            const ws = new WebSocket(wssUrl)

            // 连接建立完毕，读取数据进行识别
            ws.on('open', () => {
                console.log("websocket connect!")
                this.ws = ws
                resolve(1)
            })
            // 建连错误
            ws.on('error', (err: any) => {
							console.log("websocket connect err: " + err)
                resolve(-1)
            })
        })
    }
    onMessage(callback: any){
        if (!this.ws) return;
        this.ws.on('message', (data: string, err: any) => {
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
                    let result = ''
                    // 把转写结果解析为句子
                    if (data.cn.st.type == 0) {
											this.rtasrResult.forEach(i => {
                            let str = ''
                            // str += (i.cn.st.type == 0) ? "【最终】识别结果：" : "【中间】识别结果："
                            i.cn.st.rt.forEach((j: { ws: any[]; }) => {
                                j.ws.forEach((k: { cw: any[]; }) => {
                                    k.cw.forEach((l: { w: string; }) => {
                                        str += l.w
                                    })
                                })
                            })
                            console.log('结果:',str)
                            if (i.cn.st.type == 0) {
                                result += str
                            }
                        })
                        // 最终生成的结果
                        if (data.ls) {
                            callback([2, result])
                            this.clearRtasrResult()
                        }
                    }
                    break
            }
        })
    }
		sendAudioStream(stream: any) {
				if (!this.ws) return;
				this.ws.send(stream)
		}
		endAudioStream() {
				if (!this.ws) return;
				this.ws.send("{\"end\": true}")
		}
		clearRtasrResult() {
			this.rtasrResult = []
		}
    close() {
        this.ws.close()
    }
    getSigna(ts: number) {
        let md5 = CryptoJS.MD5(this.appid + ts).toString()
        let sha1 = CryptoJS.HmacSHA1(md5, this.apiKey)
        let base64 = CryptoJS.enc.Base64.stringify(sha1)
        return encodeURIComponent(base64)
    }
}

export default SparkWssAudio