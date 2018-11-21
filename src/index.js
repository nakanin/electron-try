'use strict';

const electron = require('electron');
const remote = electron.remote;

const ngModule = angular.module('electron-try', []);

ngModule.controller('MainController', function ($scope) {
  const main = this;

  main.url = 'https://www.google.com';

  main.openUrl = (url) => {
    if (!url) {
      return
    }
    let win = remote.getCurrentWindow();
    let view = new remote.BrowserView({
      webPreferences: {
        nodeIntegration: false
      }
    })
    win.setBrowserView(view)
    view.setBounds({ x: 0, y: 200, width: 1400, height: 600 })
    view.webContents.loadURL(url)
  }
});
