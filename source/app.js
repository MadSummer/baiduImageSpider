/*
 * @Author: Liu Jing 
 * @Date: 2017-07-03 16:54:21 
 * @Last Modified by: Liu Jing
 * @Last Modified time: 2017-07-13 12:06:26
 */
const CONFIG = require('./config');
const request = require('request-promise');
const co = require('co');
const fs = require('fs');
const ProgressBar = require('progress');
const {
  exec
} = require('child_process');
const path = require('path');
const log = require('./log');
const readFile = require('fs-readfile-promise');
const getJSON = require('./getJSON');
const getImage = require('./getImage');
let successNum = 0;
let failedNum = 0;

const shutdown = process.argv[2];
const time = process.argv[3] || 100;
let bar = new ProgressBar(':barthe computer will be shutdown,press anykey to cancel', {
  total: +time /10
});
let yesno = require('yesno');
let i = 0;
const program = require('commander');
program
  .option('-s, --shutdown', 'shutdown after task over')
  .option('-t, --time', 'shutdown time remind', 300)
  .parse(process.argv);
start();
if (program.shutdown) {
  yesno.ask('the computer will be shutdown... press anykey to cancel', false, () => {
    clearInterval(timer);
    process.exit();
  })
  let timer = setInterval(() => {
    i++;
    if (bar.complete) {
      clearInterval(timer);
      exec(`shutdown -s -f -t`, () => {
        console.log(``);
      });
    }
    bar.tick();
  }, 1000);
}
function start() {
  const startTime = +new Date() / 1000;
  co(function* () {
    let result = yield readFile(path.resolve(__dirname, '../result.json'));
    let data = JSON.parse(result);
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      if (obj.pn >= CONFIG.max) continue;
      for (let j = 0; j < CONFIG.total; j++) {
        let list = yield getJSON(obj);
        if (!list || !list.data) continue;
        for (let k = 0; k < list.data.length; k++) {
          let data = list.data[k];
          let flag = yield getImage(data, obj);
          if (flag) {
            successNum += 1;
          }
          if (!flag) {
            failedNum += 1;
          }
        }
        log.debug(`${obj.name}第${obj.pn}页抓取完成`);
        obj.pn += 1;
        fs.writeFileSync(path.resolve(__dirname, '../result.json'), JSON.stringify(data));
      }
    }
    log.debug(`本次任务执行完成`);
    const endTime = +new Date() / 1000;
    log.info(`本次任务耗时${Math.round(endTime - startTime)}秒,抓取成功${successNum},抓取失败${failedNum}`);
  }).catch(err => {
    log.error(err)
  });
}