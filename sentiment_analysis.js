// Apitore の日本語極性判定 API から文字列の極性判定を受け取る
// https://apitore.com/store/apis/details?id=11

'use strict';
const request = require('request'),
      confu = require('confu');

const errJSON = {"sentiment": null, "score": null};

module.exports = async (text) => {
    return await new Promise((resolve, reject) => {
        const endPoint = 'https://api.apitore.com/api/11/sentiment/predict',
              apiKey   = confu('.', 'config', 'key.json').apiKeys.apitore,
              url      = endPoint + '?access_token=' + apiKey + '&text=' + text,
              options  = {
                  url:     encodeURI(url),
                  method:  'get',
                  headers: { 'Accept': 'application/json' },
                  json:    true
              };

        request(options, function (err, res, body) {
            if (err)
                reject(err);
            else
                resolve(body.predict);
        });
    })
    .catch((err) => {
            console.log(err);
            return errJSON;
        });
}