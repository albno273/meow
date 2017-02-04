/* 形態素解析 -> ネガポジ判定 -> 社会性フィルター */

var twitter = require('twitter'),
	confu = require('confu'),
	kuromoji = require('kuromoji'),
	readline = require('readline'),
	fs = require('fs'),
	async = require('async');

/** 
 * CK/CS 読み込み
 * config/key.json に記述するかここに直接記述
 */
var conf = confu('.', 'config', 'key.json'),
	client = new twitter({
		consumer_key: conf.test.cons_key,
		consumer_secret: conf.test.cons_sec,
		access_token_key: conf.test.acc_token,
		access_token_secret: conf.test.acc_token_sec
	});

// 形態素解析辞書のディレクトリ指定
var builder = kuromoji.builder({
	dicPath: 'node_modules/kuromoji/dict'
});

// にゃーんカウンタ
var count = 1;

/**
 * 'follow: ---' には自分のユーザIDを入力
 */
console.log('Sociality filter activated.');
client.stream('statuses/filter', { follow: 3021775021 }, function (stream) {
	// client.stream('user', function (stream) {

	stream.on('data', function (tweet) {

		var text = tweet.text,
			id = tweet.id_str,
			isRT = tweet.retweeted_status,
			isReply = tweet.in_reply_to_user_id;

		// リプライとRTを除外
		if (isRT == null && isReply == null) {
			console.log('tweet: ' + text);
			// 同期処理
			async.waterfall([
				morphologicalAnalysis,
				scoreingTweet,
				socialityFilter
			], function (err, score) {
				if (err)
					throw err;
				else
					console.log('score:  ' + score);
			});
		}

		/** 
		 * 形態素解析して名詞と用言の基本形を抽出
		 */
		function morphologicalAnalysis(callback) {
			stringSplitter(text, function (err, words_arr) {
				if (!err)
					callback(null, words_arr);
			});
		}

		/** 
		 * 日本語極性辞書を参照して各単語をスコアリング
		 * 現在の評価モデル: 全単語の平均スコア
		 */
		function scoreingTweet(words_arr, callback) {
			console.log(words_arr);
			stringScore(words_arr, function (err, jspd, pnt) {
				if (!err) {
					console.log('JSPD:     ' + jspd / words_arr.length);
					console.log('PN Table: ' + pnt / words_arr.length);
					var score = ((jspd + pnt) / 2) / words_arr.length;
					callback(null, score);
				}
			});
		}

		/**
		 * 社会性フィルタ
		 * 引っかかった時に該当ツイートを消して「にゃーん」ツイート
		 */
		function socialityFilter(score, callback) {
			if (score < 0)
				console.log('result: negative');
			else if (score > 0)
				console.log('result: positive');
			else
				console.log('result: neutral');

			if (score < -0.3) {
				console.log('Very Negative tweet detected!')
				// tweetMeow(id);
			}
			callback(null, score);
		}
	});

	stream.on('error', function (err) {
		console.log(err);
	});

});

/**
 * 入力した文章を品詞分解して抽出
 * @param text 入力文字列
 */
function stringSplitter(text, callback) {
	var words_arr = [];

	builder.build(function (err, tokenizer) {
		if (!err) {
			var filtered_tokens = tokenizer.tokenize(text).forEach(
				function (value, index, array) {
					if (value.basic_form != '*')
						words_arr.push(value.basic_form);
				});
			callback(null, words_arr);
		}
	});
}

/**
 * 各単語のスコアを合算
 * @param words_arr 単語の入った array
 */
function stringScore(words_arr, callback) {
	var score_ip_jspd = 0,
		score_ip_pnt = 0;

	async.parallel([
		function (callback) {
			words_arr.forEach(function (value, index, array) {
				verbScoreFromPNTable(value, function (err, point) {
					if (!err)
						score_ip_pnt += point;
					if (index == words_arr.length - 1)
						callback(null, score_ip_pnt);
				});
			});
		},
		function (callback) {
			words_arr.forEach(function (value, index, array) {
				verbScoreFromJSPD(value, function (err, point) {
					if (!err)
						score_ip_jspd += point;
					if (index == words_arr.length - 1)
						callback(null, score_ip_jspd);
				});
			});
		}
	], function (err, scores) {
		if (err)
			throw err;
		else
			callback(null, scores[0], scores[1]);
	});
}

/**
 * 単語のスコアを JSPD から参照
 * @param word 単語
 */
function verbScoreFromJSPD(word, callback) {
	var rs = fs.ReadStream('dic/parse_dic'),
		rl = readline.createInterface({ 'input': rs, 'output': {} }),
		point_of_word = 0;

	rl.on('line', function (line) {
		var line_arr = line.split(':');
		if (word == line_arr[0]) {
			point_of_word = parseFloat(line_arr[2]);
		}
	});

	rl.on('error', function (err) {
		console.log(err);
	});

	rl.on('close', function () {
		// console.log('word: ' + word);
		// console.log('verb point in JSPD: ' + point_of_word);
		callback(null, point_of_word);
	});

}

/**
 * 単語のスコアを PN Table から参照
 * @param word 単語
 */
function verbScoreFromPNTable(word, callback) {
	var rs = fs.ReadStream('dic/pn_ja.dic'),
		rl = readline.createInterface({ 'input': rs, 'output': {} }),
		point_of_word = 0;

	rl.on('line', function (line) {
		var line_arr = line.split(':');
		if (word == line_arr[0]) {
			point_of_word = parseFloat(line_arr[3]);
		}
	});

	rl.on('error', function (err) {
		console.log(err);
	});

	rl.on('close', function () {
		// console.log('word: ' + word);
		// console.log('verb point in PN:   ' + point_of_word);
		callback(null, point_of_word);
	});

}

/**
 * 「にゃーん」をツイート
 * @param id ツイートID
 */
function tweetMeow(id) {
	setTimeout(function () {
		client.post('statuses/destroy/' + id, function (err, rep) {
			if (!err) {
				console.log('Delete succeeded.');
				setTimeout(function () {
					var tweet_body = 'にゃーん (通算' + count + '回目)';
					client.post('statuses/update', { status: tweet_body },
						function (err, rep) {
							if (!err) {
								console.log('Tweet succeeded. Meow!');
								count++;
							} else {
								console.log('Tweet failed...');
								console.log(err);
							}
						});
				}, 2000);
			} else {
				console.log('Delete failed...');
				console.log(err);
			}
		});
	}, 3000);
}