const { contextBridge, ipcRenderer } = require('electron');

const jetpack = require('fs-jetpack');
contextBridge.exposeInMainWorld('electron', {
    dialog: require('@electron/remote')
});
contextBridge.exposeInMainWorld('jetpack', jetpack);