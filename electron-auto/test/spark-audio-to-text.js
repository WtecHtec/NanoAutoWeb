const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class SparkAudioToText {
  constructor({ appid, secretkey, maxRetries = 20,  }) {
    this.appid = appid;
    this.secretkey = secretkey;
    this.uploadUrl = 'https://raasr.xfyun.cn/v2/api/upload';
    this.resultUrl = 'https://raasr.xfyun.cn/v2/api/getResult';
    this.ts = new Date().getTime();
    this.maxRetries = maxRetries;
    this.delayTime = 30 * 1000;
  }

  getAppidMd5() {
    // 创建MD5哈希实例
    const hash = crypto.createHash('md5');

    // 更新哈希对象的数据
    hash.update(`${this.appid}${this.ts}`);
    // hash.update('595f23df1512041814')
    const digest = hash.digest('hex');
    return digest;
  }

  getSecretKeyHmacSHA1() {
    // 待加密的消息
    const message = this.getAppidMd5();

    // 创建HMAC实例，设置算法为sha1
    const hmac = crypto.createHmac('sha1', this.secretkey);
    // const hmac = crypto.createHmac('sha1',  'd9f4aa7ea6d94faca62cd88a28fd5234');
    // 更新HMAC实例的数据（可以是字符串、Buffer等）
    hmac.update(message);

    // 计算HMAC摘要
    const digest = hmac.digest('base64'); // 指定输出格式为base64
    return digest;
  }

  // eslint-disable-next-line class-methods-use-this
  getFileInfo(filePath) {
    const data = this.getFileData(filePath);
    const byteLength = Buffer.byteLength(data, 'utf-8');
    return {
      name: path.basename(filePath),
      size: byteLength,
      data,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getFileData(filePath) {
    const data = fs.readFileSync(filePath, '');
    return data;
  }

  getSigna() {
    return this.getSecretKeyHmacSHA1();
  }

  // eslint-disable-next-line class-methods-use-this
  upload(filePath) {
    this.ts = new Date().getTime();
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (_resolve) => {
      const { name, size, data } = this.getFileInfo(filePath);
      this.signa = this.getSigna();
      // console.log('--', size, data.length);
      const result = await axios.post(
        `${this.uploadUrl}?signa=${this.signa}&fileName=${encodeURIComponent(name)}&fileSize=${size}&duration=${parseInt(String(Math.random() * 10), 10)}&appId=${this.appid}&ts=${this.ts}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(result.data);
      if (result && result.data && result.data.code === '000000') {
        const { content } = result.data || {};
        const { orderId, taskEstimateTime } = content || {};
        _resolve([1, orderId, taskEstimateTime]);
        return;
      }
      _resolve([0, result.data]);
    });
  }

  getResult(orderId) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (_resolve) => {
      const result = await axios.get(
        `${this.resultUrl}?orderId=${orderId}&ts=${this.ts}&signa=${this.signa}&appId=${this.appid}&resultType=transfer`,
      );
      _resolve(result.data);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  delay(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  async audioToText(filePath) {
    const [code, orderId, taskEstimateTime] = await this.upload(filePath);
		console.log('code:', code, orderId)
    if (code === 1) {
      this.delayTime = taskEstimateTime || 30 * 1000;
      let index = 0;
      while (index < this.maxRetries) {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.getResult(orderId);
        try {
					console.log('status:', index, result)
          if (result.code === '000000') {
            const { status } = result.content.orderInfo;
            if (status === 4) {
              index = this.maxRetries + 1;
							console.log('status 结束:', index, result)
              return [1, result.content];
            }
          }
        } catch (error) { /* empty */ }
        // eslint-disable-next-line no-await-in-loop
        await this.delay(this.delayTime);
				console.log('delay:', index, this.delayTime)
        // eslint-disable-next-line no-plusplus
        index += 1;
      }
    }
    return [0, 'fail'];
  }
}

module.exports = SparkAudioToText;
