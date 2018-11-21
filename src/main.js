'use strict';

const {app, BrowserWindow, Menu, Tray, Notification} = require('electron')

let mainWindow = null;
let tray = null

app.setAppUserModelId(process.execPath);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  Menu.setApplicationMenu(menu);

  setUpMainWindow();

  setUpTray();
});

const template = [
  {
    label: 'electron-try',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click: () => app.quit()
      }
    ]
  }, {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Ctrl+R',
        click: () => BrowserWindow.getFocusedWindow().reload()
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Shift+Ctrl+I',
        click: () => BrowserWindow.getFocusedWindow().toggleDevTools()
      }
    ]
  }
];
const menu = Menu.buildFromTemplate(template);

const setUpMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400, 
    height: 800,
    show: true
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const setUpTray = () => {
  tray = new Tray(__dirname + '/icon.png');
  tray.setToolTip(app.getName());
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
  const contextMenu = Menu.buildFromTemplate([
    {label: '終了', click: () => {
      mainWindow = null;
      app.quit();
    }}
  ])
  tray.setContextMenu(contextMenu)
};
