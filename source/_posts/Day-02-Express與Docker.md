---
title: Day-02-Express與Docker
author: TomasLin
tags:
  - DevOps
  - IThome2023
  - Docker
  - Kubernetes
date: 2023-09-15
categories:
  - IThome2023鐵人賽
---

# Express Hello world

[Express 4.x](https://expressjs.com/)

```
  $ express --no-view helloworlddemo
  $ cd helloworlddemo
  $ npm install
  $ npm start
```

## 檔案結構

```
.
├── app.js
├── bin
│   └── www
├── package-lock.json
├── package.json
├── public
│   ├── images
│   ├── index.html
│   ├── javascripts
│   └── stylesheets
│       └── style.css
└── routes
    ├── index.js
    └── users.js
```

以這個範例實作 `Dockerfile`

```Dockerfile
FROM node:18.0-slim
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]
```

**FROM**

宣告基本的 Docker Image 環境

[node:18.0-slim 詳情](https://hub.docker.com/layers/library/node/18-slim/images/sha256-ddb3a1b4a81ee454c147b0e9f87baa9eee8468c11ed5fca1c33204f73d48f1ef)

以 `Debian:11-slim` 為基礎 `Nodejs 版本` 為 `18` 的環境

**WORKDIR**

設定工作的資料夾位置

**COPY**

將檔案複製到 Docker Image 內的 `WORKDIR` 資料夾內

`COPY SOURCE TARGET`

*Note: COPY和ADD二個的功用都一樣，就是將檔案複製進去image裡，COPY只能複製本機端的檔案或目錄，ADD能增加遠端url的檔案到docker image，ADD能順手將本機端複製進去的tar檔解開(遠端的tar不行！)。在實例上並不建議使用ADD來抓取網路上的檔案，會使用RUN curl or wget的方式。原因是使用一次ADD指令會增加docker image layers一次，原則上layers越多，docker image size就會越大！*

**RUN**

建立image內部再跑的指令，是跑在Linux裡面的，跟ENTRYPOING與CMD最大的不同就是，他不是作為Image的「啟動指令」，而是作為image的「建造指令」

**EXPOSE**

很多人以為加上EXPOSE 3000，docker run起來後，就可以從本機端連得到container的 3000 port。

EXPOSE概念上比較像是在告訴使用這個image的人，服務是在那個port。

```
  $ docker pull nginx
  $ docker inspect nginx
  $ docker run -p 8888:3000 -d nginx
```

**CMD**

在 Container 運行的時候 執行此命令

*`Note`: ENTRYPOINT是Dockerfile 定義的一個指令，他的作用類似於CMD，都是在container 啟動時會自動執行的指令，你可以不定義CMD，然後改成定義ENTRYPOINT，你的container 照樣能夠啟動，如同你之前將命令寫在CMD 一樣*
