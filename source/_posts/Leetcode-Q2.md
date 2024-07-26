---
title: Leetcode-Q2
author: TomasLin
date: 2017-05-05
tags:
    - Javascript
    - Leetcode
categories: Leetcode
---

# 1 Two sum

## First solution

```js
var twoSum = function(nums, target) {
    var index,
    index2 = -1,
    i = 0;
    while(index === undefined){
        var num = nums[i],
            need = target - num;
        index2 = nums.indexOf(need)
        if(index2 === i){
            index = undefined;
            index2 = -1
        }else if(index2 !== -1){
            index = i;
        }
        i++;
    }
    return [index, index2];
};
```

因為是兩層的巢狀迴圈

加上有兩個 if 判斷式

所以效能會很差

```js
var twoSum = function(nums, target) {

    var map = {};
    for(var i = 0 ; i < nums.length ; i++){
        var v = nums[i];

        for(var j = i+1 ; j < nums.length ; j++ ){
            if(  nums[i] + nums[j]  == target ){
                return [i,j];
            }
        }

    }
};
```

因為是兩層的巢狀迴圈

加上有一個 if 判斷式

所以效能好一點

但還是不理想

```js
    var map = {};
    for(var i = 0 ; i < nums.length ; i++){
        var v = nums[i];

        if(map[target-v] >= 0){
            // 如果 target - v可以在map中找到值x，代表之前已經出現過值x， target = x + v
            // 因此回傳 x的位置與目前v的位置  
            return [map[target-v],i]
        } else {
            // 使用map儲存目前的數字與其位置  

            map[v] = i;
        }
    }
```

僅僅使用一層迴圈

若沒有找到的話就會記錄在 map 中

所以效能提升不少