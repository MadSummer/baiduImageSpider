/*
 * @Author: Liu Jing 
 * @Date: 2017-07-03 16:55:46 
 * @Last Modified by: Liu Jing
 * @Last Modified time: 2017-07-03 17:18:50
 */

const Logger = require('log4js');
const path = require('path');
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
module.exports = log;