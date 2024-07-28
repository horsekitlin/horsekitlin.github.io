---
title: Reason Create NPM Package Part-I
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
categories:
  - Reason
date: 2018-11-02
---

# 使用 semver

和之前一樣先寫一個 javascript 的版本

```javascript
const semver = require('semver');

semver.valid('1.2.3');

semver.valid('a.b.c');

semver.clean('  =v1.2.3   ');

semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3');
```

如果要在 Reason 中使用 `semver` 的話

如何寫一個 `interface` 

```reason
[@bs.module "semver"] [@bs.val] 
external clean: string => Js.nullable(string) = "clean";

let clean = a => clean(a) |> Js.Nullable.toOption;
```

之前其實就有聊過這部分

`Js.nullable(string)` 也一種寫法代表是 Javascript 帶過來的值

意思是 `string` 但是也有可能是 `null` 得值

## Jext test

寫完之後來驗證一下你的型態

所以需要安裝一下 [bs-jest](https://github.com/glennsl/bs-jest)

```
  $ npm install --save-dev @glennsl/bs-jest
```

建立一個 `__tests__/semver_spec.re`

`bsconfig.json` 也要做一些調整

```json
// This is the configuration file used by BuckleScript's build system bsb. Its documentation lives here: http://bucklescript.github.io/bucklescript/docson/#build-schema.json
// BuckleScript comes with its own parser for bsconfig.json, which is normal JSON, with the extra support of comments and trailing commas.
{
  "name": "package-name",
  "version": "0.1.0",
  "sources": [
    {
      "dir" : "src",
      "subdirs" : true
    },
    {
      "dir": "__tests__",
      "type": "dev"
    }
  ],
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dev-dependencies": [
    "@glennsl/bs-jest"
  ],
  "warnings": {
    "error" : "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

主要是要加上 `sources` 和 `bs-dev-dependencies`

先寫個簡單的測試

```reason
open Jest;

describe("Expect", () => {
  open Expect;
  test("toBe", () => 
    expect(1 + 2) |> toBe(3)
  );
});

describe("Expect.Operators", () => {
  open Expect;
  open! Expect.Operators;
  test("==", () => expect(1+2) === 3);
});
```

可以看到上例

也可以測試從外部引入的套件

```reason
open Jest;

let () = describe("semver",
  ExpectJs.(() => {
      test("#clean", () =>
        expect(Semver.clean("    =1.5.0    ")
          |> (result => switch (result) {
              | Some(v) => v
              | None => raise(Not_found)
              }
          ),
        )
        |> toBe("1.5.0")
      );
    }
  ),
);
```

[更多範例](https://github.com/glennsl/bs-jest/tree/master/__tests__)

在 `package.json` 中加入 `files`

```json
"files": [   
  "src/semver.re", 
  "bsconfig.json"
 ]
```

可以讓 `NPM` 知道需要哪些檔案

也必須讓 `NPM` 知道這個套件和 `servem` 有依賴關係

```json
"peerDependencies": {"semver": "^5.5.0"},
```

## 開始寫綁定檔案

*src/semver.re*

```reason
[@bs.module "semver"] [@bs.val]
external clean: string => Js.nullable(string) = "";
let clean = a => clean(a) |> Js.Nullable.toOption;
```

簡單吧！

可以自己再補齊其他的 [API](https://github.com/npm/node-semver)

## Enums of String

`semver.cmp` 需要丟入三個參數

先寫一個簡單的版本

```reason
[@bs.module "semver"] [@bs.val]
external cmp: (string, string, string) => bool = "";
```

但是第二個參數因為是 `operations` 所以只能允許 `>`, `<`, `>=`, `<=`, `==`, `!==` 這類的字串

如果想要更精確的描述的話

我們需要對第二個參數做更完整的定義

在 Javascript 中會是

```javascript
Semver.cmp("1.5.0", "<", "2.3.5");
```

所以需要針對這個變數宣告一個類型

```reason

type comparator = 
  | LooseEqual
  | LooseNotEqual
  | Equal
  | Empty
  | NotEqual
  | Gt
  | Gte
  | Lt
  | Lte;

let comparatorToString = comparator: string =>
  switch (comparator) {
  | LooseEqual => "=="
  | LooseNotEqual => "!=="
  | Equal => "==="
  | Empty => ""
  | NotEqual => "!=="
  | Gt => ">"
  | Gte => ">="
  | Lt => "<"
  | Lte => "<="
  };

[@bs.module "semver"] [@bs.val]
external cmp: (string, string, string) => bool = "";

let cmp = (a: string, c: comparator, b: string) =>
  cmp(a, c |> comparatorToString, b);
```

可以看到我們宣告了一個類型給第二個參數

再藉由 Fast Pipe 輸入參數時做檢查

達到 `Enums` 的需求