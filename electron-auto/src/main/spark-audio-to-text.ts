import axios from 'axios';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class SparkAudioToText {
  appid: string;

  secretkey: string;

  uploadUrl: string;

  resultUrl: string;

  signa: string | undefined;

  constructor({ appid, secretkey }) {
    this.appid = appid;
    this.secretkey = secretkey;
    this.uploadUrl = 'https://raasr.xfyun.cn/v2/api/upload';
    this.resultUrl = 'https://raasr.xfyun.cn/v2/api/getResult';
  }

  getAppidMd5() {
    // 创建MD5哈希实例
    const hash = crypto.createHash('md5');

    // 更新哈希对象的数据
    hash.update(`${this.appid}${new Date().getTime() / 1000}`);
    const digest = hash.digest('hex');
    return digest;
  }

  getSecretKeyHmacSHA1() {
    // 待加密的消息
    const message = this.getAppidMd5();

    // 创建HMAC实例，设置算法为sha1
    const hmac = crypto.createHmac('sha1', this.secretkey);

    // 更新HMAC实例的数据（可以是字符串、Buffer等）
    hmac.update(message);

    // 计算HMAC摘要
    const digest = hmac.digest('hex'); // 指定输出格式为hex
    return digest;
  }

  // eslint-disable-next-line class-methods-use-this
  getBase64(data) {
    return Buffer.from(data).toString('base64');
  }

  // eslint-disable-next-line class-methods-use-this
  getFileInfo(filePath) {
    const stat = fs.statSync(filePath);
    return {
      name: path.basename(filePath),
      size: stat.size,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getFileData(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  upload(filePath) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (_resolve) => {
      const { name, size } = this.getFileInfo(filePath);
      const result = await axios.post(
        `${this.uploadUrl}?fileName=${name}&fileSize=${size}&duration=${parseInt(String(Math.random() * 10), 10)}`,
        {
          data: this.getFileData(filePath),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
			console.log(result);
			_resolve(result);
    });
  }
}

export default SparkAudioToText;
