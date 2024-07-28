---
title: ReasonReact-Todo-Tutorial-PartI
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - React
categories:
  - Reason
date: 2018-11-10
---


# 調整 initial 的 project

之前我們有用 `bsb` initial 了一個 `project`

但是要做一些小小的調整

先新增一個 `.re`

*TodoApp.re*
```reason
let component = ReasonReact.statelessComponent("TodoApp");

let make = (children) => {
  ...component,
  render: (self) =>
    <div className="app">
      <div className="title">
        (ReasonReact.string("What to do"))
      </div>
      <div className="items">
        (ReasonReact.string("Nothing"))
      </div>
    </div>
}
```

*index.re*
```reason
ReactDOMRe.renderToElementWithId(<TodoApp />, "root");
```

*index.html*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ReasonReact Examples</title>
</head>
<body>
  <div id="root"></div>
  <script src="Index.js"></script>
</body>
</html>
```

可以看到基本的顯示

![demo](../../../../images/todoApp/demo.png)

# STEP1 增加一些 State

## 宣告一些類型

```reason
type item = {
  title: string,
  completed: bool
};

type state = {
  items: array(item)
};

let component = ReasonReact.statelessComponent("TodoApp");

let make = (children) => {
  ...component,
  render: (_self) =>
    <div className="app">
      <div className="title">
        (ReasonReact.string("What to do"))
      </div>
      <div className="items">
        (ReasonReact.string("Nothing"))
      </div>
    </div>
}
```

## State

ReaconReact 的有狀態 Component 和 React 的有狀態 Component 是類似的

只是多了 `reducer` 的概念 (類似 [Redux](https://redux.js.org/))

只要把它當成狀態管理系統就好

將宣告 `statefulComponent` 取代 `statelessComponent`

使用 `ReasonReact.reducerComponent("MyComponentName")` 這個 API

### Stateful 範例

*index.re*
```reason
ReactDOMRe.renderToElementWithId(<StatefulComponent greeting="greeting" />, "root");
```

*StatefulComponent.re*
```reason
type state = {
  count: int,
  show: bool
};

type action = 
  | Click
  | Toggle;

let component = ReasonReact.reducerComponent("Example");

let make = (~greeting, _children) => {
  ...component,
  initialState: () => {count: 0, show: true},
  reducer: (action, state) =>
    switch (action) {
    | Click => ReasonReact.Update({...state, count: state.count + 1})
    | Toggle => ReasonReact.Update({...state, show: !state.show})
    },
  render: (self) => {
    let message = "You've clicked this " ++ string_of_int(self.state.count) ++ " times(s)";
    <div>
      <button onClick=(_event => self.send(Click))>
        (ReasonReact.string(message))
      </button>
      <button onClick=(_event => self.send(Toggle))>
        (ReasonReact.string("Toggle greeting"))
      </button>
      (
        self.state.show
          ? ReasonReact.string(greeting)
          : ReasonReact.null
      )
    </div>;
  }
};
```
