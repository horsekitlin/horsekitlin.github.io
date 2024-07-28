---
title: SocketCluster-scc
author: TomasLin
tags:
  - Nodejs
  - SocketCluster
date: 2020-09-21
categories:
  - Nodejs
---

# SCC Guide

SCC 是服務的集合

讓你可以快速的將 `SocketCluster` 快速的部屬到多台機器上

讓彼此可以任意溝通

並且可以利用 `Kubernetes`  上面優化運行

`SCC` 基本上可以分成幾個服務

* scc-worker (SocketCluster) https://github.com/SocketCluster/socketcluster
* scc-broker https://github.com/SocketCluster/scc-broker
* scc-state https://github.com/SocketCluster/scc-state
* scc-ingress (Kubernetes only)

## Scc-worker

可以建立多個數量的 service 必須指定一個 `scc-state` service 做連結

## Scc-broker

可以建立多個數量的 service 必須指定一個 `scc-state` service 做連結

這是特殊的後端 service 和 scc-worker 最大的不同是

scc-broker 主要是在與多個前端做訊息的溝通

所有的 `sub/pub` channels 可以平均的在 scc-broker 平均分配流量

## Scc-state

一個 Cluster 應該只會有一個 Scc-state service

主要在管理各個 Service 的狀態

讓他們可以自動 重新啟動或是服務管理

當有新的 `Scc-broker` 加入的時候

Scc-state 會通知所有的 `Scc-worker`

這樣就可以重新平衡流量

當 `Scc-state` 關閉或是不可用的時候

SCC可以繼續運行而不會中斷服務

[k8s](https://github.com/SocketCluster/socketcluster/blob/master/scc-guide.md#running-on-kubernetes-recommended)

未來會補充

**部屬順序**

scc-state >> scc-worker >> scc-broker

# 參考資源

[SCC Guide](https://github.com/SocketCluster/socketcluster/blob/master/scc-guide.md)
