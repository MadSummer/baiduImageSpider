const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const pinyin = require('node-pinyin');
const Iconv = require('iconv-lite');
const result = path.resolve(__dirname, '../result.json');
const mv = require('mv');


getStarsFromBaidu('http://top.baidu.com/buzz?b=22&c=9&fr=topbuzz_b3_c9', 'male', function () {
  getStarsFromBaidu('http://top.baidu.com/buzz?b=3&c=9&fr=topbuzz_b22_c9', 'female');
});

/**
 * 
 * 
 * @param {String} url
 * fetch url
 * @param {String} sex
 * star sex
 * @param {function} cb
 * callback
 */
function getStarsFromBaidu(url, sex, cb) {
  request
    .get({
      url: url,
      encoding: null
    }, (err, res, body) => {
      const $ = cheerio.load(Iconv.decode(body, 'gb2312').toString());
      const names = $('.list-table tr .keyword .list-title');
      let arr = [];
      let stars;
      fs.exists(result, exist => {
        if (exist) {
          fs.readFile(result, 'utf8', (err, data) => {
            if (err) return console.log(`读取文件出错`);
            if (!data) data = '[]';
            stars = JSON.parse(data);
            stars.forEach(star => {
              arr.push(star.name);
            });
            pushStar();
          });
        } else {
          stars = [];
          pushStar();
        }
      });

      function pushStar() {
        names.each((i, e) => {
          let name = $(e).text();
          if (arr.indexOf(name) === -1) {
            stars.push({
              name: name,
              pn: 0,
              sex: sex,
              folder: pinyin(name, {
                style: 'normal'
              }).join('')
            })
          }
        });
        fs.writeFileSync(result, JSON.stringify(stars));
        typeof cb === 'function' && cb();
        console.log(`获取明星列表完毕`);
      }
    });
}

// https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E5%91%A8%E6%9D%B0%E4%BC%A6&pn=1&spn=0&di=169273488230&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=2&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=-1&cs=2648943646%2C557806145&os=1468302619%2C3918332227&simid=0%2C0&adpicid=0&lpn=0&ln=3966&fr=&fmq=1498534213955_R