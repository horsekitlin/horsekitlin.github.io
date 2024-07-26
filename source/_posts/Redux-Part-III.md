---
title: Redux-Part-III
author: TomasLin
tags:
  - React
  - Redux 
date: 2020-09-18
categories:
  - React
---

# 前情提要

角色

* 生產者 - 產出任務 `store.dispatch`
* 消費者 - 消費任務 `saga function`
* channel - 暫存任務的地方

# Redux-Saga 的組成

* createMiddleware
* effects
* Channel

## createMiddleware

基於 redux 所以要建立一個 `sagaMiddleware`

[createMiddleware](https://github.com/redux-saga/redux-saga/blob/master/packages/core/src/internal/middleware.js)

會回傳一個 `sagaMiddleware`

### sagaMiddleware

在 `sagaMiddleware` 有一個 `run` 的參數

他是之前說過的 Generator Runner 

[sagaRunner](https://github.com/redux-saga/redux-saga/blob/master/packages/core/src/internal/runSaga.js)

在這個 `Function` 中 會利用 `saga` 產生 iterator

#### Channel

之前在生產者產生 task 之後需要有一個 channel 來暫存

這就是暫存的地方

預設會有一個 channel(之後有機會再說)

自己產生的話就可以用 `actionChannel` 

#### watcher.js

```javascript
import types from "../constants/actionTypes";
import { take, call, takeLatest, actionChannel } from 'redux-saga/effects';
import { loginSaga, logoutSaga } from './authSaga';

export function* watchLogin() {
  yield takeLatest(types.LOGIN, loginSaga);
}

export function* watchLogout() {
  yield takeLatest(types.LOGOUT, logoutSaga);
}
```

一般需要使用動併發的時候可以這樣處理

但是因為使用的是 `takeLatest`

所以當有重複的 `Action` 的時候

他會取消上一個 `Action`

但是如果我們希望可以一個一個處理

所有還沒處理到的 `Action` 先暫存一個地方

希望能有一個 `queue` 的機制

這時候可以利用 `actionChannel` 

#### new watcher.js

```javascript
import types from "../constants/actionTypes";
import { take, call, takeLatest, actionChannel } from 'redux-saga/effects';
import { loginSaga, logoutSaga } from './authSaga';

export function* watchLogin() {
  const requestChan = yield actionChannel(types.LOGIN);
  while(true) {
    const actionObject = yield take(requestChan);
    yield call(loginSaga, actionObject);
  }
}

export function* watchLogout() {
  yield takeLatest(types.LOGOUT, logoutSaga);
}
```

上述的是利用 channel 暫存 `task`

由於使用 `call` 來做強制執行完之後

再由 `while(true)` 會重複執行下一個新的 `task`

### Container

```javascript
import types from '~/constants/actionTypes';
import { connect } from 'react-redux';
import LoginScreen from './view';

const loginAction = payload => ({
  type: types.LOGIN,
  payload
});

const mapStateToProps = ({ auth }) => ({
  auth
});

const mapDispatchToProps = dispatch => ({
  handleLogin: payload => {
    dispatch(loginAction(payload))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
```

在 container 有描述 `dispatch` 產生新的 `task`

再由 `saga` 進行消費

# 參考資料

[createMiddleware](https://github.com/redux-saga/redux-saga/blob/master/packages/core/src/internal/middleware.js)

[Recipes](https://redux-saga.js.org/docs/recipes/)

[RNSkelton](https://github.com/horsekitlin/RNSkelton)
