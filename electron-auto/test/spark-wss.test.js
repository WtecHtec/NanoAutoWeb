/* eslint-disable  */
const fs = require('fs');
const path = require('path');
const SparkWssAudio = require('./spark-wss.js');
// 开始读取文件进行传输
const readerStream = fs.createReadStream(path.join(__dirname, './recording.pcm'), {
	highWaterMark: 1280
});
console.log(path.join(__dirname, './data.wav'))
const ENV = require('../env.json')

function main() {

  const sparkWssAudio = new SparkWssAudio({ appid: ENV.WSS_APPID, apiKey: ENV.WSS_SECRET_KEY, hostUrl: ENV.WSS_HOST });
	sparkWssAudio.startWss().then((code) => {
		if (code !== 1) return
		readerStream.on('data', (chunk) => {
			console.log(chunk.length)
			sparkWssAudio.sendAudioStream(chunk)
		});
		readerStream.on('end', () => {
			// 最终帧发送结束
			console.log('end')
			sparkWssAudio.endAudioStream()
    });

		sparkWssAudio.onMessage((item) => {
			console.log(item)
		})
  });
}

main();
// setTimeout(() => {
	
// }, 1000 * 60 * 60);

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
// const CryptoJS = require('crypto-js')
// const WebSocket = require('ws')
// // var fs = require('fs')
// var log = console.log

// // 系统配置
// const config = {
//   // 请求地址
//   hostUrl: ENV.WSS_HOST,
//   //在控制台-我的应用-实时语音转写获取
//   appid: ENV.WSS_APPID,
//   //在控制台-我的应用-实时语音转写获取
//   apiKey: ENV.WSS_SECRET_KEY,
//   file: path.join(__dirname, './test_1.pcm'),//请填写您的音频文件路径
//   highWaterMark: 1280
// }

// // 获取当前时间戳
// let ts = parseInt(new Date().getTime() / 1000)

// let wssUrl = config.hostUrl + "?appid=" + config.appid + "&ts=" + ts + "&signa=" + getSigna(ts)
// let ws = new WebSocket(wssUrl)

// // 连接建立完毕，读取数据进行识别
// ws.on('open', (event) => {
//   log("websocket connect!")
// })

// // 得到识别结果后进行处理，仅供参考，具体业务具体对待
// let rtasrResult = []
// ws.on('message', (data, err) => {
//   if (err) {
//     log(`err:${err}`)
//     return
//   }
//   let res = JSON.parse(data)
//   switch (res.action) {
//     case 'error':
//       log(`error code:${res.code} desc:${res.desc}`)
//       break
//       // 连接建立
//     case 'started':
//       log('started!')
//       log('sid is:' + res.sid)
//       // 开始读取文件进行传输
//       var readerStream = fs.createReadStream(config.file, {
//         highWaterMark: config.highWaterMark
//       });
//       readerStream.on('data', function (chunk) {
//         ws.send(chunk)
//       });
//       readerStream.on('end', function () {
//         // 最终帧发送结束
//         ws.send("{\"end\": true}")
//       });
//       break
//     case 'result':
//       // ... do something
//       let data = JSON.parse(res.data)
//       rtasrResult[data.seg_id] = data
// 	  // 把转写结果解析为句子
//       if (data.cn.st.type == 0) {
//         rtasrResult.forEach(i => {
//           let str = "实时转写"
//           str += (i.cn.st.type == 0) ? "【最终】识别结果：" : "【中间】识别结果："
//           i.cn.st.rt.forEach(j => {
//             j.ws.forEach(k => {
//               k.cw.forEach(l => {
//                 str += l.w
//               })
//             })
//           })
//           log(str)
//         })

//       }
//       break
//   }
// })

// // 资源释放
// ws.on('close', () => {
//   log('connect close!')
// })

// // 建连错误
// ws.on('error', (err) => {
//   log("websocket connect err: " + err)
// })

// // 鉴权签名
// function getSigna(ts) {
//   let md5 = CryptoJS.MD5(config.appid + ts).toString()
//   let sha1 = CryptoJS.HmacSHA1(md5, config.apiKey)
//   let base64 = CryptoJS.enc.Base64.stringify(sha1)
//   return encodeURIComponent(base64)
// }

