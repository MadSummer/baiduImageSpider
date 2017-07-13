/*
 * @Author: Liu Jing 
 * @Date: 2017-07-03 17:40:02 
 * @Last Modified by: Liu Jing
 * @Last Modified time: 2017-07-12 18:15:16
 */

const log = require('./log');
const config = require('./config'); 
const qs = require('qs');
const request = require('request-promise');
module.exports = function (obj) {
  let params = qs.stringify({
    pn: obj.pn,
    rn: config.rn,
    word: obj.name
  });
  let options = {
    uri: config.getJSONURL + params,
    transform: body => {
      let json;
      try {
        json = JSON.parse(body);
      } catch (error) {
        log.error(`解析json列表出错！`)
      }
      return json; 
    }
  }
  return request.get(options);
}