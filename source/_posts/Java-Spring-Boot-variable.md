---
title: Java-Spring-Boot-variable
author: TomasLin
tags:
  - Java
  - spring-boot
date: 2020-09-11
categories:
  - Java
---

# Spring Boot

之前在 Java 已經處理了 `route`, `method` 的問題

接下來要處理使用 API 溝通時要傳遞參數的時候要如何實作？

* Path Variable
* Query String Variable
* Request Body Variable

## Path Variable

```java
package com.example.demo.springbootdemo.web;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {
    @GetMapping("/books/{id}")
    public Object getOne(@PathVariable long id) {
        Map<String, Object> book = new HashMap<>();
        book.put("id", id);
        book.put("name", "new book");
        book.put("number", "123jkda");
        return book;
    }
}
```