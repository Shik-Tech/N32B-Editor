const { contextBridge, remote } = require('electron');
const jetpack = require('fs-jetpack');

contextBridge.exposeInMainWorld('remote', {
    dialog: remote.dialog
});
contextBridge.exposeInMainWorld('jetpack', jetpack);