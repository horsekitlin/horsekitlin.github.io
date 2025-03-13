---
title: Day01-Go結構體與方法詳解
tags:
  - Golang
date: 2025-03-13 23:27:43
categories:
  - Golang學習
---

# Go 結構體與方法詳解

## 結構體基礎

Go 語言使用結構體(struct)作為組織和封裝資料的主要方式。相較於其他語言的類(Class)，Go的結構體更加輕量且直觀。

## 分離檔案結構

在真實專案中，我們通常將結構體定義和主函數分開：

- `room.go`: 包含結構體定義和相關方法
- `main.go`: 主程式，引用並使用結構體

這種分離可以提高程式的可維護性和可讀性。

## 結構體標籤詳解

在 `room.go` 中，我們看到這樣的定義：

```go
type Room struct {
    ID int `json:"id"`
    // 其他欄位...
}
```

`json:"id"` 是結構體標籤(struct tag)，它們是附加在結構體欄位上的元數據：

1. **標籤格式**: 反引號(`) 包裹的字串
2. **標籤用途**: 主要用於運行時反射機制
3. **常見標籤**: 
   - `json:"欄位名"`: 指定JSON序列化/反序列化時使用的欄位名
   - `db:"欄位名"`: 常用於資料庫ORM
   - `form:"欄位名"`: 常用於HTTP表單解析

### 標籤選項

標籤還可以包含選項，例如：

```go
Notes string `json:"notes,omitempty"`
```

`omitempty` 選項表示：如果該欄位為零值(空字串、0、false等)，則在JSON序列化時省略此欄位。

### 標籤的作用

當使用 `json.Marshal()` 序列化 `Room` 結構體時：

```go
room := Room{ID: 1, Number: "101"}
jsonData, _ := json.Marshal(room)
```

輸出的JSON會根據標籤變成：

```json
{"id":1,"room_number":"101",...}
```

而不是：

```json
{"ID":1,"Number":"101",...}
```

這對API開發極其重要，可以保持JSON欄位名的一致風格，同時內部代碼可以遵循Go的命名規範。

## 值接收器方法詳解

在 `room.go` 中定義了幾個使用值接收器的方法：

```go
func (r Room) Info() string {
    // 方法實現...
}
```

讓我們深入理解值接收器方法：

### 值接收器的工作原理

1. **接收器宣告**: `(r Room)` 表示此方法附加到 `Room` 類型
2. **參數傳遞**: Go 使用值複製，方法內的 `r` 是原始結構體的副本
3. **調用方式**: `room.Info()` 會複製 `room` 到方法的 `r` 參數

### 值接收器的特性

1. **不改變原始值**:
   ```go
   func (r Room) SetAvailable(available bool) {
       r.Available = available // 只改變副本
   }
   
   room := Room{Available: true}
   room.SetAvailable(false)
   fmt.Println(room.Available) // 仍然是 true
   ```

2. **方法接收者是副本**:
   每次調用方法都會創建結構體的完整副本，對於大型結構體可能影響性能

3. **適合不修改狀態的操作**:
   ```go
   func (r Room) CalculateTotalPrice(nights int) float64 {
       return r.Price * float64(nights)
   }
   ```

4. **方法鏈不可行**:
   由於操作的是副本，無法實現有效的方法鏈

### 值接收器的最佳實踐

1. **使用於小型結構體**:
   結構體較小時，複製的開銷較低

2. **用於讀取操作**:
   ```go
   func (r Room) Info() string {...}
   func (r Room) CalculateTotalPrice(nights int) float64 {...}
   ```

3. **不可變性設計**:
   值接收器方法保證不修改原結構體，提高程式可預測性

4. **線程安全考量**:
   每個線程操作的是獨立副本，避免共享狀態問題

## 使用案例分析

讓我們分析 `Room` 結構體的幾個值接收器方法：

### Info() 方法

```go
func (r Room) Info() string {
    return fmt.Sprintf("Room %s (Type: %s) - $%.2f per night, Capacity: %d persons",
        r.Number, r.Type, r.Price, r.Capacity)
}
```

- **目的**: 格式化輸出房間信息
- **為何使用值接收器**: 純讀取操作，不需修改結構體

### CalculateTotalPrice() 方法

```go
func (r Room) CalculateTotalPrice(nights int) float64 {
    return r.Price * float64(nights)
}
```

- **目的**: 計算特定住宿天數的總價
- **為何使用值接收器**: 純計算，基於現有屬性，無需修改結構體

### DaysSinceLastCleaning() 方法

```go
func (r Room) DaysSinceLastCleaning() int {
    return int(time.Since(r.LastCleaned).Hours() / 24)
}
```

- **目的**: 計算自上次清潔以來的天數
- **為何使用值接收器**: 純計算，不修改狀態

### NeedsCleaning() 方法

```go
func (r Room) NeedsCleaning() bool {
    return r.DaysSinceLastCleaning() >= 1
}
```

- **目的**: 檢查房間是否需要清潔
- **為何使用值接收器**: 基於其他方法的計算結果，不修改狀態

## 延伸學習資源

- [Go 官方文件: 方法](https://golang.org/doc/effective_go#methods)
- [詳解 Go 中的方法接收器選擇](https://golang.org/doc/faq#methods_on_values_or_pointers)
- [Go 序列化標籤的進階用法](https://blog.golang.org/json-and-go)