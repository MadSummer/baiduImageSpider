/*
 * @Author: Liu Jing 
 * @Date: 2017-07-03 16:54:13 
 * @Last Modified by: Liu Jing
 * @Last Modified time: 2017-07-06 10:39:28
 */
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
rimraf(path.resolve(__dirname, '../images'), (err) => {
  if (err) return console.log('清除图片失败！');
  console.log('清除图片完成！');
  fs.readFile(path.resolve(__dirname, '../result.json'), 'utf8', (err, result) => {
    if (err) {
      log.error(`读取结果文件出错，读取路径：\n${path.resolve(__dirname, '../result.json')}\n${err.message}`);
      return;
    }
    let data = JSON.parse(result);
    data.forEach(star => {
      star.pn = 1;
    });
    fs.writeFileSync(path.resolve(__dirname, '../result.json'), JSON.stringify(data));
    console.log(`清除爬取进度完成！`); 
  });
})