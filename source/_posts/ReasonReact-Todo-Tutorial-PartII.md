---
title: ReasonReact-Todo-Tutorial-PartIII
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

# Rendering items

希望有一個區塊 Component 來顯示輸入的 `items`

```reason
type item = {
  title: string,
  completed: bool
};

module TodoItem = {
  let component = ReasonReact.statelessComponent("TodoItem");
  let make = (~item, _children) => {
    ...component,
    render: (_self) =>
      <div className="item">
        <input
          _type="checkbox"
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
          ReasonReact.array(Array.of_list(
              List.map((item) => <TodoItem item />, self.state.items)
          ))
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

我們又增加了一些東西

和一般的 JSX 有一點不一樣 `<TodoItem item />`

他原本也是 `<TodoItem item=item />` 的簡寫

JSX 中則會被解釋為 `<TodoItem item={true} />`

```reason
ReasonReact.array(Array.of_list(
    List.map((item) => <TodoItem item />, self.state.items)
))
```

可以看到這個寫法

但是其實也可以改成

```reason
self.state.items |> List.map((item) => <TodoItem item />) |> Array.of_list |> ReasonReact.array
```

