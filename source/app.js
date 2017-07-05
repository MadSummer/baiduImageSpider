/*
 * @Author: Liu Jing 
 * @Date: 2017-07-03 16:54:21 
 * @Last Modified by: Liu Jing
 * @Last Modified time: 2017-07-05 18:09:20
 */
const CONFIG = require('./config');
const request = require('request-promise');
const co = require('co');
const fs = require('fs');
const path = require('path');
const log = require('./log');
const readFile = require('fs-readfile-promise');
const getJSON = require('./getJSON');
const getImage = require('./getImage');

start();

function start() {
  co(function* () {
    let result = yield readFile(path.resolve(__dirname, '../result.json'));
    let data = JSON.parse(result);
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      for (let j = 0; j < CONFIG.total; j++) {
        let list = yield getJSON(obj);
        if (!list.data) return;
        for (let k = 0; k < list.data.length; k++) {
          let data = list.data[k];
          yield getImage(data, obj);
        }
        obj.pn += 1;
        fs.writeFileSync(path.resolve(__dirname, '../result.json'), JSON.stringify(data));
        log.debug(`${obj.name}第${obj.pn}页抓取完成`);
      }
    }
    log.debug(`本次任务执行完成`);
  }).catch(err => {
    debugger;
    log.error(err)
  });
}