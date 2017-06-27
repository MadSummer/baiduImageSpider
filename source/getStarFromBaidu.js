const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const pinyin = require('node-pinyin');
const Iconv = require('iconv-lite');
const result = path.resolve(__dirname, '../result.json');
const mv = require('mv');
request
  .get({
    url: 'http://top.baidu.com/buzz?b=22&c=9&fr=topbuzz_b3_c9',
    encoding: null
  }, (err, res, body) => {
    const $ = cheerio.load(Iconv.decode(body, 'gb2312').toString());
    const names = $('.list-table tr .keyword .list-title');
    let arr = [];
    fs.exists(result, exist => {
      if (exist) {
        fs.readFile(result, 'utf8', (err, data) => {
          if (err) return console.log(`读取文件出错`);
          if (!data) data = '[]';
          let stars = JSON.parse(data);
          stars.forEach(star => {
            arr.push(star.name);
          });
          names.each((i, e) => {
            let name = $(e).text();
            if (arr.indexOf(name) === -1) {
              stars.push({
                name: name,
                pn:0,
                sex: 'female',
                folder: pinyin(name, {
                  style: 'normal'
                }).join('')
              })
            } else {
              stars[i].sex = 'female'
            }
          });
          fs.writeFileSync(result, JSON.stringify(stars));
        });
      }
    });
  });