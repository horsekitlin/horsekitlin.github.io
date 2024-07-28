---
title: ReasonReact-Todo-Tutorial-PartII
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

# Action

昨天進度到了完成了一個 `Reducer`

但是我們知道要修改 `Reducer` 只能夠透過 `Action`

而在 ReasonReact 如何描述一個 `Action`？

```reason
type action = 
  | AddItem;

type item = {
  title: string,
  completed: bool
};

type state = {
  items: list(item)
}

let newItem = () => {title: "Click a button", completed: true};

let component = ReasonReact.reducerComponent("TodoApp");

let make = (_children) => {
  ...component,
  reducer: ((), _) => ReasonReact.NoUpdate,
  render: ({state: {items}}) => {
    let numItems = List.length(items);
    <div className="app">
      <div className="title">
        (str("What to do"))
        <button
          onClick=((evt) => AddItem)
        >
          (ReasonReact.string("Add something"))
        </button>
      </div>
      <div className="items"> (ReasonReact.string("Nothing")) </div>
      <div className="footer">
        (ReasonReact.string(string_of_int(numItems) ++ " items"))
      </div>
    </div>
  }
}
```

先幫昨天的範例加上一個 `button` 有一個 Event `onClick`

點擊後會 Js.log("didn't add something")

如果在 `React` 中這邊應該是要呼叫 `this.setState`

但是在 ReasonReact 中這需要兩個步驟

1. 建立一個 Action Type
2. 然後建立一個 Reducer 並且和 Action Type mapping

# Reducer And Action

*Demo*
```reason
type item = {
  title: string,
  completed: bool
};

type state = {items: list(item)};

type action =
  | AddItem;

let component = ReasonReact.reducerComponent("TodoApp");

let newItem = () => {title: "Click a button", completed: true};

let make = (_children) => {
  ...component,
  initialState: () => {
    items: [
      {title: "Write some things to do", completed: false}
    ]
  },
  reducer: (action, {items}) =>
    switch action {
    | AddItem => ReasonReact.Update({items: [newItem(), ...items]})
    },
  render: (self) => {
    let numItems = List.length(self.state.items);
    <div className="app">
      <div className="title">
        (ReasonReact.string("What to do"))
        <button onClick=(_event => self.send(AddItem))>
          (ReasonReact.string("Add something"))
        </button>
      </div>
      <div className="items"> (ReasonReact.string("Nothing")) </div>
      <div className="footer">
        (ReasonReact.string(string_of_int(numItems) ++ " items"))
      </div>
    </div>
  }
};
```

## initialState

React 稱為 `getInitialState` 在 Reason 中稱為 `initialState`

不需傳入參數，會回傳一個 `state` 類型

`state` 可以是任何類型 string, int, record ...etc

# Actions and Reducer

在 React 中你會透過 callback handler 來修改 state

```javascript
{
  /* ... other fields */
  handleClick: function() {
    this.setState({count: this.state.count + 1});
  },
  handleSubmit: function() {
    this.setState(...);
  },
  render: function() {
    return (
      <MyForm
        onClick={this.handleClick}
        onSubmit={this.handleSubmit} />
    );
  }
}
```

在 ReasonReact 你會將所有的 Function 整理在同一個地方

如果你看到 `self.reduce` 這是舊的 API

新的 API 是 `self.send`

* `action` 是使用者定義的類型，他是一個 `variant` 類型，描述了所有可能的 state 類型
* Component 的 state 可以透過 `self.state` 拿到
* 只有一個 reducer 是 [pattern-matches](https://reasonml.github.io/docs/en/pattern-matching.html) 會針對有可能的 action 去修改 reducer 得值
* 在 reducer 中 `self.handler` 不允許狀態的改變，你必須使用 self.send 發送一個 action

例如我們點擊了一個按鈕

會發送一個 `Click` 的 action

他會依據 `Click` 的這事件回傳一個新的 state

# 用 Reducer 更新狀態

`ReasonReact.Update` 回傳一個新的 state

另外也有一些其他選擇

* ReasonReact.NoUpdate - 不要更新 state
* ReasonReact.Update - 更新 state
* ReasonREact.SideEffects(self => unit) 不需要更新 state 但是需要但是需要觸發行為 e.g.`ReasonReact.SideEffects(_self => Js.log("hello!"))`
* ReasonReact.UpdateWithSideEffects(state, self => unit): 更新狀態並且觸發行為

# 重要提示

* action 可以帶入參數 `payload`: `onClick=(data => self.send(Click(data.foo)))`
* 不要把事件本身傳遞給 action
* `reducer` 必須是 pure function, 用 SideEffects 或者 UpdateWithSideEffects 增加一個 side-effect, 這個 side-effect 會在 state 處理完之後, 下一次 render 前進行
* `ReactEvent.BlablaEvent.preventDefault(event)` 請在  `self.send` 中處理它
* 可以自由的觸發另一個 action 在 sideeffect, e.g `UpdateWithSideEffects(newState, self => self.send(Click))`
* 如果你僅僅只有 state, 你的 Component 僅有 `self.handler`而沒有用到 `self.send` 但是依舊要指定 `reducer` `reducer: ((), _state) => ReasonReact.NoUpdate`

## Tip

盡量縮小你的 reducer 你可以更容易使用 `ReasonReact.SideEffects` 和 `ReasonReact.UpdateWithSideEffects` 來更新 reducer

## Async State updated

在 ReactJs 中你可能會這樣使用 setState

```javascript
setInterval(() => this.setState(...), 1000);
```

但是在 ReasonReact 中會是

```reason
Js.Global.setInterval(() => self.send(Tick), 1000)
```
