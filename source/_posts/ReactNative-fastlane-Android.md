---
title: React Native-fastlane-Android
author: TomasLin
tags:
  - Javascript
  - React Native
date: 2020-12-26
categories:
  - React Native
---

# Fastlane Install

```
  $ bundle config set path 'vendor/bundle'
  $ cd android
  $ bundle install
  $ bundle exec fastlane init
```

## Build Android

FastFile

```
default_platform(:android)

platform :android do
  desc "Runs all the tests"
  lane :test do
    gradle(task: "test")
  end

  desc "Submit a new Beta Build to Crashlytics Beta"
  lane :beta do
    gradle(task: "clean assembleRelease")
    # crashlytics
    gradle(
      task: 'assemble',
      build_type: 'Release'
    )
    # sh "your_script.sh"
    # You can also use other beta testing services here
  end
end
```

可能會有錯誤 `Expiring Daemon because JVM heap space is exhausted`

### Solution

~/.gradle/gradle.properties

```
org.gradle.daemon=true
org.gradle.configureondemand=true
org.gradle.jvmargs=-Xmx4g -XX:MaxPermSize=2048m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

./android/app/build.gradle

```
...
android {
    dexOptions {
       javaMaxHeapSize "3g"
    }
}
...
```

## Distribution with firebase

### install plugin

```
  $ bundle exec fastlane add_plugin firebase_app_distribution
```

### login

```
  $ bundle exec fastlane run firebase_app_distribution_login
```

### 修改 Fastfile

```
default_platform(:android)

platform :android do
  desc "Runs all the tests"
  lane :test do
    gradle(task: "test")
  end

  desc "Submit a new Beta Build to Crashlytics Beta"
  lane :beta do
    gradle(task: "clean assembleRelease")
    # crashlytics
    gradle(
      task: 'assemble',
      build_type: 'Release'
    )

    firebase_app_distribution(
      app: "firebase app project id",
      groups: "firebase test groups"
    )
  end
end
```

```
  $ bundle exec fastlane beta
```

# 參考資料

[Expiring Daemon because JVM heap space is exhausted
](https://stackoverflow.com/questions/56075455/expiring-daemon-because-jvm-heap-space-is-exhausted)
