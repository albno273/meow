// 社会性フィルター

'use strict';
const confu   = require('confu'),
	  twitter = require('twitter'),
	  tm      = require('./tweet_meow.js'),
	  sa      = require('./sentiment_analysis.js');

// CK/CS 読み込み
const conf = confu('.', 'config', 'key.json'),
      client = new twitter({
          consumer_key:        conf.tweet.cons_key,
          consumer_secret:     conf.tweet.cons_sec,
          access_token_key:    conf.tweet.acc_token,
          access_token_secret: conf.tweet.acc_token_sec
      });

// にゃーんカウンタ
let meowCount = 1;

/**
 * 本体
 * 'follow: ---' には自分のユーザIDを入力
 */
console.log('Sociality filter activated.');
// client.stream('user', function (stream) {
client.stream('statuses/filter', { follow: 3021775021 }, function (stream) {

	stream.on('data', (tweet) => {
		const text    = tweet.text,					// ツイート内容
			  id      = tweet.id_str, 				// ツイートID(削除時に使用) 
			  isRT    = tweet.retweeted_status,		// リツイートかどうか
			  isReply = tweet.in_reply_to_user_id;	// リプライかどうか

		// リプライとRTとにゃーんツイートそのものを除外
		if (isRT == null && isReply == null && text.includes('にゃーん')) {
			judge();	
		}

		async function judge() {
			console.log('tweet:    ',text);
			const saResult = await sa(text);
			console.log('sentiment:', saResult.sentiment);
			console.log('score:    ', saResult.score);
			if (saResult.sentiment == 'negative' && saResult.score > 0.9) {
				console.log('Negative tweet detected!')
				const tmResult = await tm(id, meowCount);
				if(tmResult == 'Success')
					await meowCount++;
			}
		}
	});

	stream.on('error', (err) => {
		console.log(err);
	});

});