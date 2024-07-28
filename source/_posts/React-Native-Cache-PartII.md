---
title: React-Native-Cache-PartII
author: TomasLin
tags:
  - Javascript
  - React Native
date: 2020-10-07
categories:
  - React Native
---

# 建立雙向鍊表的 Class

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

class DoubleLinklist {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(data){
    const newNode = new Node(data);

    console.log('this.length', this.length);
    console.log('this', this);
    if (this.length === 0) {
      this.tail = newNode;
      this.head = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length += 1;
  };
}

let list = new DoubleLinklist();

list.append('aaa');
list.append('bbb');
list.append('ccc');
console.log(list);
```

## 情境一

![image](https://gitee.com/ahuntsun/BlogImgs/raw/master/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/%E5%8F%8C%E5%90%91%E9%93%BE%E8%A1%A8/2.png)

## 情境二

![image](https://gitee.com/ahuntsun/BlogImgs/raw/master/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/%E5%8F%8C%E5%90%91%E9%93%BE%E8%A1%A8/3.png)

![image](https://gitee.com/ahuntsun/BlogImgs/raw/master/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/%E5%8F%8C%E5%90%91%E9%93%BE%E8%A1%A8/4.png)

**結果**

* next

![image](https://gitee.com/ahuntsun/BlogImgs/raw/master/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/%E5%8F%8C%E5%90%91%E9%93%BE%E8%A1%A8/5.png)

* prev

![image](https://gitee.com/ahuntsun/BlogImgs/raw/master/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/%E5%8F%8C%E5%90%91%E9%93%BE%E8%A1%A8/6.png)

## 完整範例

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

class DoubleLinklist {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  toString() {
    return this.backwardString();
  }

  forwardString() {
    let current =this.tail;
    let resultString = "";

    while (current) {
      resultString += current.data + "--";
      current = current.prev;
    }
    return resultString;
  }

  backwardString() {
    let current = this.head;
    let resultString = "";

    while (current) {
      resultString += current.data + "--";
      current = current.next;
    }
    return resultString;
  }

  indexOf(data){
    let current = this.head;
    let index = 0;

    while(current){
      if (current.data == data) {
        return index;
      }
      current = current.next;
      index += 1;
    }
    return -1;
  } 

  removeAt(position){
    if (position < 0 || position >= this.length) {
      return null;
    }
    
    let current = this.head;
    if (this.length == 1) {
      this.head = null;
      this.tail = null;
    } else{
      if (position == 0) {
        this.head.next.prev = null;
        this.head = this.head.next;

      }else if(position == this.length - 1){
        current = this.tail;
        this.tail.prev.next = null;
        this.tail = this.tail.prev;
      }else{
        let index = 0;
        while(index++ < position){
          current = current.next;
        }
        current.next.prev = current.prev;
        current.prev.next = current.next;
      }
    }

    this.length -= 1;
    return current.data;
  }

  remove(data) {
    const index = this.indexOf(data);
    return this.removeAt(index);
  }

  isEmpty(){
    return this.length == 0;
  }

  size() {
    return this.length;
  }

  getHead(){
    return this.head.data;
  }

  getTail (){
    return this.tail.data;
  }

  insert(position, data) {
    if (position < 0 || position > this.length) return false

    let newNode = new Node(data);

    if (this.length == 0) {
      this.head = newNode;
      this.tail = newNode;
    }else {
      if (position == 0) {
        this.head.prev = newNode;
        newNode.next = this.head;
        this.head = newNode;

      } else if(position == this.length){
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
      }else{
        let current = this.head;
        let index = 0;
        while(index++ < position){
          current = current.next;
        }
        newNode.next = current;
        newNode.prev = current.prev;
        current.prev.next = newNode;
        current.prev = newNode;
      }
    }

    this.length += 1;
    return true;
  }

  append(data){
    const newNode = new Node(data);

    console.log('this.length', this.length);
    console.log('this', this);
    if (this.length === 0) {
      this.tail = newNode;
      this.head = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length += 1;
  };
}

let list = new DoubleLinklist();
list.append('a')
list.append('b')
list.append('c')
list.append('d')

console.log(list.remove('a'));
console.log(list);
console.log(list.isEmpty());
console.log(list.size());
console.log(list.getHead());
console.log(list.getTail());
```