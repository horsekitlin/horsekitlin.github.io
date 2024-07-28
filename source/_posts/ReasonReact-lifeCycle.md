---
title: ReasonReact-LifeCycle
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
date: 2018-11-13
---

# LifeCycle

ReasonReact 也有類似 ReactJS 的生命週期

* didMount: self => unit

* willReceiveProps: self => state

* shouldUpdate: oldAndNewSelf => bool

* willUpdate: oldAndNewSelf => unit

* didUpdate: oldAndNewSelf => unit

* willUnmount: self => unit

**Note**

* 移除了所有 `component` 前綴
* `willReceiveProps` 需要回傳的是 state 預設是假設你每次都要修改狀態，不然也可以直接回傳 `state`
* `didUpdate`, `willUnmount` 和 `willUpdate` 不可以修改 `state`
* 不支援 `willMount` 請用 `didMount`
* `didUpdate`, `willUpdate` 和 `shouldUpdate` 的 input 是 **`oldAndNewSelf record`**, 類型是 `{oldSelf: self, newSelf: self}` 

如果你真的在 lifecycle 中修改 `state`, 請發一個 Action `self.send(DidMountUpdate)`

## retainedProps

ReactJS 中有時會使用到 `prevProps(componentDidUpdate) ` 或是 `nextProps(componentWillUpdate)` 這類的 API

但是 ReasonReact 中沒有這個部分, 則是要使用 `retainedProps` 來實現

```reason
type item = {
  title: string,
  completed: bool
};

type retainedProps = {message: string};

module TodoItem = {
  let component = ReasonReact.statelessComponentWithRetainedProps("TodoItem");
  let make = (~item, ~message, _children) => {
    ...component,
    retainedProps: {message: message},
    didUpdate: ({oldSelf, newSelf}) => {
      if (oldSelf.retainedProps.message !== newSelf.retainedProps.message) {
        Js.log("props `message` changed!")
      }
    },
    render: (_self) =>
      <div className="item">
        <input
          checked=(item.completed)
          /* TODO make interactive */
        />
        (ReasonReact.string(item.title))
      </div>
  };
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
      <div className="items">
        (
          self.state.items 
            |> List.map((item) => <TodoItem item />)
            |> Array.of_list
            |> ReasonReact.array
        )
      </div>
      <div className="items"> (ReasonReact.string("Nothing")) </div>
      <div className="footer">
        (ReasonReact.string(string_of_int(numItems) ++ " items"))
      </div>
    </div>
  }
};
```

ReasonReact 提供了 `ReasonReact.statelessComponentWithRetainedProps` 和 `ReasonReact.reducerComponentWithRetainedProps`

這兩個方法只是讓你的 `make` 函數中可以多一個 `retainedProps`

## willReceiveProps

```reason
type item = {
  title: string,
  completed: bool
};

type retainedProps = {message: string};

module TodoItem = {
  let component = ReasonReact.statelessComponentWithRetainedProps("TodoItem");
  let make = (~item, ~message, _children) => {
    ...component,
    retainedProps: {message: message},
    willReceiveProps: (self) => {
      if (self.retainedProps.message === message) {
        Js.log("willReceiveProps");
      };
    },
    didUpdate: ({oldSelf, newSelf}) => {
      if (oldSelf.retainedProps.message !== newSelf.retainedProps.message) {
        Js.log("props `message` changed!")
      }
    },
    render: (_self) =>
      <div className="item">
        <input
          checked=(item.completed)
          /* TODO make interactive */
        />
        (ReasonReact.string(item.title))
      </div>
  };
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
      <div className="items">
        (
          self.state.items 
            |> List.map((item) => <TodoItem item />)
            |> Array.of_list
            |> ReasonReact.array
        )
      </div>
      <div className="items"> (ReasonReact.string("Nothing")) </div>
      <div className="footer">
        (ReasonReact.string(string_of_int(numItems) ++ " items"))
      </div>
    </div>
  }
};
```

ReactJS 的 `componentWillUpdate` 中的參數 `nextProps` 是 `make` 的參數

而現在的 `props (this.props)` 是上面的 `retainedProps，可以透過` `{oldSelf}` 得到

## didUpdate
ReactJS 的 prevProps 可以透過 `retainedProps` 拿到，需要使用 `oldSelf`

## shouldUpdate
和 ReactJS 的 `shouldComponentUpdate` 對應