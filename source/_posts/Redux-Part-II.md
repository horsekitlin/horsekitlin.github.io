---
title: Redux-Part-II
author: TomasLin
tags:
  - React
  - Redux 
date: 2020-09-17
categories:
  - React
---

#  Thunk

經過上一篇了解了 `Redux` 和如何實做  `Middleware` 之後

再來看看 `Thunk` 到底做了什麼事情呢？

## What is Thunk?

`Thunk`  是一個 Function 主要功用是將結果延遲到需要的時候再執行這個 Function  來獲取這份資料

```javascript
function foo() {
  return 1 + 2;
}

const x = 1 + 2;
```

這是最簡單的一個 Thunk

這時候來看一下 `React Thunk` 到底在 `applyMiddleware` 做了什麼事情？

### React Thunk

它其實是多包了一層  Function 來暫時阻止 action 進入 Store

來達到有機會完成非同步的 `Action`

```javascript
import { createStore, applyMiddleware } from 'redux';
import React, {useState, useEffect} from 'react';
import thunk from 'redux-thunk';
import { View, Text } from 'react-native';

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};


const store = createStore(counter,  applyMiddleware(thunk));

function increment() {
  console.log('increment');
  return {
    type: 'INCREMENT',
  };
}

function incrementAsync() {
  console.log('incrementAsync');
  return (dispatch) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment());
    }, 1000);
  };
}

const LoginScreen = () => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    incrementAsync()(store.dispatch);

    const unsubscribe = store.subscribe(() => {
      const v = store.getState();
      console.log('LoginScreen -> v', v)
      setValue(v);
    })
    return () => unsubscribe();
  }, [])
  return (
    <View style={{flex: 1}}>
      <Text>{String(value)}</Text>
     
    </View>
  );
};
```

thunk 的 middleware 會多包覆一層 傳送 `dipspatch`

所以在執行 `Action` 的當下 `Reducer` 不會收到通知

而是在在中間曾發送 `Action` 

來達到通知 `Reducer` 修改 Store 的效果

另外也可以做一些變形

讓這一層可以統一執行

[範例](https://github.com/horsekitlin/react-redux-isomorphic-example/tree/master/common)

在 `middleware` 中有一個 promiseMiddleware.js 專門處理非同步事件

讓 `Action` 可以很單純的回傳一個物件

覺的是一種不錯的作法

# Saga

## Saga Pattern

Saga Pattern 並不是 Redux 產生的

各個程式語言都可以去實做這個 Pattern

這個 Pattern 想解決的是 **LLT (Long Live Transaction)** 的問題

尚未解決的是當產生了一個 **Transaction**  的同時也應該會產出一個 **Compensation**

在 `Redux Saga` 使用的2是 Generator Function  而不是 Async/ Await Function

所以要先了解這兩個的差異性

[Async/Await And Gernerator](https://segmentfault.com/a/1190000021715315)

## Redux Saga

### 如何透過 Generator 管理任務

一個一般的 function 依序列出 `step1` `step2` `step3`

```javascript
function work() {
  console.log('step1');
  console.log('step2');
  console.log('step3');
}

work(); 
```

但是如果是要用 Generator Function 來實做的話 

```javascript
function* generatorWork() {
  yield console.log('step1');
  yield console.log('step2');
  yield console.log('step3');
}

const work = generatorWork();
work.next(); //step1
work.next();//step2
work.next();//step3
```

當每次呼叫 `next` 會回傳一個 `{done: false, value: 'step1'}` 的物件

done 是一個 Boolean

代表是否完成

### Generator Runner

```javascript
import axios from "axios";

function runner(genFn) {
  const itr = genFn();

  function next(arg) {
    let result = itr.next(arg);

    if (result.done) {
      return arg;
    } else {
      return Promise.resolve(result.value).then(next);
    }
  }

  return next();
}

function* genFn() {
  const USER_URI = "https://reqres.in/api/users";
  let res = yield axios.get(USER_URI);
  const userId = res.data.data[0].id;
  yield axios.get(`${USER_URI}/${userId}`);
}

const result = runner(genFn);
Promise.resolve(result).then(res => console.log(res.data));
```

Redux-Saga 是這樣來管理每一個任務

它可以執行的對象相當豐富

* effect
* iterator
* promise
* 一般的程式碼

#### Producer And Consumer

Redux-saga 其實背後的原理是 Producer 和 Consumer

![image](https://miro.medium.com/max/662/1*9cu0wOzQhHoDitvhJgwA3A.png)

但是不知道是歷史因素還是什麼原因

![image](https://miro.medium.com/max/700/1*MUKooVFAF6yreBMF8ivbcA.png)

如果你閱讀 redux-saga 的原始碼

你會看到 channel 是用來管理非同步任務的緩衝區 (Buffer)

裡面提供了 produce 與 consume 的函式

* channel.take()
  - 生產者 (Producer): 把任務放到 channel 中
* channel.put()
  - 消費者 (Consumer): 呼叫了 store.dispatch() 後執行的函式，會從 channel 中選擇符合 pattern 的任務執行

  **WTF**

`take`建立一個 Effect 描述
  
指示 middleware 在 Store 等待指定的 action
  
Generator 會暫停
  
直到一個符合 pattern 的 action 被 dispatch

簡單來說 `take` 是用來註冊處理非同步的函式
  
`take` 會 將處理非同步的函式所生成的 iterator 用 generator runner 包裝起來
  
最後呼叫 channel.take(cb) 
  
以 callback 的形式儲存在 channel 中

在 redux-saga 的實作中
  
被儲存在 channel 中的 callback 稱作 `taker`

這些原理講得有點抽象

下個章節來看一下 `Redux-saga` 的 Source code 吧
