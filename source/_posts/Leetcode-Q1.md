---
title: Leetcode-Q1
date: 2017-05-03
author: TomasLin
tags:
    - Javascript
    - Leetcode
categories: Leetcode
---

# 538 Convert BST to Greater Tree

## Description

Given a Binary Search Tree (BST), convert it to a Greater Tree such that every key of the original BST is changed to the original key plus sum of all keys greater than the original key in BST.

```
輸入一個Binary Search Tree(BST), 將每一個節點得值更改為原始的值加上加上大於BST中 Node 的值的總和
```

## Example

```
Input: The root of a Binary Search Tree like this:
              5
            /   \
           2     13

Output: The root of a Greater Tree like this:
             18
            /   \
          20     13
```

```javascript
  var convertBST = function(root) {
    var vals = [];
    var count = 0;
    function visit1(root){
      if(root){
          visit1(root.left);
          vals.push(root.val);
          visit1(root.right);
      }
  }
  visit1(root);

  function visit2(root){
      if(root){
          visit2(root.right);
          count += vals.pop();
          root.val = count;
          visit2(root.left);
      }
  }
  visit2(root);
  return root;
}
```

## Note

visit1: 利用遞迴將 Node 往下延伸到最左邊子元素的時候依序push 到陣列中

visit2: 利用遞迴將 Node 往下延伸到最右邊的子元素依序將 value 修改為加總得值

利用二元樹的特性來做輪巡並修改值
