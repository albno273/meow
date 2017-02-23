'use strict';
const tm = require('../tweet_meow.js');

const tweetID   = '1145141919810',
      meowCount = '893';

async function test() {
    console.log('res:', await tm(tweetID, meowCount));
}

test();