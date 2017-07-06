/*
 * @Author: Liu Jing 
 * @Date: 2017-07-03 16:54:02 
 * @Last Modified by: Liu Jing
 * @Last Modified time: 2017-07-06 18:02:17
 */
const fs = require('fs');
const request = require('request-promise');
const cheerio = require('cheerio');
const path = require('path');
const pinyin = require('node-pinyin');
const Iconv = require('iconv-lite');
const result = path.resolve(__dirname, '../result.json');


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
  let options = {
    url: url,
    encoding: null
  };
  let objs = [];
  let arr = [];
  request
    .get(options)
    .then(html => {
      let $ = cheerio.load(Iconv.decode(html, 'gb2312').toString());
      let names = $('.list-table tr .keyword .list-title');
      fs.exists(result, exist => {
        if (exist) {
          fs.readFile(result, 'utf8', (err, data) => {
            if (err) return console.log(`读取文件出错`);
            if (!data) data = '[]';
            objs = JSON.parse(data);
            objs.forEach(star => {
              arr.push(star.name);
            });
          });
        }
        names.each((i, e) => {
          let name = $(e).text();
          if (arr.indexOf(name) === -1) {
            objs.push({
              name: name,
              pn: 1,
              folder: `${sex}/${pinyin(name, {style: 'normal'}).join('')}`
            })
          }
        });
        fs.writeFileSync(result, JSON.stringify(objs));
        typeof cb === 'function' && cb();
        console.log(`获取明星列表完毕`);
      });
    });
}

var str = 'asdfssaaasasasasaa';
var set = new Set();
var obj = {};
var max = 0;
for (let s of str) {
  obj[s] == undefined ? obj[s] = 1 : obj[s] += 1;
}
Math.max.apply(null,Object.values(obj))