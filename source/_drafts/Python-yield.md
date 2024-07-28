---
title: Python-yield
author: TomasLin
categories: Python
tags: 
  - Python
---

# Yield

## Iterables

建立一個陣列

你可以依序一個一個來瀏覽陣列裡的參數

而這個陣列稱之為 `Iterables`

```python
mylist = [0, 1, 2];
for i in mylist:
  print(i)
```

result
```
0
1
2
```

所有可以用 `for... in ...` 的皆為陣列
* string
* list
* file

## Generator

只可以依序呼叫一次

```python
mygenerator = (x*x for x in range(3))
for i in mygenerator:
  print(i)
```

result
```
0
1
4
```

但是第二次呼叫的時候就已經沒有值了

它和 `Iterables` 使用上的差異只是在一個使用 `[]` 一個使用 `()`

### yield

是一個 keyword 使用上類似 `return` 會回傳一個 generator


## 參考資料

[yield](https://pythontips.com/2013/09/29/the-python-yield-keyword-explained/)