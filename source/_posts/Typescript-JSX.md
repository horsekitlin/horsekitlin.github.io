---
title: Typescript-JSX
author: TomasLin
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
date: 2017-11-07
---

# JSX

`JSX` 是一種類似 XML 的標記性語言，可以被轉換為合法的 Javascript 因為 `React` 的框架而開始流行，但是也可以，但是也可以使用在其他程式中

## 基本使用方式

在 `TypeScript` 使用 `JSX` 必須先做兩件事情

1. 副檔名為 `tsx`
2. 開啟 `jsx` 的功能

`TypeScript` 有三種 `JSX` 的模式， `preserve`, `react`, `react-native`

### preserve

會保留 `JSX` 提供後續轉換使用

### react

會生成 `React.createElement` 在使用前不需要再轉換

### react-native

相當於 `preserve` 但是輸出的檔案副檔名為 `.js`

可以在命令列中使用 `--jsx` 或是在 `tsconfig.json` 中指定模式

# as Oprator

寫一個 class

```typescript
const foo = <foo>bar;
```

因為 `JSX` 語法解析困難，所以在 `TypeScript` 禁止使用 `<>` 來宣告，所以在 `tsx` 中改為

```typescript
const foo = bar as foo;
```

`as` 在 `.ts` 或是 `.tsx` 中都可以使用

# Type Check

為了理解 `JSX` 如何檢查類型必須要先了解原生的元件根基於值得元件有什麼不同

假如有一個元件 `<expr />` 可能會引用 `div` 或是 `span` 這類的標籤

1. `React` HTML 標籤會自動生成 `React.createElement('div')` 但是自定義的元件部會生成 `React.createElement(MyComponent)`
2. 原本 HTML 就有的 `tag` 本身支援類型檢查，但是自定義的元件則需要自己定義類型檢查

`TypeScript` 使用和 `React` 相同的規範來做區別

### Intrinsic elements

`Intrinsic elements` 預設是 `JSX.IntrinsicElements` 做類型檢查，預設是 `any`

```typescript
decalre namespace JSX {
  interface IntrinsicElements {
        foo: any
    }
}

<foo /> // Success
<bar /> // Error
```

上面範例中 `foo` 可以執行，但是 `bar` 會報錯誤訊息，因為 `bar` 並沒有在 `JSX.IntrinsicElements` 內指定

也可以指定為所有

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
```

一般使用 `Component` 如範例

```typescript
import MyComponent from './MyComponent';
<MyComponent /> // Success
<OtherComponent /> // Error
```

#### Stateless Component (SFC)

範例

```typescript
interface FooProp{
  name: string,
  X: number,
  Y: number
}

declare function AnotherComponent(prop: {name: string});
function ComponentFoo(prop: FooProp) {
  return <AnotherComponent name=prop.name />;
}
const Button = (prop: {value: string}, context: { color: string }) => <button>
```

因為 `SFC` 是簡單的 Function 所以可以盡量的使用

#### Class Component

這裡需要先介紹兩個新的名詞 `the element class type` 和 `element instance type`

範例

```typescript
class MyComponent {
  render() {}
}

// use a construct signature
var myComponent = new MyComponent();

// element class type => MyComponent
// element instance type => { render: () => void }

function MyFactoryFunction() {
  return {
    render: () => {}
  };
}

// use a call signature
var myComponent = MyFactoryFunction();

// element class type => FactoryFunction
// element instance type => { render: () => void }
```

`element instance type` 很有趣，他必須要指定給 `JSX.ElementClass` 否則就會報錯

預設 `JSX.ElementClass` 是 `{}`

```typescript
declare namespace JSX {
  interface ElementClass {
    render: any;
  }
}

class MyComponent {
  render() {}
}
function MyFactoryFunction02() {
  return { render: () => {} };
}

<MyComponent />; // ok
<MyFactoryFunction />; // ok

class NotAValidComponent {}
function NotAValidFactoryFunction() {
  return {};
}

// <NotAValidComponent />; // error
// <NotAValidFactoryFunction />; // error
```
