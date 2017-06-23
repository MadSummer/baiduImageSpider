const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
rimraf(path.resolve(__dirname, '../img'), (err) => {
  if (err) return console.log('清除图片失败！');
  console.log('清除图片完成！');
  fs.readFile(path.resolve(__dirname, '../result.json'), 'utf8', (err, result) => {
    if (err) {
      log.error(`读取结果文件出错，读取路径：\n${path.resolve(__dirname, '../result.json')}\n${err.message}`);
      return;
    }
    let data = JSON.parse(result);
    data.forEach(star => {
      star.pn = 0;
    });
    fs.writeFileSync(path.resolve(__dirname, '../result.json'), JSON.stringify(data));
    console.log(`清除爬取进度完成！`);
  });
})