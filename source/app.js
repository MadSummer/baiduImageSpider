const request = require('request');
const CONFIG = require('./config');
request.get(CONFIG.getJSONURL, function (error,res,body) {
  if (error) return;
  let result;
  try {
    result = JSON.parse(body);
  } catch (error) {
    console.log(`parse response error!!!`);
  }
  if (!result) return;
  console.log(result.queryExt);
})