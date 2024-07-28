---
title: truffle pet demo
author: TomasLin
tags:
  - Truffle
  - Sodility
date: 2018-05-05
categories: Block Chain
---

# 設定步驟

1. 設定開發者相關環境變數
2. 建立一個 Truffle 專案
3. 寫一個基本的合約
4. 編譯與部屬你的合約
5. 測試你的合約
6. 建立一個介面來跟你的合約溝通
7. 放到瀏覽器開工囉

## 後端

### 1. 設定開發者相關環境變數

#### 安裝基本環境

[Nodejs](https://nodejs.org/en/)

[Git](https://git-scm.com/)

[Ganache](http://truffleframework.com/ganache/)

個人的以太區塊鏈的測試環境

```
  $ npm install -g truffle
  $ truffle --version // 檢查是否安裝成功以及版本
  $ mkdir pet-shop-tutorial && cd pet-shop-tutorial
```
### 2. 建立一個 Truffle 專案

Truffle 有提供一些套件協助建立 `DAPP`

[Truffle Boxes](https://truffleframework.com/boxes)

我常用 `React` 開發

[Truffle React Box](https://truffleframework.com/boxes/react)

所以這裡使用 React 作為範例

建立一個 `pet-shop` 的 basic project

```
  $ npx truffle unbox react
  $ npm install -g truffle
  $ truffle unbox react
```

```
  Truffle initial 有很多方式， `truffle init` 會幫你建立一個空的 Truffle 專案
```

[Truffle init](http://truffleframework.com/docs/getting_started/project)

#### 檔案結構

```
  .
├── LICENSE
├── box-img-lg.png
├── box-img-sm.png
├── bs-config.json
├── build
│   └── contracts
│       ├── Adoption.json
│       └── Migrations.json
├── contracts
│   ├── Adoption.sol
│   └── Migrations.sol
├── migrations
│   └── 1_initial_migration.js
├── package-lock.json
├── package.json
├── src
│   ├── css
│   │   ├── bootstrap.min.css
│   │   └── bootstrap.min.css.map
│   ├── fonts
│   │   ├── glyphicons-halflings-regular.eot
│   │   ├── glyphicons-halflings-regular.svg
│   │   ├── glyphicons-halflings-regular.ttf
│   │   ├── glyphicons-halflings-regular.woff
│   │   └── glyphicons-halflings-regular.woff2
│   ├── images
│   │   ├── boxer.jpeg
│   │   ├── french-bulldog.jpeg
│   │   ├── golden-retriever.jpeg
│   │   └── scottish-terrier.jpeg
│   ├── index.html
│   ├── js
│   │   ├── app.js
│   │   ├── bootstrap.min.js
│   │   ├── truffle-contract.js
│   │   └── web3.min.js
│   └── pets.json
├── test
└── truffle-config.js
```

* contracts : `Solidity` 的檔案，在這個範例中有一個 `Migrations.sol` 的範例檔案
* migrations : Truffle 利用 `migrations system` 來處理開發環境，A migration is an additional special smart contract that keeps track of changes.
* test : 測試檔案
* truffle.js : Truffle 的設定檔案

### 3. 寫一個基本的合約

在 `constracts` 中建立一個檔案 `Adoption.sol`

Adoption.sol

```solidity
pragma solidity ^0.5.0;

contract Adoption {

}
```

* pragma 定義使用 `solidity` 編譯器的版本

#### 變數

`Solidity` 有一種特別的變數 `adress`，這是代表  `Ethereum` 的位址

儲存了 20 個 byte 得值， 每一個帳號和合約在 `Ethereum block chain` 都擁有一個 `adress`

這個變數是 **唯一的**

在 `Adoption.sol` 中宣告一個 `adress`

```solidity
pragma solidity ^0.5.0;

contract Adoption {
  address[16] public adopters;
}
```

* 宣告一個變數 `adopters` 這是一個陣列儲存 `Ethereum` 的 address
Array 內有一種類型，在這裡的長度設定為 `16`

* `adopters` 設定是 public， public 有 `getter method` 回傳一個值
但是因為在這個範例 `adopters` 是一個陣列，所以等等會寫一個 function 回傳整個陣列

### First Function: Adopting a pet

```solidity
pragma solidity ^0.5.0;

contract Adoption {
  address[16] public adopters;
  // Adopting a pet
  function adopt(uint petId) public returns (uint) {
    require(petId >= 0 && petId <= 15);

    adopters[petId] = msg.sender;

    return petId;
  }
}
```

* 在 `Solidity` 中必須要定義函式的 輸入值和回傳值的型態，在這個範例中會接收一個 **petId** (整數)也會回傳一個整數

* 在函式要保證 **petId** 的範圍值必須在 `adopters 陣列` 範圍內, `Solidity` 中的陣列 index 是從 0 開始，所以這個 ID 會在 0~15 之間， 我們利用 `require()` 來定義這個範圍

* 如果這個 ID 在允許的範圍內 (0 ~ 15) 之間，則新增這個人的位址到採用者的陣列 `adopters` 而這個人的位址則是利用 `msg.sender` 來取得

* 最後回傳 `petId` 提供確認

### Second Function: Retrieving the adopters

array getter 只能回傳一個值，但是但是 16 個 API 不是很實際，所以我們需要一個 API 來回傳所有的寵物列表

1.  在 `adopt()` 後增加一個 `getAdopters()` 這個 function

```solidity
  function getAdopters() public view returns (address[16] memory) {
    return adopters;
  }
```
2. `adopters`已經宣告過了，可以直接回傳，但是要確認加上 `memory` 這個關鍵字 確認給出的是變量的位置
3. 而 `view` 這個關鍵字則代表這個 function 部會修改這個合約的任何狀態值，更詳細的資訊可以[查看這](https://solidity.readthedocs.io/en/latest/contracts.html#view-functions)

`memory` 表示 adopters 的值存在記憶體裡

```solidity
pragma solidity ^0.5.0;

contract Adoption {
  address[16] public adopters;
  function adopt(uint petId) public returns (uint) {
    require(petId >= 0 && petId <= 15);
    adopters[petId] = msg.sender;
    return petId;
  }

  function getAdopters() public view returns (address[16] memory) {
    return adopters;
  }
}
```

在這邊我們將回傳之前宣告的 `adopters` 定義類型為 address[16]

### 編譯並部署智能合約

Truffle 有一個開發者控制台， 他會生成一個開發區塊鏈，可以利用他測試部署合同

他可以直接在控制台運行，本範例大部分將會使用它完成

#### 編譯

`Solidity` 是一個編譯語言，所以需要一個編譯器先編譯之後才能執行，

```
  $ truffle compile
```

這時候應該會看到這些資訊
```
Compiling ./contracts/Adoption.sol...
Compiling ./contracts/Migrations.sol...
Writing artifacts to ./build/contracts
```

#### 部署

資料夾內會看到 `migrations/1_initial_migration.js` 這個檔案，，他是一個更改 contract 狀態的部屬腳本，會避免未來重複部署同樣的 `Migrations.sol` 合約

現在我們需要新增一個屬於我們自己的部署 script

1. 在 `migrations` 資料夾中新增一個檔案 `2_deploy_contracts.js`
2. `2_deploy_contracts.js` 內容

```js
const Adoption = artifacts.require("Adoption");

module.exports = function (deployer){
  deployer.deploy(Adoption);
}
```

在部署之前要先執行 `Ganache` 他會有一個本地的區塊鏈在 `port 7575`

若您尚未下載 [download Ganache](http://truffleframework.com/ganache)

![image](https://truffleframework.com/img/docs/ganache/quickstart/accounts.png)

然後回到終端機

```
  $ truffle migrate
Compiling ./contracts/Adoption.sol...
Writing artifacts to ./build/contracts

⚠️  Important ⚠️
If you're using an HDWalletProvider, it must be Web3 1.0 enabled or your migration will hang.


Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x9965bb63687936396ef9db5830b9e0a9ff36f10108b775abf944fc86f061454c
   > Blocks: 0            Seconds: 0
   > contract address:    0x3216882738b0ca58BD4a2a3125Fa4bC651100C7e
   > account:             0x10D045570AD2a69921Dc4e6b55148e071fC7484D
   > balance:             99.99430184
   > gas used:            284908
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00569816 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00569816 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.00569816 ETH
```

在 `Ganache` 中 blockchain 的狀態改變了從原本的 0 改變為 4 ，之後會再討論到交易成本

寫好第一個合約並且部署上了區塊鏈，接下來要開始測試一下你的合約

`transaction hash` 代表這個合約的序號

你可以透過這個序號來搜尋這個合約

回到 Terminal migrate 合約到鍊上

```
  $ truffle migrate
```

結果會是
```
Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975


2_deploy_contracts.js
=====================

   Deploying 'Adoption'
   --------------------
   > transaction hash:    0xac113a702da3ab7a8fde7ec8941143ff854cb8ae3f2457e1cc9251a0fa62a2b8
   > Blocks: 0            Seconds: 0
   > contract address:    0xAc30aaD46a83f8E8De3f452B0d4C175a1173a54b
   > account:             0x10D045570AD2a69921Dc4e6b55148e071fC7484D
   > balance:             99.98838348
   > gas used:            253884
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00507768 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00507768 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.00507768 ETH
```

![image](https://truffleframework.com/img/tutorials/pet-shop/ganache-migrated.png)

1. 可以打開 `Ganache` 之前的數值是 0 現在會變成 4，也可以看到第一個帳號原本是 `100`但是現在不到 `100` (我的顯示是 99.99)，因為這次的 migration 花費了乙太幣，等等會討論到更多關於這個花費的問題

#### 測試智能合約

Truffle 如何測試你的合約呢？

1. 建立一個 `TestAdoption.sol` 在 `test` 的資料夾下
2. 內容如下

```solidity
pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

  uint expectedPetId = 8;

  address expectedAdopter = address(this);
}
```

* `Assert.sol`: 提供 assertions 使用，判斷是否相等，大於小於等等的判斷
* `DeployedAddresses.sol`: 側是的時後 Truffle 會在鍊上部署一個新的實例，會取得那一個的位址來使用模擬
* `Adoption.sol`: 要測試的智能合約內容

然後再定義其他的變數
* `DeployedAddresses` 模擬部署一個智能合約取得他的位址
* `expectedPetId` 提供測試的寵物 ID
* 因為預計 `TestAdoption` 合約會發送交易，預期的 `sneder` 位址設為此，取得現在合約的 `address`

##### 測試 `adopt()` 函式

測試 `adopt()` 使用這個函式成功後回傳 `petId`

可以判斷這個 `petId` 的直是否正確

1. 在 `TestAdoption.sol` 中的 `Adoption` 中增加下面的程式碼

```solidity
function testUserCanAdoptPet() public {
  uint returnedId = adoption.adopt(expectedPetId);

  Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
}
```

* `expectedPetId` 是我們要認養的 寵物 ID 跟回傳的 `returnedId`是否相等

##### 測試單個寵物主人的主人

public 變數會有一個 `getter` 的 function 來取得，測試的過程中數據會持續存在

所以可以沿用 `expectedPetId` 在其他測試中

1. 增加一個 function 在 `TestAdoption.sol` 中

```solidity
function testGetAdopterAddressByPetId() public {
  address adopter = adoption.adopters(expectedPetId);

  Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
}
```

取得 `adopter` 的位址 存在合約中，利用 Assert 判斷是否一致

##### 測試所有寵物主人

```solidity
function testGetAdopterAddressByPetIdInArray() public {
  address[16] memory adopters = adoption.getAdopters();

  Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
}
```

注意 `adopters` 屬性，因為有 `memory` 關鍵字代表存在記憶體中，不是存在合約的 storage 中，當 `adopters` 在一個陣列中，比較了陣列中的 `expectedAdopter`做比較

#### Running test

```
  $ truffle test
  Using network 'development'.

  Compiling ./contracts/Adoption.sol...
  Compiling ./test/TestAdoption.sol...
  Compiling truffle/Assert.sol...
  Compiling truffle/DeployedAddresses.sol...

  TestAdoption
    ✓ testUserCanAdoptPet (75ms)
    ✓ testGetAdopterAddressByPetId (64ms)
    ✓ testGetAdopterAdderssByPetIdInArray (138ms)
```

# 參考資料

[Tutorial](http://truffleframework.com/tutorials/pet-shop)