# Meow! (社会性フィルター)

## Inspired by
[Sociality filter](https://twitter.com/sh4869sh/status/767244989503901696)  

## Install
```sh
$ git clone git@github.com:albno273/meow.git
```
```sh
$ mkdir config
$ touch config/key.json
$ vi config/key.json
```
```json
{
    "test": {
        "cons_key":      "xxx",
        "cons_sec":      "xxx",
        "acc_token":     "xxx",
        "acc_token_sec": "xxx"
    }
}
```
```sh
$ npm install
$ node meow.js
```

## Require

- node.js
    - [twitter](https://www.npmjs.com/package/twitter)  
    - [confu](https://www.npmjs.com/package/confu)
    - [kuromoji](https://www.npmjs.com/package/kuromoji)
    - [async](https://www.npmjs.com/package/async)

- dictionary
    - [Japanese Sentiment Polarity Dictionary ](http://www.cl.ecei.tohoku.ac.jp/index.php?Open%20Resources%2FJapanese%20Sentiment%20Polarity%20Dictionary)
    - [PN Table](http://www.lr.pi.titech.ac.jp/~takamura/pndic_ja.html)

## License
[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE) - <b>!! EXCEPT DIC !!</b>

## Reference
### JSPD
1. Nozomi Kobayashi, Kentaro Inui, Yuji Matsumoto, Kenji Tateishi. Collecting Evaluative Expressions for Opinion Extraction, Journal of Natural Language Processing 12(3), 203-222, 2005.
1. Masahiko Higashiyama, Kentaro Inui, Yuji Matsumoto. Learning Sentiment of Nouns from Selectional Preferences of Verbs and Adjectives, Proceedings of the 14th Annual Meeting of the Association for Natural Language Processing, pp.584-587, 2008.

### PN Table
1. Hiroya Takamura, Takashi Inui, Manabu Okumura,
"Extracting Semantic Orientations of Words using Spin Model", In Proceedings of the 43rd Annual Meeting of the Association for Computational Linguistics (ACL2005) , pages 133--140, 2005. 

## Contact
[@albNo273](https://twitter.com/albNo273)
