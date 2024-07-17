/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import SparkAudioWss from './spark-audio-wss';

import ENV from '../../env.json';

const sparkAudioWss = new SparkAudioWss({ appid: ENV.WSS_APPID, apiKey: ENV.WSS_SECRET_KEY, hostUrl: ENV.WSS_HOST });



class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let audioWssStatus = false;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  if (!audioWssStatus) {
    sparkAudioWss.startWss().then((code) => {
      if (code === 1) {
        audioWssStatus = true;
      }
    })
  }
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // 获取屏幕的主显示器信息
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // 设置窗口的宽度和高度
  const windowWidth = 100;
  const windowHeight = 100;
  mainWindow = new BrowserWindow({
    show: false,
    width: windowWidth,
    height: windowHeight,
    // x: width - windowWidth,
    // y: height - windowHeight,
    frame: true, // 无边框
    transparent: true, // 透明窗口
    alwaysOnTop: true, // 窗口总是显示在最前面
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function handleAgent(outputPath: string) {
  const readerStream = fs.createReadStream(outputPath, {
    highWaterMark: 1280
  });
  readerStream.on('data', (chunk) => {
    console.log(chunk.length)
    sparkAudioWss.sendAudioStream(chunk)
  });
  readerStream.on('end', () => {
    // 最终帧发送结束
    console.log('readerStream----end')
    sparkAudioWss.endAudioStream()
  });

  sparkAudioWss.onMessage((item: any) => {
    console.log(item)
    const [code, result] = item
    if (code === 2) { 
      console.log('exprot-blob-render--- handle agent', result);
    }
  })
}

app
  .whenReady()
  .then(() => {
    log.info('whenReady');
    createWindow();

    ipcMain.on('exprot-blob-render', async (_, { buffer }) => {
      // Mp4Demux.demux(arrayBuffer)
      // const buf = Buffer.from(buffer);
      // const outputPath = path.join(
      //   __dirname,
      //   'audio-recorder.pcm',
      // );
      // fs.writeFileSync(outputPath, buf);



      const outputPath = path.join(
        __dirname,
        './recording.pcm',
      );
      console.log('exprot-blob-render---', outputPath);

     

      if (audioWssStatus) {
        handleAgent(outputPath);
      } else {
        sparkAudioWss.startWss().then((code) => {
          if (code === 1) {
            audioWssStatus = true;
            handleAgent(outputPath);
          }
        })
      }
      // console.log('exprot-blob-render---', text);
    });

    app.on('activate', () => {
      log.info('activate');
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
