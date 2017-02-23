'use strict';
const sa = require('../sentiment_analysis.js');

const text1 = 'ともだちが増えるよ！やったねたえちゃん！' // 多分 Positive
const text2 = '今日も1日仕事で疲れたけどビールが美味い' // Positive になってほしい
const text3 = 'テスト: つらい' // Negative

async function test() {
    // console.log(text1, await sa(text1));
    // console.log(text2, await sa(text2));
    const saResult = await sa(text3);
	console.log('sentiment:', saResult.sentiment);
	console.log('score:    ', saResult.score);
}

test();