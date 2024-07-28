---
title: NodeDesignPatten-06
author: TomasLin
date: 2017-05-31
categories: Designpatten
tags:
  - Nodejs
  - DesignPatten
---

# Design Patten

設計模式是關於程式碼重複使用的問題

推薦書籍

* [Elements of Reusable Object-Oriented Software](https://sophia.javeriana.edu.co/~cbustaca/docencia/DSBP-2016-03/recursos/Erich%20Gamma,%20Richard%20Helm,%20Ralph%20Johnson,%20John%20M.%20Vlissides-Design%20Patterns_%20Elements%20of%20Reusable%20Object-Oriented%20Software%20%20-Addison-Wesley%20Professional%20(1994).pdf)
* [Pearson Education](http://www.pearsoned.co.uk/bookshop/ebooks)
* [ Gang of Four (GoF)](http://www.uml.org.cn/c++/pdf/DesignPatterns.pdf)

## Design Pattern List

* Factory
* Revealing constructor
* Proxy
* Decorator
* Adapter
* Strategy
* State
* Template
* Middleware
* Command

### Factory

在 Javascript 中 設計通常以可用，簡單並且模組化開發為主旨

而使用 **Factory** 則可以在物件導向上包覆一層 Wrapper 

使用上可以更加彈性

在 Factory 中可以透過 Object.create() 來建立一個物件

或是利用特定的條件來建立不同的物件

### Example

factory.js

```js
const ImageJpeg = require('./imageJpeg');
const ImageGif = require('./imageGif');
const ImagePng = require('./imagePng');

function createImage(name) {
  if (name.match(/\.jpe?g$/)) {
    return new ImageJpeg(name);
  } else if (name.match(/\.gif$/)) {
    return new ImageGif(name);
  } else if (name.match(/\.png$/)) {
    return new ImagePng(name);
  } else {
    throw new Exception('Unsupported format');
  }
}

const image1 = createImage('photo.jpg');
const image2 = createImage('photo.gif');
const image3 = createImage('photo.png');

console.log(image1, image2, image3);
```

imageJpeg.js

```js
"use strict";

const Image = require('./image');

module.exports = class ImageJpg extends Image {
  constructor(path) {
    if (!path.match(/\.jpe?g$/)) {
      throw new Error(`${path} is not a JPEG image`);
    }
    super(path);
  }
};
```

imagePng.js

```js
"use strict";

const Image = require('./image');

module.exports = class ImagePng extends Image {
  constructor(path) {
    if (!path.match(/\.png$/)) {
      throw new Error(`${path} is not a PNG image`);
    }
    super(path);
  }
};
```

imageGif.js

```js
"use strict";

const Image = require('./image');

module.exports = class ImageGif extends Image {
  constructor(path) {
    if (!path.match(/\.gif/)) {
      throw new Error(`${path} is not a GIF image`);
    }
    super(path);
  }
};
```

## 封裝

封裝是防止某些程式碼被外部直接飲用或更改時使用

也稱為訊息隱藏

而 Javascript 常用 [Closure](https://zh.wikipedia.org/wiki/%E9%97%AD%E5%8C%85_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6)) 來實現

### Example

```js
function createPerson(name) {
  const privateProperties = {};
  const person = {
    setName: name => {
      if (!name) throw new Error('A person must have a name');
      privateProperties.name = name;
    },
    getName: () => privateProperties.name
  };

  person.setName(name);
  return person;
}

const person = createPerson('Tomas Lin');
console.log(person.getName(), person);
```

此範例中的person 只有透過 setName與 getName可以對person 取值與修改

```
使用 Factory 只是其中一個方式

另外也有不成文約定

在function 前加上 **_** 或 **$**

但是這樣依舊可以在外部呼叫

另外也可以使用 [WeakMap](http://fitzgeraldnick.com/2014/01/13/hiding-implementation-details-with-e6-weakmaps.html) 
```

## 建立一個完整的 Factory Demo

profiler.js

```js
class Profiler {
  constructor(label) {
    this.label = label;
    this.lastTime = null;
  }

  start() {
    this.lastTime = process.hrtime();
  }
  end() {
    const diff = process.hrtime(this.lastTime);
    console.log(
      `Timer "${this.label}" took ${diff[0]} seconds and ${diff[1]} nanoseconds.`
    );
  }
}

module.exports = function (label) {
  if (process.env.NODE_ENV === 'development') {
    return new Profiler(label);        //[1]
  } else if (process.env.NODE_ENV === 'production') {
    return {             //[2]
      start: function () { },
      end: function () { }
    }
  } else {
    throw new Error('Must set NODE_ENV');
  }
}
```

profilerTest.js

```js
const profiler = require('./profile');

function getRandomArray(len) {
  const p = profiler(`Generating a ${len} items long array`);
  p.start();
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(Math.random());
  }
  p.end();
}

getRandomArray(1e6);
console.log('Done');
```

```
  $ NODE_ENV=development node profilerTest
```

```
  $ NODE_ENV=production node profilerTest
```

## 組合工廠

利用遊戲的方式來解說

通常一種遊戲會有多種角色

每種角色會擁有各自不同的基本能力

* Runner: 可移動
* Samurai: 可移動並且攻擊
* Sniper: 可射擊但不可移動
* Gunslinger: 可移動並且射擊
* Western Samurai: 可以移動 攻擊 並射擊

希望上述可以自由地互相結合

所以不能使用 Class 或是 inheritance 來解決

## Example

使用套件[stampit](https://www.npmjs.com/package/stampit)

