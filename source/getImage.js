/*
 * @Author: Liu Jing 
 * @Date: 2017-07-03 18:23:57 
 * @Last Modified by: Liu Jing
 * @Last Modified time: 2017-07-05 18:22:41
 */

const request = require('request-promise');
const qs = require('qs');
const co = require('co');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const log = require('./log');
const CONFIG = require('./config');
/**
 * 
 * 
 * @param {Object} data
 * 百度搜索结果返回的json数据
 * @param {Object} obj
 * 设定的抓取对象
 * @returns 
 */
module.exports = function (data, obj) {
  let params = {
    z: '0',
    ipn: 'false',
    word: obj.name,
    hs: '0',
    pn: data.pageNum,
    rn: '1',
    spn: data.spn,
    di: data.di,
    pi: data.pi,
    tn: 'baiduimagedetail',
    is: data.is,
    istype: '2',
    ie: 'utf-8',
    oe: 'utf-8',
    cl: '2',
    lm: '-1',
    st: '-1',
    cs: data.cs,
    os: data.os,
    simid: data.simid,
    adpicid: data.adPicId,
    lpn: '0',
    fm: 'detail',
    ic: '0',
    tab: '0',
    fromurl: data.fromURL,
    gsm: '0',
    rpstart: '0',
    rpnum: '0'
  }
  let url = CONFIG.largeImgBaseUrl + qs.stringify(params);
  return co(function* () {
    let html = yield request.get(url).on('error', err => {
      log.error(err)
    });
    const $ = cheerio.load(html);
    // 如果这种情况拿到大图的url就请求大图，否则请求缩略图
    // 没有的情况需进一步研究，目前为data.adType != 0 ，应该是广告
    let imgURL = $('#hdFirstImgObj').attr('src') || data.middleURL || data.thumbURL;
    if (!imgURL) return;
    let arr = imgURL.split('.');
    let suffix = arr[arr.length - 1];
    if (['jpg', 'png', 'gif', 'jpeg'].indexOf(suffix.toLowerCase()) == -1) {
      return;
    }
    let imgPath = path.resolve(
      __dirname,
      `../images/${obj.sex}/${obj.folder}`
    );
    let imgName = `${obj.folder}-${+new Date()}.${suffix}`;
    mkdirp(imgPath, () => {
      let writer = fs.createWriteStream(path.resolve(imgPath, imgName));
      co(function* () {
        let img = yield request.get(imgURL);
        fs.writeFileSync(path.resolve(imgPath, imgName), img);
      }).catch(err => {
        log.error(`图片地址出错，url=${imgURL}`);
      });
      /*request.get(imgURL)
        .catch(err => {
          log.error(err);
        })
        .pipe(writer);*/
    });
  }).catch(err => {
    log.error(err);
  });
}