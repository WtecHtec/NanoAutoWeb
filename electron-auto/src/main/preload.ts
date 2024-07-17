// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// export type Channels = string;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: string, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    // on(channel: string, func: (...args: unknown[]) => void) {
    //   const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
    //     func(...args);
    //   ipcRenderer.on(channel, subscription);

    //   return () => {
    //     ipcRenderer.removeListener(channel, subscription);
    //   };
    // },
    on(...args: Parameters<typeof ipcRenderer.on>) {
      const [channel, listener] = args;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return ipcRenderer.on(channel, (event, ...args) =>
        listener(event, ...args),
      );
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
      const [channel, ...omit] = args;
      return ipcRenderer.off(channel, ...omit);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
