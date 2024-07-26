---
title: React Native-ExportComponentUI
author: TomasLin
tags:
  - Javascript
  - React Native
date: 2019-12-06
categories:
  - React Native
---

# Setup

```
react-native init CounterApp
cd CounterApp
react-native run-ios
```

App.js

```javascript
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';


class App extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.wrapper, styles.border]}
          onPress={this.increment}
        >
          <Text style={styles.button}>
            {this.state.count}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: "stretch"
  },
  wrapper: {
    flex: 1, alignItems: "center", justifyContent: "center"
  },
  border: {
    borderColor: "#eee", borderBottomWidth: 1
  },
  button: {
    fontSize: 50, color: "orange"
  }
});

export default App;
```

# How to expose a Swift UI Component to JS

## 建立一個 Swift ViewManager

  * File → New → File… (or CMD+N)
  * Select Swift File
  * Name your file CounterViewManager
  * In the Group dropdown, make sure to select the group CounterApp, not the project itself.

[!select CounterApp](https://miro.medium.com/max/1514/1*GaIIeNeYbncmKNTMwLs-Dg.png)

### Configure the Objective-C Bridging Header

```note
After you create the Swift file, you should be prompted to choose if you want to configure an Objective-C Bridging Header. Select “Create Bridging Header”.
```

[configure Objective-C Bridging Header](https://miro.medium.com/max/1214/1*KOH-ocd4sVbgoXvS5j8d2g.png)

如果您還沒有標題，請立即添加其中兩個標題

```
// CounterApp-Bridging-Header.h

#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"
```

CounterViewManager.swift

```swift
@objc(CounterViewManager)
class CounterViewManager: RCTViewManager {
  override func view() -> UIView! {
    let label = UILabel()
    label.text = "Swift Counter"
    label.textAlignment = .center
    return label
  }
}
```

## 新增一個 Obj-C 檔案

* File → New → File… (or CMD+N)
* Select Objective-C File
* Name your file CounterViewManager

CounterViewManager.m

```objective-c

#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(CounterViewManager, RCTViewManager)
@end
```

## Access your Component from JS

現在你可以使用 `requireNativeComponent` 來使用

## 建立 swiftUI 

CounterViewManager.swift

```swift
@objc(CounterViewManager)
class CounterViewManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func view() -> UIView! {
    return CounterView()
  }
}
```

CounterView.swift

```swift
import UIKit
class CounterView: UIView {
  @objc var count = 0 {
    didSet {
      button.setTitle(String(describing: count), for: .normal)
    }
  }
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.addSubview(button)
    increment()
  }
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  lazy var button: UIButton = {
    let b = UIButton.init(type: UIButton.ButtonType.system)
    b.titleLabel?.font = UIFont.systemFont(ofSize: 50)
    b.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    b.addTarget(
      self,
      action: #selector(increment),
      for: .touchUpInside
    )
    return b
  }()
  @objc func increment() {
    count += 1
  }
}
```

## How to send props to a Swift Component

可以透過 `RCT_EXPORT_VIEW_PROPERTY` 來 export props

在這個範例中 將 `count` export 

CounterViewManager.m

```
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(CounterViewManager, RCTViewManager)
  RCT_EXPORT_VIEW_PROPERTY(count, NSNumber)
@end
```


`Important: you have to use Obj-C types for variables exposed to React Native`

CounterView.swift

```swift
import UIKit
class CounterView: UIView {
   @objc var count: NSNumber = 0 {
    didSet {
      button.setTitle(String(describing: count), for: .normal)
    }
  }
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.addSubview(button)
    increment()
  }
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  lazy var button: UIButton = {
    let b = UIButton.init(type: UIButton.ButtonType.system)
    b.titleLabel?.font = UIFont.systemFont(ofSize: 50)
    b.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    b.addTarget(
      self,
      action: #selector(increment),
      for: .touchUpInside
    )
    return b
  }()
  @objc func increment() {
    count = count.intValue + 1 as NSNumber
  }
}
```

App.js

```javascript

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  requireNativeComponent,
} from 'react-native';

const CounterView = requireNativeComponent("CounterView");

class App extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.wrapper, styles.border]}
          onPress={this.increment}
        >
          <Text style={styles.button}>
            {this.state.count}
          </Text>
        </TouchableOpacity>

        <CounterView style={ styles.wrapper } count={2} />
      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: "stretch"
  },
  wrapper: {
    flex: 1, alignItems: "center", justifyContent: "center"
  },
  border: {
    borderColor: "#eee", borderBottomWidth: 1
  },
  button: {
    fontSize: 50, color: "orange"
  }
});

export default App;
```

## Expose a Component Event Emitter

接下來使用一個 `function` 來讓 native 使用

CounterView.swift

```swift
import UIKit
class CounterView: UIView {
  
   @objc var onUpdate: RCTDirectEventBlock?
  
   @objc var count: NSNumber = 0 {
    didSet {
      button.setTitle(String(describing: count), for: .normal)
    }
  }
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.addSubview(button)
    increment()
  }
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  lazy var button: UIButton = {
    let b = UIButton.init(type: UIButton.ButtonType.system)
    b.titleLabel?.font = UIFont.systemFont(ofSize: 50)
    b.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    b.addTarget(
      self,
      action: #selector(increment),
      for: .touchUpInside
    )
    
    let longPress = UILongPressGestureRecognizer(
      target: self,
      action: #selector(sendUpdate(_:))
    )
    b.addGestureRecognizer(longPress)
    
    return b
  }()
  
  @objc func sendUpdate(_ gesture: UILongPressGestureRecognizer) {
    if gesture.state == .began {
      if onUpdate != nil {
        onUpdate!(["count": count])
      }
    }
  }
  
  @objc func increment() {
    count = count.intValue + 1 as NSNumber
  }
}
```

If you have to send any data to a RCTDirectEventBlock method, you must return a [AnyHashable:Any] structure. This means that you can’t pass a String or Int directly, you have to put them in a Dictionary.

CounterViewManager.m

```
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(CounterViewManager, RCTViewManager)
  RCT_EXPORT_VIEW_PROPERTY(count, NSNumber)
  RCT_EXPORT_VIEW_PROPERTY(onUpdate, RCTDirectEventBlock)
@end
```

在 header 也要增加一行

## Expose methods on the ViewManager

CounterApp-Bridging-Header.h

```
#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"
#import "React/RCTEventEmitter.h"
#import "React/RCTUIManager.h"
```

CounterViewManager.swift

```swift
@objc(CounterViewManager)
class CounterViewManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func view() -> UIView! {
    return CounterView()
  }
  
    @objc func updateFromManager(_ node: NSNumber, count: NSNumber) {
      
      DispatchQueue.main.async {                                // 2
        let component = self.bridge.uiManager.view(             // 3
          forReactTag: node                                     // 4
        ) as! CounterView                                       // 5
        component.update(value: count)                          // 6
      }
    }
}
```

CounterView.swift

```swift
import UIKit

class CounterView: UIView {
  
   @objc var onUpdate: RCTDirectEventBlock?
  
   @objc var count: NSNumber = 0 {
    didSet {
      button.setTitle(String(describing: count), for: .normal)
    }
  }
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.addSubview(button)
    increment()
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  lazy var button: UIButton = {
    let b = UIButton.init(type: UIButton.ButtonType.system)
    b.titleLabel?.font = UIFont.systemFont(ofSize: 50)
    b.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    b.addTarget(
      self,
      action: #selector(increment),
      for: .touchUpInside
    )
    
    let longPress = UILongPressGestureRecognizer(
      target: self,
      action: #selector(sendUpdate(_:))
    )
    b.addGestureRecognizer(longPress)
    
    return b
  }()
  
  @objc func update(value: NSNumber) {
      count = value
  }
  
  @objc func sendUpdate(_ gesture: UILongPressGestureRecognizer) {
    if gesture.state == .began {
      if onUpdate != nil {
        onUpdate!(["count": count])
      }
    }
  }
  
  @objc func increment() {
    count = count.intValue + 1 as NSNumber
  }
}
```

App.js

```javascript
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  UIManager,
  TouchableOpacity,
  requireNativeComponent,
} from 'react-native';

const CounterView = requireNativeComponent("CounterView");

class App extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 })
  }
  update = e => {
    this.setState({
      count: e.nativeEvent.count
    })
  }

  _onUpdate = event => {
    if (this.props.onUpdate) {
      this.props.onUpdate(event.nativeEvent);
    }
  };
  
  updateNative = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.counterRef),                     // 1
      UIManager["CounterView"].Commands.updateFromManager, // 2
      [this.state.count]                                   // 3
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.wrapper, styles.border]}
          onPress={this.increment}
        >
          <Text style={styles.button}>
            {this.state.count}
          </Text>
        </TouchableOpacity>

        <CounterView
          style={ styles.wrapper }
          count={this.state.count}
          onUpdate={this._onUpdate}
          ref={ref => this.ref = ref}
        />
      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: "stretch"
  },
  wrapper: {
    flex: 1, alignItems: "center", justifyContent: "center"
  },
  border: {
    borderColor: "#eee", borderBottomWidth: 1
  },
  button: {
    fontSize: 50, color: "orange"
  }
});

export default App;
```

# 參考文章

[Swift in React Native](https://teabreak.e-spres-oh.com/swift-in-react-native-the-ultimate-guide-part-2-ui-components-907767123d9e#2389)
