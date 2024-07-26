---
title: ReasonReact-publish-package
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - React
categories:
  - Reason
date: 2018-11-11
---

# Initial Project

```
  $ bsb -init helloworld -theme basic-reason
```

移除 `src/Demo.re`

新增一個 `src/index.re`

*src/index.re*
```reason
let add = (a: int, b: int): int => a + b;
```

*package.json*
```json
{
  "name": "tomas-math",
  "version": "1.0.1",
  "scripts": {
    "build": "bsb -make-world",
    "start": "bsb -make-world -w",
    "clean": "bsb -clean-world"
  },
  "keywords": [
    "BuckleScript"
  ],
  "files": [
    "src/index.bs.js"
  ],
  "main": "src/index.bs.js",
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "bs-platform": "^4.0.7"
  }
}
```

```
  $ npm login
  $ npm publish
```

# Install yourname-math

建立一個新的 project

```
  $ npm init
  $ npm install yourname-math
```

會看到 node_modules

```
├── index.js
├── node_modules
│   └── tomas-math
│       ├── README.md
│       ├── package.json
│       └── src
│           └── index.bs.js
├── package-lock.json
└── package.json
```

因為我們指定了 公開 `index.bs.js`

也是我們主要引入的檔案

*index.js*
```javascript
const {add} = require('tomas-math');
console.log(add(1, 2)); //3
```

很簡單吧

其實跟原本的 Nodejs 的 publish 大同小異

卻可以使用到 Reason 的形態檢查

明天再來討論如果有第三方套件該如何使用

以 lodash 為範例