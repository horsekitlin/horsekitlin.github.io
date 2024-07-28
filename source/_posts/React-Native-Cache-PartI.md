---
title: React Native Cache PartI
author: TomasLin
tags:
  - Javascript
  - React Native
date: 2020-10-07
categories:
  - React Native
---

# LRU Cache

Cache 是兩個存取速度差異的硬體

同步兩者資料的架構

**LRU**  是 Least Recently Used 的縮寫

表示最近較少使用的會優先被替換掉

## 實作邏輯

LRU 快取是一個固定容量的 map

如果快取是滿的時候

仍需要插入一個新的元素

找出最近最少使用的元素來替換

而不會增加 Cache 的容量大小

* 需要一個類似[hashmap](https://en.wikipedia.org/wiki/Hash_table) 的架構
* 一種將所有元素按照訪問順徐來儲存，有效率的移動元素可以藉由[雙向連結](https://en.wikipedia.org/wiki/Doubly_linked_list)

需要有兩個操作

* `#.set`
* `#.get`

可以參考 [lru github](https://github.com/chriso/lru)

```javascript
const LRU = require('lru');

const cache = new LRU(2),
    evicted

cache.on('evict',function(data) { evicted = data });

cache.set('foo', 'bar');
cache.get('foo'); //=> bar

cache.set('foo2', 'bar2');
cache.get('foo2'); //=> bar2

cache.set('foo3', 'bar3'); // => evicted = { key: 'foo', value: 'bar' }
cache.get('foo3');         // => 'bar3'
cache.remove('foo2')       // => 'bar2'
cache.remove('foo4')       // => undefined
cache.length               // => 1
cache.keys                 // => ['foo3']

cache.clear()              // => it will NOT emit the 'evict' event
cache.length               // => 0
cache.keys                 // => []
```

### 雙向鍊表

雙向鍊表

既可以從頭到尾訪問，也可以從尾到頭訪問

一個節點會有前面的 `ref` 也會有一個向後的 `ref`

![image](https://gitee.com/ahuntsun/BlogImgs/raw/master/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/%E5%8F%8C%E5%90%91%E9%93%BE%E8%A1%A8/1.png)


* 雙向鍊表不僅有 `head` 指向第一個節點，而且有 `tail` 指向最後一個節點
* 每一個節點由三部分組成：item儲存數據、prev指向前一個節點、next指向後一個節點
* 雙向鍊表的第一個節點的 `prev` 指向null
* 雙向鍊表的最後一個節點的 `next` 指向null

雙向鍊錶常見的操作:

* append（element）
    * 雙向鍊表尾部添加一個新的元素
* inset（position，element）
    * 雙向鍊表的特定位置插入一個新的元素
* get（element）
    * 獲取對應位置的元素
* indexOf（element）
    * 返回元素在鍊錶中的 `index`，如果雙向鍊表中沒有元素就返回 `-1`
* update（position，element）
    * 修改某個位置的元素
* removeAt（position）
    * 從雙向鍊表的特定位置移除一項
* isEmpty（）
    * 如果雙向鍊表中不包含任何元素，返回trun，如果雙向鍊表長度大於 `0` 則返回 `false`
* size（）
    * 返回雙向鍊表包含的元素個數，與 陣列 的length屬性類似
* toString（）
    * 由於雙向鍊表中需要重寫繼承自JavaScript對象默認的toString方法，只輸出元素的值
* forwardString（）
    * 返回正向訪問節點字符串形式
* backwordString（）
    * 返回反向訪問的節點的字符串形式
