---
title: React Native import Image Error
author: TomasLin
tags:
  - React Native
  - Javascript
  - React
date: 2018-01-05
categories:
  - React Native
---

React Native version: 0.51.0

React version: 16.0.0

# Initial React Native Project

```
  $ react-native init myapp
  $ cd myapp
  $ jest
```

![Step1](../../../../images/RNJestError/step1.png)

安裝 `react-native-router-flux` 和 `styled-components`

```
  $ npm install styled-components react-native-router-flux
```

建立資料夾 和 檔案

```
  $ mkdir -p src ./src/components
  $ cd src/components && touch Home.js Counter.js && cd -
```

./src/components/Home.js

```javascript
import React, { Component } from "react";
import styled from "styled-components/native";
import { Text, View } from "react-native";
import { Actions } from "react-native-router-flux";

const Container = styled.View`
  width: 100%;
  height: 100%;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ContentText = styled.Text`
  font-size: 20;
  font-weight: 400;
`;

export default class Counter extends Component {
  render() {
    return (
      <Container>
        <ContentText>
          <Text onPress={Actions.counter}>Navigator to Counter</Text>
        </ContentText>
      </Container>
    );
  }
}

```

./src/components/Counter.js

```javascript
import React, { Component } from "react";
import styled from "styled-components/native";
import { Text, View, Button } from "react-native";
import { Actions } from "react-native-router-flux";

const Container = styled.View`
  width: 100%;
  height: 100%;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Row = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentText = styled.Text`
  font-size: 20;
  font-weight: 400;
`;

const CounterText = styled.Text`
  font-size: 16;
  font-weight: 400;
`;

export default class Counter extends Component {
  state = {
    count: 0
  };

  render() {
    return (
      <Container>
        <Row>
          <ContentText>Counter</ContentText>
          <CounterText>{this.state.count}</CounterText>
          <Button
            onPress={() => this.setState({ count: this.state.count + 1 })}
            title="+"
          />
          <Button
            onPress={() => this.setState({ count: this.state.count - 1 })}
            title="-"
          />
          <ContentText onPress={Actions.pop}>Back</ContentText>
        </Row>
      </Container>
    );
  }
}
```

./App.js

```javascript
import React, { Component } from "react";
import { Router, Scene } from "react-native-router-flux";
import Home from "./src/components/Home";
import Counter from "./src/components/Counter";

export default class App extends Component<{}> {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene path="home" key="home" component={Home} />
          <Scene path="counter" key="counter" component={Counter} />
        </Scene>
      </Router>
    );
  }
}
```

```
  $ npm run run-ios //ok
  $ npm run test // Error
```

<p style="color: red;">
import type {
    ^^^^^^<br/>
    SyntaxError: Unexpected token import
<p>

在package.json 中增加 `transform`

package.json

```json
{
  ...
"jest": {
    "preset": "react-native",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    }
  }
}
```

在重新執行測試的時候會產生另一個錯誤

<p style="color: red;">
({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){�PNG
...
<p>

因為這是在 `react-native-router-flux` 中的 Navbar 中的 png 在編譯的時候產生的錯誤

[解法](https://github.com/facebook/jest/issues/2663)

```
  $ npm install --save-dev identity-obj-proxy
```

package.json

```json
{
  ...
  "jest": {
    "preset": "react-native",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
      "!node_modules/react-runtime"
    ],
    "moduleNameMapper": {
      ".+\\.(png|jpg|ttf|woff|woff2)$": "identity-obj-proxy"
    }
  }
}
```

