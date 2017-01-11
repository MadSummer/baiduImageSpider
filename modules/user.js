'use strict';
const config = require('../config');
const request = require('superagent');
const utils = require('./utils');
const async = require('async');
class user {
  constructor(page) {
    this.page = page || '';
    this.info = {
      total: 0,
      active: [],
      activeTime: {},
      activeType: {}
    };
  }
  getActives(cb) {
    let self = this;
    let query = {
      limit: config.limit
    }
    if (self.info.active.length > 1) {
      query.after_id = self.info.active[self.info.active.length - 1].id;
    }
    request.get(`${config.api}${this.page}/activities`)
      .set(config.requestHeader)
      .query(query)
      .end((err, res) => {
        if (err) return console.log(err);
        if (!res.body || !res.body.data instanceof Array) return;
        res.body.data.forEach((active) => {
          self.info.total += 1;
          let hour = utils.formatStamp(active.created_time * 1000) + '';
          let k = hour + '点';
          let v = self.info.activeTime[k] !== undefined ? self.info.activeTime[k] + 1 : 1;
          self.info.activeTime[k] = v;
          self.info.active.push(active);
          let k1 = config.activeType.get(active.verb);
          let v1 = self.info.activeType[k1] !== undefined ? self.info.activeType[k1] + 1 : 1;
          self.info.activeType[k1] = v1;
        });
        if (!res.body.paging.is_end && self.info.total < config.max) {
          let url = res.body.paging.next;
          return self.getActives(cb);
        }
        cb(self);
      });
  }
}
module.exports = user;