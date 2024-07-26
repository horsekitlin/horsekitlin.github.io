---
title: Promise 的那些事
author: TomasLin
categories: Javascript
tags: 
  - Javascript
---

# Promise

[前情提要](https://www.youtube.com/watch?v=bhhNRZh8RvM&feature=youtu.be)

[Allen Promise 心得](https://paper.dropbox.com/doc/Node.js-Design-Patterns-Tfa1QvhfBhfFpqmk7N4Zv)

## Why?

使用 **Promise** 至今都有一個小小的疑問

因為原生的 **Promise** 僅僅提供幾個API

* resolve

* reject

* all

今天想討論的是 **all** 這一個API

因為Javascript 是一個非同步的架構

[Node Design Patten](https://www.facebook.com/groups/907391389364145/)
研讀至今也學習到相當多過去不曾想過的問題

在併發處理 **Promise** 上

原生將處理併發結果依舊歸類為 resolve, reject

依據 [Promise/A+](https://promisesaplus.com/)的規範中可以理解

但是在錯誤訊息傳遞中依舊只是回傳某一個Promise的錯誤

而無法確認是哪一個 或是哪幾個 Promise 產生了錯誤

## Example

利用FB的爬蟲作為範例

```js
https://graph.facebook.com/4?fields=id,name&access_token=1573834372888743|kwOadcjpVBhyNj5_r_m_Teffb3Y
```

這是可以抓到 Mark Zuckerberg 的URL

Demo Code

```js
var fetch = require('node-fetch');

async function main() {
  const resp = await fetch('https://graph.facebook.com/4?fields=id,name&access_token=1573834372888743|kwOadcjpVBhyNj5_r_m_Teffb3Y').then(resp => resp.json());
  console.log(resp);
}

main();
```

但是我要抓 Facebook UID 4,5,6,7,8,9,10 的時候

```js
var fetch = require('node-fetch');

function main() {
  const uids = [4, 5, 6, 7, 8, 9, 10];
  const processes = uids.map((uid, index) => {
    if (index === 3) {
      return Promise.reject(new Error(`Hello Error ${index}`));
    }
    return fetch(`https://graph.facebook.com/${uid}?fields=id,name&access_token=1573834372888743|kwOadcjpVBhyNj5_r_m_Teffb3Y`).then(resp => resp.json());
  });
  Promise.all(processes)
    .then(results => console.log(`results: ${JSON.stringify(results)}`))
    .catch(error => {
      console.log(error);
      return false
    });
}
main();
```

但是我在例子中的第四筆和第六筆的時候拋出一個 **reject**

所以結果是

```js
Error: Hello Error 3
    at uids.map (/Users/tomas/otherProjects/blog/demo/nodejs/fbAPIGetUser.js:7:29)
    at Array.map (native)
    at main (/Users/tomas/otherProjects/blog/
```

只有抓到四筆的錯誤

但是此狀態會希望取得所有的錯誤

下次可以再依據錯誤重新處理

[Promise](https://github.com/then/promise)
原始碼
