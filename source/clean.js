/*
 * @Author: Liu Jing 
 * @Date: 2017-07-03 16:54:13 
 * @Last Modified by: Liu Jing
 * @Last Modified time: 2017-07-12 17:25:34
 */
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const yesno = require('yesno');
const yn = require('yn');
const chalk = require('chalk');
const ProgressBar = require('progress');
const tips = `This will delete all the pictures and reset the download progress ,are you sure continue ?`;
yesno.ask(tips, false, ok => {
  ok = yn(ok);
  if (ok) {
    console.log(chalk.yellow(`start progress`));
    let bar = new ProgressBar(':bar', {
      total: 100
    });
    rimraf(path.resolve(__dirname, '../images'), (err) => {
      if (err) return console.log(chalk.red(`something wrong`));
      bar.tick();
      fs.readFile(path.resolve(__dirname, '../result.json'), 'utf8', (err, result) => {
        if (err) {
          return;
        }
        let data = JSON.parse(result);
        data.forEach((star, index) => {
          star.pn = 1;
          if (!bar.complete) {
            bar.tick();
          }
        });
        fs.writeFileSync(path.resolve(__dirname, '../result.json'), JSON.stringify(data));
        console.log(chalk.green(`all done...`));
        process.exit();
      });
    })
  } else {
    console.log(chalk.yellow('Canceled..'));
    process.exit();
  }
})