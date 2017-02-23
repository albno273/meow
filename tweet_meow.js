// 「にゃーん」をツイート

'use strict';
const confu   = require('confu'),
      twitter = require('twitter');

// CK/CS 読み込み
const conf = confu('.', 'config', 'key.json'),
      client = new twitter({
          consumer_key:        conf.tweet.cons_key,
          consumer_secret:     conf.tweet.cons_sec,
          access_token_key:    conf.tweet.acc_token,
          access_token_secret: conf.tweet.acc_token_sec
      });

module.exports = async (tweetId, meowCount) => {
    await sleep(1000);
    const dt = await deleteTweet(tweetId);
    if (!dt) {
        await sleep(1000);
        const tm = await tweetMeow(meowCount);
        if (!tm)
            return 'Success';
        else
            return 'Failed';
    } else
        return 'Failed';
}

// 即時削除 -> 即時ツイートにならないための緩衝
function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time)
    });
}

// ツイートを削除
function deleteTweet(tweetId) {
    return new Promise((resolve, reject) => {
        client.post('statuses/destroy/' + tweetId, function (err, res) {
            if (err)
                reject(err);
            else
                resolve();
        });
    })
    .catch((err) => {
        console.log('code:', err[0].code, '/', err[0].message);
        return err;
    });
}

// にゃーんをツイート
function tweetMeow(meowCount) {
    return new Promise((resolve, reject) => {
        const tweetBody = 'にゃーん (通算' + meowCount + '回目)';
        client.post('statuses/update', { status: tweetBody }, function (err, res) {
            if (err)
                reject(err);
            else
                resolve();
        });
    })
    .catch((err) => {
        console.log('code:', err[0].code, '/', err[0].message);
        return err;
    });
}