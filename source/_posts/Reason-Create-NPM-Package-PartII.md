---
title: Reason-Create-NPM-Package-PartII
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
categories:
  - Reason
date: 2018-11-02
---

# 建立 Semver 的類別

semver 在 Javascript 可以使用 `new` 關鍵字來產生物件

```javascript
const s = new semver("1.5.0");
s.minor(); // 5
```

在 Reason 中可以使用 class type 來綁定

```reason

class type semverInstance =
[@bs]
{
  pub version: string;
  pub major: int;
  pub minor: int;
  pub patch: int;
  pub raw: string;
  pub build: array(string);
  pub prerelease: array(string)
};

type tSemver = Js.t(semverInstance);
```

完成了這一步先回想一下如何發布 NPM 的套件

## 發布 NPM 套件

[document](https://docs.npmjs.com/getting-started/publishing-npm-packages)

將寫完的 Reason 檔案透過上面的步驟就可以推到 NPM 上面

### 使用 NPM 上的 bs-express 套件

```
  $ npm install bs-express express
```

*bsconfig.json*

```json
  "bs-dependencies": [
    "bs-express"
  ],
```

*Demo.re*
```reason
open Express;

let app = express();

let onListen = e =>
  switch (e) {
  | exception (Js.Exn.Error(e)) =>
    Js.log(e);
    Node.Process.exit(1);
  | _ => Js.log @@ "Listening at http://127.0.0.1:3000"
  };

  App.get(app, ~path="/") @@
Middleware.from((next, req,) => {
  Response.sendString("Hello world")
});

let server = App.listen(app, ~port=3000, ~onListen, ());
```

```
  $ node src/Demo.bs.js
```

[Demo Url](http://localhost:3000/)

你就可以看到 Hello World!

終於串起 Reason 和 NPM 的部分

接下來是怎麼處理 使用 Reason 讓 Javascript 使用呢？
