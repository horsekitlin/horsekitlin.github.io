---
title: Truffle-pet-user-interface
author: TomasLin
tags:
  - Truffle
  - Sodility
date: 2019-02-07
categories: Block Chain
---

# Truffle pet demo

[延續](https://horsekitlin.github.io/2018/05/05/Truffle-pet-demo/)

# 建立一個前端介面

上一篇初始化的程式中也包含了前端的程式碼

但是只有一部分

需要做一些補全 

1. 打開 `/src/js/app.js`
2. app.js 裡面已經有 一個物件叫做 `App` 控制我們的前端
  1. `init()` 負責 load data
  2. `initWeb3()` [web3 lib](https://github.com/ethereum/web3.js/)他可以取回使用者帳號的資訊，發送交易需求
  3. 移除 `initWeb3()` 中的註解 加上下面這段程式碼

```js
initWeb3: async function() {
    if(window.ethereum) {
      App.web3Provider = window.ethereum;

      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    } else if(window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },
```
* 先檢查瀏覽器中是否有 `ethereum` provider 如果有的話就建立自己的 `web3` 物件來取得帳號資訊，但是依舊要呼叫 `ethereum.enable()`
* 如果 `ethereum` 不存在，檢查 `window.web3` 是否存在來引用舊版的 provider
* 如果沒有的話就是測試使用 `localhost:7545`

## Instantiating the contract

處理好 `web3` 的初始化之後

現在需要來解決一下如何實際在前端取得合約的資料

`truffle` 有一個 lib 可以協助處理這件事情: `truffle-contract`

他會在 有新的 `migrations` 同步合約上的資訊

所以你不用修改合約的位址

1. `/src/js/app.js` 中有 `initContract` 的函式

```js
  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      const AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();
    });

    return App.bindEvents();
  },
```

* 先檢索在鏈上的合約文件，`AdoptionArtifact` 是合約的內容資訊，包含位址 DApp 接口(ABI)
* 一但我們取得 Artifact 會將他 pass 給 `TruffleContract()`. 他會產生一個新的物件，這個物件會提供一下 method 讓我們可以跟合約溝通
* 產生的 實例會設定給 `App.web3Provider` 以方便 web3使用
* 然後呼叫 APP 的 `markAdopted()` function 封裝這個是因為方便在合約改變的時候可以同時改變 UI

```
Note: ABI: Application Binary Interface 應用程式機器碼介面
ABI 是一個 Javascript 對象，用來定義如何跟合約相互溝通的接口
```

## Getting The Adopted Pets and Updating The UI

在 `/src/js/app.js` 中移除 `markAdopted` 中的註解並填入下述程式碼

```js
  markAdopted: function(adopters, account) {
    let adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.call();
    }).then(function(adopters) {
      for(i=0; i<adopters.length; i++) {
        if(adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(error) {
      console.log(error.message)
    });
  },
```

這一段程式碼中闡述了

* 同意部署 `Adoption` 合約，然後呼叫 `getAdopters()` 在這個實例中
* 因為宣告了`adoptionInstance` 在最外面，所以在之後可以呼叫他
* `call()` 可以讓我們讀取資料而不用發送一個交易，代表我們不用花費任何乙太幣
* 呼叫 `getAdopters()` 使用一個迴圈訪問所有的 `pet` 確定是否已經有了位址，因為以太使用 16 個位元的初始值，而不是用 `null` 
* 如果找到有相對應位址的就禁用按鈕並將按鈕的文字改為 `成功` 以便使用者了解這些資訊
* 所有的錯誤都會顯示在 `console`

## Handling the adopt() Function

依舊是在 `/src/js/app.js` 中，移除 `handleAdopt` 函式中的註解，替換為下列程式碼

```js
  handleAdopt: function(event) {
    event.preventDefault();

    let petId = parseInt($(event.target).data('id'));

    let adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }

      let account = accounts[0];

      App.contracts.Adoption.deployed()
        .then(function(instance) {
          adoptionInstance = instance;
          return adoptionInstance.adopt(petId, {from: account});
        }).then(function(result) {
          return App.markAdopted();
        }).catch(function(error) {
          console.log(error.message);
        });
    });
  }
```

* 利用 `web3` 取得使用者帳號列，含有 `error` 檢查是否錯誤，若無誤 取第一個帳號
* 在這裡已經取得部署成功的合約，將它 指定給 `adoptionInstance` 這個變數，這一次我們會發送一個交易請求而且必須要有 `from` 這個位址，這個動作會產生一些費用，在乙太中 這個費用叫做 `gas`，這是一種手續費用，在你儲存或是計算的時候需要付出部分 `gas` `adopt()` 中含有 寵物的 ID 和一個物件，這些資訊會被儲存在 `account`中
* 發送交易後的結果是一個物件，如果沒有錯誤的話會呼叫 `markAdopted()` 來同步 UI 和儲存的資訊

最簡單的方式是透過 [MetaMask](https://metamask.io/) 這個在 chrome 和 firefox 都有相關的擴充套件

1. 安裝 MetaMask
2. ![](https://truffleframework.com/img/tutorials/pet-shop/metamask-privacy.png)
3. 點擊同意
4. ![閱讀如何使用](https://truffleframework.com/img/tutorials/pet-shop/metamask-terms.png)
5. ![輸入密碼](https://truffleframework.com/img/tutorials/pet-shop/metamask-initial.png)
6. ![完成](https://truffleframework.com/img/tutorials/pet-shop/metamask-networkmenu.png)
7. 在 MetaMask 中選擇 `New RPC URL` 並且輸入 `http://127.0.0.1:7545`

## Installing and configuring lite-server

可以起一個 local 的 service 來看看結果

1. 編輯 `bs-config.json` 改為下述程式碼

```json
{
  "server": {
    "baseDir": ["./src", "./build/contracts"]
  }
}
```

```
  $ npm run dev
```

# Result

![Image](../../../../images/blockchain/example.png)