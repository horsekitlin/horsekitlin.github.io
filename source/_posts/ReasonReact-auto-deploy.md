---
title: ReasonReact-auto-deploy
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
date: 2018-11-12
---

# Work With Drone

*drone.yml*
```yml
pipeline:
  scp:
    image: appleboy/drone-scp
    pull: true
    host: 
      - your server ip
    port: 22
    username: root
    user: root
    secrets: [ ssh_password ]
    target: /root
    source:
      - $DRONE_DIR
    when:
      branch: master

  ssh:
    image: appleboy/drone-ssh
    host: 
      - your server ip
    username: root
    user: root
    secrets: [ ssh_password ]
    command_timeout: 600
    script:
      - . /root/.nvm/nvm.sh && nvm use 10.9.0
      - mkdir -p Your target path
      - cd /root/$DRONE_DIR
      - yarn install
      - npm run webpack:production
      - cp -a build/* Your target path
      - cd /root
      - rm -rf /root/drone
    when:
      branch: master
```

這個範例代表當你的 master 有被push 的時候觸發 pipe 流程

會依序執行

# 問題

我在 linode 的 ubuntu 16 的 server

安裝 bs-platform 的時候遇到 node: permission denied 的問題

[解法](https://github.com/creationix/nvm/issues/1407)

# code

[github](https://github.com/horsekitlin/reason-react-demo)

# Nginx

```
server {
  server_name  YourDomain;

  root /var/www/html/YourDomain;
  index index.html index.htm index.php;

  location / {
          try_files $uri $uri/ =404;
  }
}
```

然後要註冊一個 domain 指向你的 IP

# Demo

[demo](http://reason-demo.tomas.website/)

這樣只要有 push

就可以自動更新上去囉