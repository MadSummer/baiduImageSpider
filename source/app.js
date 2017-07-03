const CONFIG = require('./config');
const request = require('request');
const qs = require('querystring');
const co = require('co');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const Logger = require('log4js');
Logger.configure({
  appenders: [{
      type: 'console'
    },
    {
      type: 'file',
      filename: path.resolve(__dirname, `../logs/log.log`)
    }
  ]
});
const log = Logger.getLogger();

let index = 0; //明星index
let current = []; // 保存本次任务执行进度
start(index);

function start(index) {
  fs.readFile(path.resolve(__dirname, '../result.json'), 'utf8', (err, result) => {
    if (err) {
      log.error(`读取结果文件出错，读取路径：\n${path.resolve(__dirname, '../result.json')}\n${err.message}`);
      return;
    }
    let data = JSON.parse(result);
    let star = data[index];
    if (!star) return log.debug(`全部抓取完成`);
    if (current[index] > CONFIG.total) {
      log.debug(`${star.name}抓取${star.pn}页完成`);
      index++;
      start(index);
      return;
    }
    star.pn += 1;
    if (current[index] === undefined) current[index] = 0;
    current[index] += 1;
    fs.writeFileSync(path.resolve(__dirname, '../result.json'), JSON.stringify(data));
    getResult(CONFIG.rn, star);
  });
}

function getResult(rn, star) {
  log.debug(`开始抓取${star.name}第${star.pn}页`);
  let params = qs.stringify({
    pn: star.pn,
    rn: rn,
    word: star.name
  });
  request.get(CONFIG.getJSONURL + params, (error, res, body) => {
    if (error) return;
    let result;
    try {
      result = JSON.parse(body);
    } catch (error) {
      log.debug(`parse response error!!!`);
      start(index + 1);
    }
    if (!result) return;
    if (result.data instanceof Array) {
      let x = 0;
      result.data.forEach(data => {
        (function (data) {
          let imgURL = data.middleURL || data.thumbURL;
          if (!imgURL) return;
          let imgPath = path.resolve(__dirname, `../img/${star.sex}/${star.folder}`);
          let arr = imgURL.split('.');
          if (['jpg', 'png', 'jpeg', 'gif'].indexOf(arr[arr.length - 1]) === -1) {
            x++;
            return log.error(`返回地址出错：${imgURL}`);
          }
          mkdirp(imgPath, error => {
            if (error) return log.debug(error);
            let imgName = `${star.folder}-${+new Date()}-${Math.random()}.${arr[arr.length - 1]}`;
            let writer = fs.createWriteStream(path.resolve(`${imgPath}/${imgName}`));
            writer.on('finish', () => {
              if (x >= result.data.length - 2) {
                log.debug(`${star.name}第${star.pn}抓取完成,url=${CONFIG.getJSONURL + params}`);
                start(index);
              } else {
                x++;
              }
            });
            writer.on('error', () => {
              log.error(`地址出错,url=${CONFIG.getJSONURL + params}`);
              return x++;
            });
            request.get(imgURL).pipe(writer);
          });
        })(data)

      });
    }
  });
}