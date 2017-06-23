const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const pinyin = require('node-pinyin');

const result = path.resolve(__dirname, '../result.json');
request.get({
  url: 'http://top.baidu.com/buzz?b=3&c=9&fr=topcategory_c9',
  encoding: 'utf8'
}, (err, res, body) => {
  const $ = cheerio.load(body);
  const names = $('.list-table tr .keyword .list-title');
  let arr = [];
  fs.exists(result, exist => {
    if (exist) {
      fs.readFile(result, 'utf8', (err, data) => {
        if (err) return console.log(`读取文件出错`);
        let stars = JSON.parse(data);
        stars.forEach(star => {
          arr.push(star.name);
        });
        names.each((i, e) => {
          let name = $(e).text();
          if (arr.indexOf(name) === -1) {
            stars.push({
              name: name,
              sex: 'female',
              folder: pinyin(name, {
                style: 'normal'
              }).join('')
            })
          }
        });
        fs.writeFileSync(result, JSON.stringify(stars));
      });
    }
  });
});