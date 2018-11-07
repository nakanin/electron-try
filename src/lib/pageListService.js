'use strict';

const fs = require('fs');
const request = require('request-promise-native');
const crypto = require('crypto')

const filename = 'pageList.json'
const requestConfigFilename = 'requestConfig.json'

const STATUS_NO_CHANGE = "noChange";
const STATUS_CHANGED = "changed";
const STATUS_ERROR = "error";

const md5hex = (str) => {
  const md5 = crypto.createHash('md5')
  return md5.update(str, 'binary').digest('hex')
};

const writeFile = (list) => {
  fs.writeFileSync(filename, JSON.stringify(list, null, '    '), 'utf-8');
};

const getRequestConfig = () => {
  if (fs.existsSync(requestConfigFilename)) {
    return JSON.parse(fs.readFileSync(requestConfigFilename, 'utf-8'));
  } else {
    return {};
  }
};

const pageListService = {
  STATUS_NO_CHANGE: STATUS_NO_CHANGE,
  STATUS_CHANGED: STATUS_CHANGED,
  STATUS_ERROR: STATUS_ERROR,
  getList: function () {
    if (fs.existsSync(filename)) {
      return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    } else {
      return [];
    }
  },
  addUrl: function (url) {
    let list = this.getList();
    list.push({
      url: url,
      status: null,
      lastTime: null
    });
    writeFile(list);
    return list;
  },
  deleteUrl: function (url) {
    let list = this.getList().filter(page => page.url !== url);
    writeFile(list);
    return list;
  },
  checkUpdate: function () {
    let requests = [];
    let config = getRequestConfig();
    console.log(config);
    this.getList().forEach(page => {
      requests.push(
        request.get(page.url, config)
          .then(data => {
            let hash = md5hex(data);
            if (hash === page.hash) {
              page.status = STATUS_NO_CHANGE;
            } else {
              page.status = STATUS_CHANGED;
              page.hash = hash;
            }
            page.lastTime = Date.now();
            delete page.error;
            return page;
          })
          .catch(error => {
            page.error = error;
            page.status = STATUS_ERROR;
            page.lastTime = Date.now();
            return page;
          })
      );
    });
    return Promise.all(requests)
      .then(responses => {
        writeFile(responses);
        return(responses);
      });
  }
};

module.exports = pageListService;
