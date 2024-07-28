---
title: Day-05-ingress-controller
author: TomasLin
tags:
  - DevOps
  - IThome2023
  - Docker
  - Kubernetes
date: 2023-09-20
categories:
  - IThome2023鐵人賽
---

# Ingress Controller

`Ingress` 是進入的意思

在 Kubernetes 中也是代表著進入 Cluster 的流量

`Egress` 則代表退出 Cluster 的流量

`Ingress` 是原生的 Kubernetes 的資源

使用 `Ingress` 可以維護 DNS routing 設定

如果沒有使用 Kubernetes Ingress 你需要增加一個 Loadbalancer 

![image](https://devopscube.com/wp-content/uploads/2021/08/image-11.png)

若是使用 `Ingress` 的話 如下圖

![image1](https://devopscube.com/wp-content/uploads/2021/08/image-14.png)

`Note: AWS GCP 雲端 Ingress Controller 的實作略有不同。例如，`[AWS loadbalancer](https://devopscube.com/aws-load-balancers/) `充當入口控制器。`[GKE Ingress Setup](https://devopscube.com/setup-ingress-gke-ingress-controller/)

在 Kubernetes Ingress 穩定前可以先用 Nginx 或是 HAproxy kubernetes 將流量導入 Cluster

## Kubernetes Ingress 如何作用

主要有兩個概念

1. `Kubernetes Ingress 資源:` Kubernetes Ingress 負責 Cluster 中的 DNS Routing 規則
2. `Kubernetes Ingress Controller:` Kubernetes 入口控制器（Nginx/HAProxy 等）負責透過存取入口資源應用的 DNS 規則來進行路由

[image3](https://devopscube.com/wp-content/uploads/2021/05/ingress-blog-images.png)

## 實際範例

hello-one.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-one
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: hello-one
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-one
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hello-one
  template:
    metadata:
      labels:
        app: hello-one
    spec:
      containers:
      - name: hello-ingress
        image: nginxdemos/hello
        ports:
        - containerPort: 80 
```

hello-two.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-two
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: hello-two
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-two
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hello-two
  template:
    metadata:
      labels:
        app: hello-two
    spec:
      containers:
      - name: hello-ingress
        image: nginxdemos/hello
        ports:
        - containerPort: 80
```

my-new-ingress.yaml

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-new-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
  - host: hello-one.tomas.website
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: hello-one
            port:
              number: 80
  - host: hello-two.tomas.website
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: hello-two
            port:
              number: 80

```

完成之後可以打開頁面

[hello-one.tomas.website](http://hello-one.tomas.website/)

[hello-two.tomas.website](http://hello-two.tomas.website/)

明天再來繼續聊聊 Ingress Controller