---
title: Day-06-Deploy-https-website-part01
author: TomasLin
tags:
  - DevOps
  - IThome2023
  - Docker
  - Kubernetes
date: 2023-10-01
categories:
  - IThome2023鐵人賽
---

# Ingress

Ingress 是對 Cluster 中服務的外部存取進行管理的 API 對象，典型的存取方式是 HTTP

## Ingress Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx-example
  rules:
  - http:
      paths:
      - path: /testpath
        pathType: Prefix
        backend:
          service:
            name: test
            port:
              number: 80
```

Ingress 需要指定 `apiVersion`、`kind`、 `metadata`和 `spec`

### Ingress rules

* host: Optional - 若沒有設定 host 的話則代表所有 http request, 若是有設定 host 則代表描述的是該 host 的規則
* path 列表 - 每一個 path 可以指向不同 或是同一個 service
* service name 則需要對應到每一個 Service 的名稱

#### 路徑類型

Ingress 中的每個路徑都需要有對應的路徑類型（Path Type）

未明確設定 pathType 的路徑無法通過合法性檢查。目前支援的路徑類型有三種

* ImplementationSpecific： 對於這種路徑類型，匹配方法取決於 IngressClass。具體實作可以將其作為單獨的 pathType 處理或作與 Prefix 或 Exact 類型相同的處理
* Exact：精確匹配 URL 路徑，且區分大小寫
* Prefix：基於以 `/` 分隔的 URL 路徑前綴匹配。匹配區分大小寫， 並且對路徑中各個元素逐一執行匹配操作。路徑元素指的是由 `/` 分隔符號分隔的路徑中的標籤清單。如果每個 *p* 都是請求路徑 *p* 的元素前綴，則請求與路徑 *p* 相符。

```
  Note： 如果路徑的最後一個元素是請求路徑中最後一個元素的子字串，則不會被視為符合
  （例如：/foo/bar 符合 /foo/bar/baz, 但不符合 /foo/barbaz）
```

#### 萬用字符號

主機名稱可以是精確匹配（例如 "foo.bar.com"）或使用通配符來匹配 （例如 “*.foo.com"）

精確比對要求 HTTP host 頭部欄位與 host 欄位值完全相符

通配符匹配則要求 HTTP host 頭部欄位與通配符規則中的後綴部分相同 

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-wildcard-host
spec:
  rules:
  - host: "foo.bar.com"
    http:
      paths:
      - pathType: Prefix
        path: "/bar"
        backend:
          service:
            name: service1
            port:
              number: 80
  - host: "*.foo.com"
    http:
      paths:
      - pathType: Prefix
        path: "/foo"
        backend:
          service:
            name: service2
            port:
              number: 80
```