---
title: Moleculer-Start
author: TomasLin
tags:
  - Nodejs
  - Microservies
date: 2019-06-04
categories: Nodejs
---


# Usage

## Create your first microservice

**demo.js**
```js
const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker();

broker.createService({
    name: "math",
    actions: {
        add(ctx) {
            return Number(ctx.params.a) + Number(ctx.params.b);
        }
    }
});

broker.start()
    // Call service
    .then(() => broker.call("math.add", { a: 5, b: 3 }))
    .then(res => console.log("5 + 3 =", res))
    .catch(err => console.error(`Error occured! ${err.message}`));
```

```
[2019-06-03T07:54:26.366Z] INFO  ********/BROKER: Moleculer v0.13.9 is starting...
[2019-06-03T07:54:26.369Z] INFO  ********/BROKER: Node ID: ********
[2019-06-03T07:54:26.370Z] INFO  ********/BROKER: Namespace: <not defined>
[2019-06-03T07:54:26.370Z] INFO  ********/REGISTRY: Strategy: RoundRobinStrategy
[2019-06-03T07:54:26.372Z] INFO  ********/BROKER: Serializer: JSONSerializer
[2019-06-03T07:54:26.373Z] INFO  ********/BROKER: Registered 10 internal middleware(s).
[2019-06-03T07:54:26.390Z] INFO  ********/REGISTRY: '$node' service is registered.
[2019-06-03T07:54:26.392Z] INFO  ********/REGISTRY: 'math' service is registered.
[2019-06-03T07:54:26.394Z] INFO  ********/BROKER: ServiceBroker with 2 service(s) is started successfully.
5 + 3 = 8
[2019-06-03T07:54:26.400Z] INFO  ********/BROKER: ServiceBroker is stopped. Good bye.
```

看到上方範例會啟用一個 microservice 

計算出 5 + 3 = 8

之後結束這個程式

## Create a Moleculer project

### Install Nats

需要先安裝 Nats 

如果您是選擇其他的 `transporters` 也需要安裝其他的套件

目前有提供的

* Nats - 推薦使用
* MQTT
* Redis
* NATS streaming (試驗)
* Kafka (試驗)

#### Mac

```
  $ brew install gnatsd
```

#### Go
### Initial Project

