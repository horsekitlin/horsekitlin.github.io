---
title: Express-Router
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
date: 2018-10-26
---

# Router

在上一篇中提到了 `Middleware`

今天會討論到更多細節的部分

但是第一步要先了解關於 `Router`

Express 可以拿來寫 `RESTful API`

但是 `route` 要如何分類呢？

雖然之前已經有用 `app.get` 來做基本的 `route`

但是如果大量使用的話其實會造成程式碼的雜亂跟難以維護

所以 Express 中有一個 `Router` 的 funciton 

可以產出一個 Router 物件

然後再藉由 `app.use` 來做 route 的實現和管理

基本上可以這樣分類


**分類方式沒有絕對答案**

*routes/userRoutes.js*

```javascript
const express = require('express');
const router = express.Router();

router.post('/', (req, res, _) => {
  res.json({name: 'tomas'});
});

module.exports = router;
```

*app.js*

```javascript
const express = require('express');
const userRouter = require('./routes/usersRoutes');
const app = express();

const port = 5000;

app.use('/user', userRouter);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

這時候如果我們用 `POST` 呼叫 `http://localhost:5000/user`

得到的 respnose 會是 `{"name": "tomas"}`

我想這部分應該沒什麼問題

然後我們按照之前的模式把這些程式碼改為 `.re`

*routes/UserRoutes.re*

```reason
type response = {. "name": string };
type res = {.
  [@bs.meth] "send": string => string,
  [@bs.meth] "json": response => string
 };
type nextFun = unit => string;
type handler = (string, res, nextFun) => string;

type router = {.
  [@bs.meth] "get": (string, handler) => string,
  [@bs.meth] "use": handler => unit
};

[@bs.module "express"] external router: unit => router = "Router";


let routes = router();

routes##get("/", (_, res, _) => {
  let resp = {"name": "tomas"};
  res##json(resp);
});
```

```reason
type res = {.
  [@bs.meth] "send": string => string
 };

type nextFun = unit => string;
type handler = (string, res, nextFun) => string;

type expressApp = {.
  [@bs.meth] "use": handler => unit,
  [@bs.meth] "listen": (int) => unit,
  [@bs.meth] "get": (string, handler, handler) => string
};

type router = {.
  [@bs.meth] "get": (string, handler) => string,
  [@bs.meth] "use": handler => unit
};

[@bs.module] external express: unit => expressApp = "express";
[@bs.module "./routes/UserRoutes.bs"] external userRoutes: router = "routes";

let app = express();

[@bs.val] external use: handler => unit = "app.use";
[@bs.val] external useWithString: (string, router) => unit = "app.use";

use((_, _, next) => {
  Js.log("here is use function");
  next();
});

useWithString("/user", userRoutes);

app##get("/", (_, _, next) => {
  Js.log("hello next");
  next();
}, (_, res, _) => res##send("Hello World!"));

app##listen(5000);
```

首先遇到幾個問題

* 一個是如何 `require` 正確的 `routes/UserRoutes.bs` 中的 `routes`?
  * 延伸怎麼控制 export ? 只能用 Reason 預設的？
* app.use 有兩種 input 格式 如何處理?

```reason
[@bs.module "./routes/UserRoutes.bs"] external userRoutes: router = "routes";
```

第一個問題基本上上述那一行就可以解決

### Import And Export

之前有提過如何引用共用模組

今天來談談本地的模組引用問題

在 `Reason` 中如何控制 `export` 呢？

BuckleScript 支援

* CommonJS (require('MyFile'))
* ES6 modules (import myFile from 'MyFile')
* AMD(define(['myFile'], ...)

預設的 `let` 綁定的值都會自動 `export`

所以其他檔案都可以使用

#### Export ES6 value

example:

*student.js*
```javascript
export default name = "Al";
```

*teacher.js*
```javascript
import studentName from 'student.js';
```

在 Reason 中只需要用 `let` 綁定 default 這個變數

就可以自動輸出 ES6 預設模組

*FavoriteStudent.ml*
```reason
let default = "default value";
```

*demo.js*
```javascript
import studentName from 'FavoriteStudent.js';
```

#### Import

使用 `@bs.module`

```reason
[@bs.module "path"] external dirname : string => string = "dirname";
let root = dirname("/User/chenglou");
```

output
```javascript
var Path = require("path");
var root = Path.dirname("/User/chenglou");
```

#### Import Default value

```reason
[@bs.module] external leftPad : string => int => string = "./leftPad";
let paddedResult = leftPad("hi", 5);
```

output

```javascript
var LeftPad = require("./leftPad");
var paddedResult = LeftPad("hi", 5);
```

#### Import an ES6 Default value

```reason
[@bs.module "./student"] external studentName : string = "default";
Js.log(studentName);
```

```javascript
const Student = require("./student");
console.log(Student.default);
```

當你在 BuckleScript 端使用的名稱和 JS 名稱相匹配

你可以使用空字串

```reason
[@bs.module "path"] external dirname : string => string = "";
```

### 相同的 Function 不同的參數

我們可以看到 `app.use` 和 `router.use` 中有兩種不同的輸入值

```javascript
app.use((req, res, next) => {
  next();
});

app.use('/user', userRouter);
```

如上例可以看到 相同的 `app.use` 卻有兩種不同的輸入值得型態

在強形態中不能將這種 視為同樣的一個 function

所以要將它分為兩種 function 型態

```reason
type handler = (string, res, nextFun) => string;
type router = {.
  [@bs.meth] "get": (string, handler) => string,
  [@bs.meth] "use": handler => unit
};

[@bs.val] external use: handler => unit = "app.use";
[@bs.val] external useWithString: (string, router) => unit = "app.use";
```

可以看到 `use` 的 參數是放入一個 `handler` 的類型

而另一個 `useWithString` 也是 `app.use`

但是參數的類型是另外的 `(string, router) => unit`

第一個參數是字串 第二個是 `router` 的類型

裡面有一個  `get` 和 `use` 的 method

當然若是要實現 `RESTful API` 要再增加 `post`, `put`, `delete`....

不過方式也都一樣

也就不贅述了