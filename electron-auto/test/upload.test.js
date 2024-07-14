const path = require('path');
const ENV = require('../env.json');
const SparkAudioToText = require('./spark-audio-to-text.js');

const sparkAudioToText = new SparkAudioToText({
  appid: ENV.APPID,
  secretkey: ENV.SECRET_KEY,
});
// const orderId = 'DKHJQ20240714211216820c1do0gA6YbrI3E0Z';

async function main() {
  // sparkAudioToText.upload(path.join(__dirname, 'data.wav'));
  // sparkAudioToText.getSigna();
  // const data = await sparkAudioToText.getResult(orderId);
  // console.log(data);
  await sparkAudioToText.audioToText(path.join(__dirname, 'data.wav'));
}

main();
