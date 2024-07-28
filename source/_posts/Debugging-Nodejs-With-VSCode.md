---
title: Debugging-Nodejs-With-VSCode
author: TomasLin
date: 2017-06-09
categories:
  - Javascript
tags:
  - Nodejs
  - VSCode
---

# 環境

* Nodejs - 7.9.10
* VSCode - 1.12.2

# Download VSCode

[vscode](https://www.google.com.tw/search?q=vscode+downlload&oq=vscode+downlload&aqs=chrome..69i57.2744j0j4&sourceid=chrome&ie=UTF-8)

![Image](../../../../images/vscode/bug.png)

點擊這個 Icon 後再點擊齒輪會自動產生 **launch.json**

# launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "protocol": "inspector",
      "program": "${workspaceRoot}/index.js",
      "cwd": "${workspaceRoot}",
      "runtimeArgs": [
        "--nolazy",
        "--inspect-brk"
      ],
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

* console - 在Terminal 中啟動程式
* env - 設定動態變數，可以傳入程式中使用
* runtimeArgs - 動態參數
* program - 啟動程式路徑
* protocol - npm 8 有兩種不同的protocol ,  預設是 legacy

檢查launch.json

![debug](../../../../images/vscode/debugcheck.png)

開始 debug 後上方會多一條控制 bar

![debug](../../../../images/vscode/debugrun.png)

使用 postman 發送 Request

![debug](../../../../images/vscode/postman.png)

因為我有 console.log 所以在 Debug Console 中會把 login 顯示出來

![debug](../../../../images/vscode/response.png)
