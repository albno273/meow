var twitter = require('twitter');
var confu = require('confu');

var conf = confu('.', 'config', 'key.json');
var client = new twitter({
	consumer_key: conf.test.cons_key,
	consumer_secret: conf.test.cons_sec,
	access_token_key: conf.test.acc_token,
	access_token_secret: conf.test.acc_token_sec
});

var filter = ['つらい', '死にたい', '死ね', '殺す', '疲れた'];
var count = 1;

console.log('Sociality filter activated.');
client.stream('statuses/filter', { follow: 3021775021 }, function (stream) {

	stream.on('data', function (tweet) {
		var text = tweet.text;
		var id = tweet.id_str;
		var i = filter.length;

		while (i--) {
			if (text.indexOf(filter[i]) !== -1) {

				console.log('Negative word(s) detected!')
				console.log('catch: ' + filter[i]);
				setTimeout(function () {
					client.post('statuses/destroy/' + id, function (err, rep) {
						if (!err) {
							console.log('Delete succeeded.');
							setTimeout(function () {
								var tweet_body = 'にゃーん (通算' + count + '回目)';
								client.post('statuses/update',
									{ status: tweet_body },
									function (err, rep) {
										if (!err) {
											console.log('Tweet succeeded. Meow!');
											count++;
										} else {
											console.log('Tweet failed...');
											console.log(err);
										}
									});
							}, 1000);
						} else {
							console.log('Delete failed...');
							console.log(err);
						}
					});
				}, 1000);

				break;
			}
		}
	});

	stream.on('error', function (error) {
		console.log(error);
	});

});