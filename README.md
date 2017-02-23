# Meow! (社会性フィルター)

## Inspired by
[Sociality filter](https://twitter.com/sh4869sh/status/767244989503901696)  

## Install
Clone Repository
```sh
$ git clone git@github.com:albno273/meow.git
```

Generate key file
```sh
$ mkdir config
$ touch config/key.json
$ vi config/key.json
```

Write CK/CS of your app in ``./config/key.json``
```json
{
    "tweet": {
        "cons_key":      "xxx",
        "cons_sec":      "xxx",
        "acc_token":     "xxx",
        "acc_token_sec": "xxx"
    }
}
```

Install modules and execute
```sh
$ npm install
$ node app.js
```

## Dependencies
- Node v 7.6.0 ~
- [twitter](https://www.npmjs.com/package/twitter)  
- [confu](https://www.npmjs.com/package/confu)

## License
[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)

## Contact
[@albNo273](https://twitter.com/albNo273)
