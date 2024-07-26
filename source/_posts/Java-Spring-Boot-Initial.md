---
title: Java-Spring-Boot-Initial
author: TomasLin
tags:
  - Java
  - spring-boot
date: 2020-09-11
categories:
  - Java
---

# Initial project And Hello world

[download IntelliJ IDEA](https://www.jetbrains.com/idea/download/#section=mac)

建立一個新的 spring demo

![Image](../../../../images/Java_Spring_Boot/initial-01.png)

安裝好之後可以建立一個新的 Controller

src -> main -> java -> {packagename} -> web -> HelloController.java

```java
package com.example.demo.springbootdemo.web;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HelloController {
    @RequestMapping(value="/say", method = RequestMethod.GET)
    public  String helloGET() {
        return "Hello World GET";
    }
}
```

這樣就可以直接新增了一個 `http://loclahost:8081/api/say` 的 api

`@RestController` 代表這是一個 Restful API class

`@RequestMapping("route")` 來處理 url route 問題
  * value: route
  * method: method [GET, POST, PUT, PATCH, DELETE]

