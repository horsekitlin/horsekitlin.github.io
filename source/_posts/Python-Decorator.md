---
title: Python-Decorator
author: TomasLin
categories: Python
tags:
  - Python
date: 2017-06-10
---

# Decorator

在網路上最常看到的範例

## Example

```python
def logged(func):
    def with_logging(*args, **kwargs):
        print func.__name__ + " was called"
        return func(*args, **kwargs)
    return with_logging

@logged
def f(x):
    return x + x * x


print f(2)
```

在  ```logger``` 中定義一個 Function ```with_logging```

在執行前 ```f``` 會被當成參數 ```func``` 傳入 ```logged```中

而 ```with_logging``` 會優先被執行

執行後才會執行 ```func```

上面的程式碼也會等於

```python
def logged(func):
    def with_logging(*args, **kwargs):
        print func.__name__ + " was called"
        return func(*args, **kwargs)
    return with_logging

def f(x): 
   return x + x * x

f = logged(f)

print f(2)
```

執行後的結果是一樣的

看起來要使用 **Decorator** 所有的操作都會在 Function  上 

傳入與回傳值都是 Function 

再來就是如果有多個裝飾子

那麼順序又如何決定的呢？

```python
def makebold(fn):
    def wrapper():
        return "<b>" + fn() + "</b>"
    return wrapper


def makeitalic(fn):
    def wrapper():
        return "<i>" + fn() + "</i>"
    return wrapper


@makeitalic
@makebold
def hello():
    return "hello world"

print hello()

# result: <i><b>hello world</b></i>
```

可以看到順序會先包 ```makeblod``` 然後再來才是 ```makeitalic ```

執行順序是由下往上

也可以把 ```decorator``` 當成是 recurcive 理解

# Class 的  Decorator

## Example

```python
class entryExit(object):
    def __init__(self, f):
        print 'entry init enter'
        self.f = f
        print 'entry init exit'

    def __call__(self, *args):
        print 'Entering', self.f.__name__
        r = self.f(*args)
        print 'Exit', self.f.__name__
        return r
print 'decorator using'

@entryExit
def hello(a):
    print 'inside hello'
    return 'hello world' + a

print 'test start'
print hello('friends')

'''
result:
---------------------
decorator using
entry init enter
entry init exit
test start
Entering hello
inside hello
Exit hello
hello worldfriends
'''

比較一開始的函式例子跟後來的類別例子

雖然識別字指的一個是類別

一個是函數

在程式碼中

在函式名後面加上()

變成函式呼叫

而類別本來是不能被呼叫的(not callable)

但加上類別方法__call__之後

就變得可以被呼叫

從程式的結果來看 test start 出現在 entry init exit 的後面

代表在 print 'test start' 之前

entryExit 就已實例化

應該就是 @entryExit 這句執行的

當程式執行到 hello('friend') 的時候

先進入的是 entryExit 的 __call__

後來才是 hello 自己的內容

這樣的流程觀察比較清楚

但是 cpython 倒底如何實作這段

這個例子很漂亮的介紹兩件事

第一件事是 decorator

第二件事就是 python 函式與物件之間的巧妙關聯