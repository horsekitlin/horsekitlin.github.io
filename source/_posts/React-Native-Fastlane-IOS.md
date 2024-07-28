---
title: React-Native-Fastlane-IOS
author: TomasLin
tags:
  - Javascript
  - React Native
date: 2020-10-12
categories:
  - React Native
---

# Setting Up fastlane

## Install Homebrew

```
  $ /usr/bin/ruby -e \
  "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  $ brew update && brew install ruby
  $ brew link --overwrite ruby
```

重新啟動 Terminal

```
  $ sudo gem install bundler
  $ xcode-select --install
  $ sudo gem install -n /usr/local/bin fastlane --verbose
  $ brew cask install fastlane
  $ npx react-native init rndemo
  $ cd rndemo/ios
```

add to `.zshrc`

```
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
```

**Gemfile**

```gemfile
source "https://rubygems.org"

gem "fastlane"
```

```
  $ sudo gem install bundler
  $ bundle exec fastlane init
```

[screenshots](https://docs.fastlane.tools/getting-started/ios/screenshots/)

[distribution to beta testing services](https://docs.fastlane.tools/getting-started/ios/beta-deployment/)

[automate the App Store release process](https://docs.fastlane.tools/getting-started/ios/appstore-deployment/)

[setup code signing with fastlane](https://docs.fastlane.tools/codesigning/getting-started/)

依據上述的 tutorial 就可以完成相對應的工作