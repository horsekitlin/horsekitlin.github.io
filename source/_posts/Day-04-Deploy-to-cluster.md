---
title: Day-04-Deploy-to-cluster
author: TomasLin
tags:
  - DevOps
  - IThome2023
  - Docker
  - Kubernetes
date: 2023-09-19
categories:
  - IThome2023鐵人賽
---

# Deploy to Cluster on LKE

建立一個 `app` 的資料夾

```
  $ mkdir app
  $ mv ./* ./app
  $ mkdir manifests
```

建立一個 `static-site-deployment.yaml` 檔案

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: static-site-deployment
  labels:
    app: static-site
spec:
  replicas: 3
  selector:
    matchLabels:
      app: static-site
  template:
    metadata:
      labels:
        app: static-site
    spec:
      containers:
      - name: static-site
        image: horsekit1982/lke-example:v1.0.0
        imagePullPolicy: Always
        ports:
        - containerPort: 80
```

Deployments 描述 `Pod` 和 `ReplicaSet` 

建立一個名為 `static-site-deployment` 的 Deployment (以 `.metadata.name`)

會以這個名稱為基礎 建立 `ReplicaSet` 和 `Pod`

此 Deployment 建立一個 ReplicaSet 會由三個 (`.spec.replicas`) Pod 副本

`.spec.selector` 描述了 ReplicaSet 如何尋找要管理的 Pod

在上面的範例中選擇 Pod 中定義的標籤(app: static-site)

`Note: .spec.selector.matchLabels 欄位是 {key,value} 鍵值對映射。在 matchLabels 映射中的每個 {key,value} 映射等效於 matchExpressions 中的一個元素， 即其 key 字段是 “key”，operator 為 “In”，values 數組僅包含 “value”。在 matchLabels 和 matchExpressions 中給出的所有條件都必須滿足才能匹配。`

`template` 自斷包含

  * Pod 使用 .metadata.labels 欄位打上 app: nginx 標籤
  * Pod 範本規約（即 `.template.spec 欄位`）指示 Pod 執行 static-site 容器
  * 建立容器並使用 `.spec.template.spec.containers[0].name` 欄位將其命名為 static-site

  建立一個 `static-site-service.yaml` 檔案

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: static-site-service
    namespace: react-site
    annotations:
      service.beta.kubernetes.io/linode-loadbalancer-throttle: "4"
    labels:
      app: static-site
  spec:
    type: LoadBalancer
    ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 80
    selector:
      app: static-site
    sessionAffinity: None
  ```

  Kubernetes 中 Service 的一個關鍵目標是讓你無需修改現有應用程式以使用某種不熟悉的服務發現機制。
  
  你可以在 Pod 集合中運行程式碼，無論程式碼是為雲端原生環境設計的， 還是被容器化的舊應用程式
  
  你可以使用 Service 讓一組 Pod 在網路上訪問，這樣客戶端就能與之互動

  上面的範例建立了一個 `static-site-service` 的服務

  Port 是 80

  `Note: Service 能夠將任意入站 port 對應到某個 targetPort。預設情況下，出於方便考慮，targetPort 會被設定為與 port 欄位相同的值`

  也可以有另外一種範例

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: nginx
    labels:
      app.kubernetes.io/name: proxy
  spec:
    containers:
    - name: nginx
      image: nginx:stable
      ports:
        - containerPort: 80
          name: http-web-svc

  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: nginx-service
  spec:
    selector:
      app.kubernetes.io/name: proxy
    ports:
    - name: name-of-service-port
      protocol: TCP
      port: 80
      targetPort: http-web-svc
  ```

在上述範例中 targetPort 指定是 `http-web-svc` 會指定到 `Pod` 的 port 80

