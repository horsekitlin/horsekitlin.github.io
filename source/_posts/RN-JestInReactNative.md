---
title: RN-JestInReactNative
author: TomasLin
tags:
  - React Native
  - Javascript
  - React
date: 2019-01-08
categories:
  - React Native
---

# Initial project

我又重新來接觸一次 React Native

但是修改的部分太多了

重新做了一次部署架構

發現又多了一些問題

紀錄一下過程

一開始一定是先 initial project `helloworld`

```
  $ react-native init helloworld
  $ yarn test
  > helloword@0.0.1 test /Users/linweiqin/Projects/helloword
  > jest

  No tests found
  In /Users/linweiqin/Projects/helloword
    645 files checked.
    testMatch: **/__tests__/**/*.js?(x),**/?(*.)+(spec|test).js?(x) - 1 match
    testPathIgnorePatterns: /node_modules/ - 7 matches
  Pattern:  - 0 matches
  npm ERR! Test failed.  See above for more details.
```

因為我是使用 `redux-saga`

所以建一個測試

__tests__/saga.test.js

```js
import { testSaga } from 'redux-saga-test-plan';
import { take, put, call} from "redux-saga/effects";

function identity(value) {
  return value;
}

function* mainSaga(x, y) {
  const action = yield take('HELLO');

  yield put({ type: 'ADD', payload: x + y });
  yield call(identity, action);
}

const action = { type: 'TEST' };

it('works with unit tests', () => {
  testSaga(mainSaga, 40, 2)
    // advance saga with `next()`
    .next()

    // assert that the saga yields `take` with `'HELLO'` as type
    .take('HELLO')

    // pass back in a value to a saga after it yields
    .next(action)

    // assert that the saga yields `put` with the expected action
    .put({ type: 'ADD', payload: 42 })

    .next()

    // assert that the saga yields a `call` to `identity` with
    // the `action` argument
    .call(identity, action)

    .next()

    // assert that the saga is finished
    .isDone();
});
```

```
  $ yarn add redux-saga
  $ yarn add -D redux-saga-test-plan
  $ yarn test
```

![error1]('../images/rnjest/syntax_error.png')

在 `package.json` 要加上一個設定

```json
{
  ...,
  "jest": {
    "preset": "react-native",
    "transform": {
      "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js"
    }
  }
}
```

基本上這樣可以測試一般的

但是希望可以測試 Component

App.test.js

```js
// __tests__/App.test.js
import React from 'react';
import App from '../App';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

# React 與 React Native

如果使用同一個架構的話 `React` 與 `React Native` 是大同小異的

但是基於兩個的底層是完全不同的

一個是 `Web HTML` 一個是 `Native code`

希望使用盡量一致的 Lib 來做測試似乎困難度有點高

雖然尚未有完全無違和的測試

還是可以利用 `Jest` + `Enzyme` + `Jsdom` 來為 React Native 模擬 mount 環境

續前章 [初步使用 Jest + Enzyme 做 React Native 測試](./RN-JestErrorWithRNRouterFlux.md)

如果要在 測試中使用 `mount` 的話

會顯示 `document is undefined` 的錯誤

所以為了彌補這個問題

我們需要做一些補充

# shallow and mount 的不同

## shallow

`shallow` 針對 Component 做單一的單元測試，並不會直接顯示他的 `Children Component`

## mount

`mount` 會完整的 render 所有的 `Component` 包含他下層的所有 `Component`

```js
  import React from 'react';
  import App from '../App';
  import { mount, shallow } from 'enzyme';

  import renderer from 'react-test-renderer';

  test('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('mount component', () => {
    const wrapper = shallow(<App />);
    
  });
```

![mount error]('../images/rnjest/mount_error.png')

會產生這個錯誤

因為找不到 global document

```
  $ yarn add enzyme jest-enzyme enzyme-adapter-react-16 enzyme-react-16-adapter-setup --dev
```

需要再 `package.json` 中增加

```json
{
  ...,
  "jest": {
    "preset": "react-native",
    "setupTestFrameworkScriptFile": "./node_modules/jest-enzyme/lib/index.js",
    "setupFiles": [
      "enzyme-react-16-adapter-setup"
    ],
    "transform": {
      "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js"
    }
  }
}
```

![dom error]('../images/rnjest/dom_error.png')

缺少了 `react-dom`

```
  $ yarn add react-dom --dev
```

這時候就可以執行了

但是因為 `shallow` 只能 render 一層

如果要完整 render 的話要使用 `mount`

但是這樣會造成因為找不到 global document

要先增加 `setupFile.js`

```
  $ yarn add jsdom enzyme-adapter-react-16 react-native-mock-render --dev
```

```js
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM();
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

// Ignore React Web errors when using React Native
console.error = (message) => {
  return message;
};

require('react-native-mock-render/mock');
```

```
  $ yarn remove enzyme-react-16-adapter-setup
```

package.json 也要做一些調整

```json
{
  ...,
  "jest": {
    "preset": "react-native",
    "cacheDirectory": "./cache",
    "coveragePathIgnorePatterns": [
      "./app/utils/vendor"
    ],
    "coverageThreshold": {
      "global": {
        "statements": 80
      }
    },
    "transformIgnorePatterns": [
      "/node_modules/(?!react-native|react-clone-referenced-element|react-navigation)"
    ],
    "transform": {
      "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js"
    },
    "setupTestFrameworkScriptFile": "./setupFile.js"
  }
}
```

![test success]('../images/rnjest/test_success.png')
