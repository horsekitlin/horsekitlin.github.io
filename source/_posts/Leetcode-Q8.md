---
title: Leetcode-Q8
author: TomasLin
date: 2017-11-02
tags:
    - Javascript
    - Leetcode
categories: Leetcode
---

# Remove Duplicates from Sorted List

## 題目

Given a sorted linked list, delete all duplicates such that each element appear only once.+

For example,
Given 1->1->2, return 1->2.
Given 1->1->2->3->3, return 1->2->3.

改一個排序過的連結陣列，刪除重複的節點。
範例：
[1,1,2] -> return [1,2]
[1,1,2,3,3] -> return [1,2,3]

## NodeList

[NodeList](https://developer.mozilla.org/zh-TW/docs/Web/API/NodeList)

`Nodelist` 並不是陣列，主要的區別在於 `array` 有 push 和 pop， 但是 `NodeList` 並沒有

最簡單的範例就自愛瀏覽器使用 `document.querySelectorAll('class')` 回傳值就是 `NodeList`

## 想法

因為輸入值已經是排序過後的 `NodeList`，所以只需要檢查室不是下一個跟這一個事不是相等

若是相等就略過

## Result

```javascript
var deleteDuplicates = function(head) {
    if(head === null || head.next === null){
        return head;
    }
    let temp = head;
    while(temp.next !== null){
        if(temp.val === temp.next.val){
            temp.next = temp.next.next;
        }else{
            temp = temp.next;
        }
    }
    return head;
};
```
