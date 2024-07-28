---
title: Day-01-Docker簡介
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

# 簡介

Docker 大致上可以分為 `Image`, `Container`, `Registry` 三個基本概念

* Image - 是一個唯讀的完整操作系統環境，裡面僅僅安裝了必要的應用程序和支援程式． 它是一個模板
* Container - 容器，鏡像運行時的實體，可以用一個image去啟動多個container，這些container是獨立的，互相不會干涉，我們對任何一個container做的改變，只會對那個container造成影響。
* Registry - 如果是熟悉Git的，其實這裡說的Registry就是Git所說的Repository，只是跟Git repository不同的，Git repository是存放原始碼的，但是Docker registry是存放Docker images的．Docker跟Git的指令也有相似之處，譬如說push和pull，可以把 images 從Docker registry上傳或下載，概念是這樣，先有個大概的認識，之後就可以慢慢來實作了。


[Docker Wiki](https://zh.wikipedia.org/zh-tw/Docker)

過往在做部署的時候總是一台 機器會架設多個服務，

服務之間的環境設定 或是套件 服務的版本會有所衝突

常常造成一些奇怪的問題

Docker 可以將環境單純化

盡量降低因為環境因素影響服務運行

