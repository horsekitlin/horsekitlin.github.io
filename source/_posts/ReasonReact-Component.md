---
title: ReasonReact-Component
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - React
categories:
  - Reason
date: 2018-11-04
---


# Component

## Creation

ReasonReact 不需要　`class` 來建立 Component

提供一個建立的 API 會回傳一個 record

他的欄位是可以覆寫的(就像 `render`, `initialState`, `didMount`... 之類的)

`ReasonReact.statelessComponent("TheComponentName")`

字串是為了提供 `Debuging` 他就像是 React 中的 `displayName`

例如要建立一個新的 `Greeting` 的 Component

```reason
let component = ReasonReact.statelessComponent("Greeting");

let make = (~name, _children) => {
  ...component,
  render: _self => <div>{ReasonReact.string(name)}</div>
};
```

make 會回傳一個 `Component record`

**Note: 不要直接使用 `ReasonReact.statelessComponent`直接在 make 中解構，範例如下**

```reason
let make = _children => {
  ...(ReasonReact.statelessComponent("Greeting")),
  render: self => blabla
}
```

**上述範例為錯誤示範，請勿使用**

# Props

`Props` 其實就是 make function 中的 `labeld arguments` 

也可以是有選擇性(optional)或有預設值(default value)

例如

```reason
let make = (~name, ~age=?, ~className="box", _children) => 
  <div>(ReasonReact.string(name))</div>
```

最後的一個參數必須是 `children` 但是如果沒有使用到的話

可以用 `_` 或是 `_children` 來做命名 compiler 會自動規避

`props` 的名字不能是 `ref` 或是 `key`

這部分和 ReactJs 一樣

上面的範例如果只傳入 `name`

`classname` 會是預設的 box

`age` 預設會是 None

有時候在 ReactJs 中會以傳入的值決定回傳的 Component

```reason
  <Foo name="Reason" age={this.props.age} />
```

如果這樣傳值的話有可能會有 bug

因為 `age` 有可能是 Null 的

所以可以透過 varian

```reason
switch (myAge) {
| None => <Foo name="Reason" />
| Some(nonOptionalAge) => <Foo name="Reason" age=nonOptionalAge />
}
```

這樣看起來有點繁雜

也可以這樣處理

```reason
  <Foo name="Reason" age=?myAge />
```

這並不是特殊的手法

詳情可以參照 [Reason doc](https://reasonml.github.io/docs/en/function.html#explicitly-passed-optional)

## self

你會在 `make` 中看到 `self` 他的角色就像是 Javascript 中的 `this`

它是一個 `record` 包含了 `state`, `handler`, `send`

也可以傳遞生命週期 API

# JSX

Reason 也可以接受 `JSX` 但是在 `bsconfig.json` 要給予設定資訊

`{"reason": {"react-jsx": 2}`

更詳細的 [schema](https://bucklescript.github.io/bucklescript/docson/#build-schema.json)

## Uncapitalized

```reason
<div foo={bar}> {child1} {child2} </div>
```

會編譯為

```reason
ReactDOMRe.createElement("div", ~props=ReactDOMRe.props(~foo=bar, ()), [|child1, child2|]);
```

Javascript 會編譯為

```javascript
React.createElement('div', {foo: bar}, child1, child2)
```

`prop-less` 範例

```reason
<div />
```

則會轉譯成

```reason
ReactDOMRe.createElement("div", [||]);
```

實際的 Javascript

```javascript
React.createElement('div', undefined);
```

**Note: `ReactDOMRe.createElement` 是內部轉譯 JSX 專用，也有提供逃生出口 `ReasonReact.createDomElement` 詳情閱讀 [children section](https://reasonml.github.io/reason-react/docs/en/children)**

## Capitalized

```reason
<MyReasonComponent key={a} ref={b} foo={bar} baz={qux}> {child1} {child2} </MyReasonComponent>
```

會轉譯為

```reason
ReasonReact.element(
  ~key=a,
  ~ref=b,
  MyReasonComponent.make(~foo=bar, ~baz=qux, [|child1, child2|])
);
```

`prop-less` `<MyReasonComponent />` 則會轉譯成

```reason
ReasonReact.element(MyReasonComponent.make([||]));
```

`MyReasonComponent.make` 中的 make 跟上一個部分講的 `make` 是一樣的

也要注意不要將 `ref` `key` 這類的保留自使用在 props

## Fragment

在 ReasonReact 中也允許使用 Fragment

他可以簡化 DOM 結構

```reason
<> child1 child2 </>;
```

將會轉意成為

```reason
ReactDOMRe.createElement(ReasonReact.fragment, [|child1, child2|]);
```

Javascript 則會

```javascript
React.createElement(React.Fragment, undefined, null);
```

## Children

ReasonReact 中的 children 是有完整的類型

你可以傳遞任何型態的值給它

```reason
<MyReasonComponent> <div /> <div /> </MyReasonComponent>

let let theChildren = [| <div />, <div /> |];
<MyReasonComponent> theChildren </MyReasonComponent>
```

上面兩個範例都會轉譯為

```reason
let theChildren = [| <div />, <div /> |];
ReasonReact.element(
  MyReasonComponent.make([|theChildren|])
);
```

Reason 中的 children 也可以使用 spread

```reason
let theChildren = [| <div />, <div /> |];
<MyReasonComponent> ...theChildren </MyReasonComponent>
```

詳情可以參閱 [children spread syntax](https://reasonml.github.io/docs/en/jsx.html#children-spread)

更詳細的 Children 後續會再做了解
