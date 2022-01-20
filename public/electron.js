const { app, BrowserWindow, webContents } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');

// require("@electron/remote/main").enable(webContents);
// require('@electron/remote/main').initialize();

let mainWindow;
 
function createWindow() {
    mainWindow = new BrowserWindow({
        width:950,
        height:520,
        resizable: false,
        show: false,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: __dirname + '/preload.js'
        }
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
 
    mainWindow.loadURL(startURL);
 
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.on('ready', createWindow);