有提供一個 [Cli tool](https://moleculer.services/docs/0.13/moleculer-cli.html)

install moleculer-cli

```
  $ npm i moleculer-cli -g
```

create a new project

```
  $ moleculer init project moleculer-demo
```

client 會提供幾個選項讓你選擇

```
? Add API Gateway (moleculer-web) service? // 是否使用 api gateway
? Would you like to communicate with other nodes? // 是否需要和其他 nodes 溝通
? Select a transporter NATS (recommended) // 使用哪一種 transporter 工具
? Would you like to use cache?  是否要使用 cache
? Select a cacher solution 
? Add Docker files? 是否要使用 Docker
? Use ESLint to lint your code? 是否使用 ESLint
? Setup unit tests with Jest? Unitest framework
Create 'moleculerdemo' folder...
? Would you like to run 'npm install'?
```

可以依據個人的需求選擇

然後就可以得到一個專案

```
.
├── README.md
├── moleculer.config.js
├── package-lock.json
├── package.json
├── public
│   ├── banner.png
│   ├── favicon.ico
│   └── index.html
├── services
│   ├── api.service.js
│   └── greeter.service.js
└── test
    └── unit
        └── greeter.spec.js
```

```
  $ yarn dev // 啟動一個 service
```

## Broker

`ServiceBroker` 是 `Moleculer` 中主要的 component 

他會處理幾件 `nodes` 之間溝通的事情

* actions
* emits
* events
* communicates

![Broker Options](https://moleculer.services/docs/0.13/broker.html#Broker-options)

### Ping

對遠端的 nodes 使用 `broker.ping` 來確認遠端 nodes 的狀態

回傳值是一個 `Promise`

#### Example

ping 一個 node 並設定 1S 的 timeout

```
broker.ping("node-123", 1000).then(res => broker.logger.info(res));
```

output
```
{ 
    nodeID: 'node-123', 
    elapsedTime: 16, 
    timeDiff: -3 
}
```

```
timeDiff 是兩個節點之間系統時間的誤差值
```

也可以同時 ping 多個 nodes

```
broker.ping(["node-100", "node-102"]).then(res => broker.logger.info(res));
```

output
```
{ 
    "node-100": { 
        nodeID: 'node-100', 
        elapsedTime: 10, 
        timeDiff: -2 
    },
    "node-102": { 
        nodeID: 'node-102', 
        elapsedTime: 250, 
        timeDiff: 850 
    } 
}
```

ping 所有的 nodes
```
broker.ping().then(res => broker.logger.info(res));
```

output
```

{ 
    "node-100": { 
        nodeID: 'node-100', 
        elapsedTime: 10, 
        timeDiff: -2 
    } ,
    "node-101": { 
        nodeID: 'node-101', 
        elapsedTime: 18, 
        timeDiff: 32 
    }, 
    "node-102": { 
        nodeID: 'node-102', 
        elapsedTime: 250, 
        timeDiff: 850 
    } 
}
```

[broker properties](https://moleculer.services/docs/0.13/broker.html#Properties)

[broker methods](https://moleculer.services/docs/0.13/broker.html#Methods)

## Services

`Services` 代表 `Moleculer` 中的微服務

可以定義多個 `action` 並且訂閱 'event'

建立新的 service 必須先定義好 `schema`

這些 schema 類似 [component of Vuejs](https://vuejs.org/v2/guide/components.html)

* name
* version
* settings
* methods
* events

### Actions

基本的 `schema`

```
{
    name: "posts",
    version: 1
}
```

定義多個 `actions`

```
{
    name: "math",
    actions: {
        add(ctx) {
            return Number(ctx.params.a) + Number(ctx.params.b);
        },

        sub(ctx) {
            return Number(ctx.params.a) - Number(ctx.params.b);
        }
    }
}
```

`name` 是必須要定義的參數

當你呼叫這個 `api` 時，是第一部分的 route 組成元素

```javascript
// 可以在設定中 disable service name prefix

{
  $noServiceNamePrefix: true
}
```

version 不是必要的參數

可以讓同樣的 `service` 跑不同的 version 做 api 版本控制

可以是 `Number` 和 `String`

```javascript
{
    name: "posts",
    version: 2,
    actions: {
        find() {...}
    }
}
```

在上方的範例中若是要呼叫這隻 API route 為 `GET /v2/posts/find`

### Settings

settings 是一個 store

你可以在裡面做各種設定

使用 `this.settings` 取得你的 setting object

[setting options](https://moleculer.services/docs/0.13/services.html#Internal-settings)

### Mixins

Mixins 是一個可以在 `Moleculer` 中可以重複使用的 function

Service 的 constructor 會自動合併這些 mixins

```
const ApiGwService = require("moleculer-web");

module.exports = {
    name: "api",
    mixins: [ApiGwService]
    settings: {
        // Change port setting
        port: 8080
    },
    actions: {
        myAction() {
            // Add a new action to apiGwService service
        }
    }
}
```

[合併的規則](https://moleculer.services/docs/0.13/services.html#Merge-algorithm)

### Lifecycle events

當 service 生命週期各自會 trigger 的 function

* startd
* stopped
* created

### Dependencies

當你的 service 有依賴到其他 service 的時候

可以利用 Dependencies 來做處理(待捕)

### Hot reloading services

在開發過程中需要使用 hot reloading 的機制有兩種方式

```javascript
const broker = new ServiceBroker({
    hotReload: true
});

broker.loadService("./services/test.service.js");
```

或是 command

```javascript
  $ moleculer-runner --hot ./services/test.service.js
```

### Local variables

如果你需要一些 Local variables

可以在 `created` 中宣告

```javascript
const http = require("http");

module.exports = {
    name: "www",

    settings: {
        port: 3000
    },

    created() {
        // Create HTTP server
        this.server = http.createServer(this.httpHandler);
    },

    started() {
        // Listening...
        this.server.listen(this.settings.port);
    },

    stopped() {
        // Stop server
        this.server.close();
    },

    methods() {
        // HTTP handler
        httpHandler(req, res) {
            res.end("Hello Moleculer!");
        }
    }
}
```

#### ES6 classses

```javascript
const Service = require("moleculer").Service;

class GreeterService extends Service {

    constructor(broker) {
        super(broker);

        this.parseServiceSchema({
            name: "greeter",
            version: "v2",
            meta: {
                scalable: true
            },
            dependencies: [
                "auth",
                "users"
            ],

            settings: {
                upperCase: true
            },
            actions: {
                hello: this.hello,
                welcome: {
                    cache: {
                        keys: ["name"]
                    },
                    params: {
                        name: "string"
                    },
                    handler: this.welcome
                }
            },
            events: {
                "user.created": this.userCreated
            },
            created: this.serviceCreated,
            started: this.serviceStarted,
            stopped: this.serviceStopped,
        });
    }

    // Action handler
    hello() {
        return "Hello Moleculer";
    }

    // Action handler
    welcome(ctx) {
        return this.sayWelcome(ctx.params.name);
    }

    // Private method
    sayWelcome(name) {
        this.logger.info("Say hello to", name);
        return `Welcome, ${this.settings.upperCase ? name.toUpperCase() : name}`;
    }

    // Event handler
    userCreated(user) {
        this.broker.call("mail.send", { user });
    }

    serviceCreated() {
        this.logger.info("ES6 Service created.");
    }

    serviceStarted() {
        this.logger.info("ES6 Service started.");
    }

    serviceStopped() {
        this.logger.info("ES6 Service stopped.");
    }
}

module.exports = GreeterService;
```

