---
title: Day02-進階結構體與方法
tags:
  - Golang
date: 2025-03-13 23:27:43
categories:
  - Golang學習
---

# Go 結構體與方法

## 指標接收器方法詳解

相對於值接收器，Go 語言也支援指標接收器方法，這對於理解 Go 的物件導向風格至關重要。

### 指標接收器的語法與機制

<details>
<summary>點擊展開程式碼</summary>

```go
func (r *Room) Clean() {
    r.LastCleaned = time.Now()
    r.Status = "清潔完成"
}
```

</details>

在這個方法中：

1. **接收器宣告**: `(r *Room)` 表示此方法使用 `Room` 類型的指標
2. **參數傳遞**: 傳遞的是原始結構體的記憶體位址，而非複製
3. **調用方式**: `room.Clean()` 會自動轉換為 `(&room).Clean()`

### 指標接收器的特性

1. **可以修改原始值**:

<details>
<summary>點擊展開程式碼</summary>

```go
func (r *Room) SetAvailable(available bool) {
    r.Available = available // 修改原始結構體
}

room := Room{Available: false}
room.SetAvailable(true)
fmt.Println(room.Available) // 現在是 true
``` 

</details>

2. **方法接收的是引用**:
   不會複製整個結構體，無論結構體多大，只傳遞一個指標

3. **支援方法鏈式調用**:

<details>
<summary>點擊展開程式碼</summary>

```go
func (r *Room) SetPrice(price float64) *Room {
    r.Price = price
    return r
}

func (r *Room) SetType(roomType string) *Room {
    r.Type = roomType
    return r
}

// 方法鏈
room.SetPrice(150.0).SetType("豪華套房")
```

</details>

4. **零值接收器安全性**:
   需注意空指標調用的問題

<details>
<summary>點擊展開程式碼</summary>

```go
var room *Room
room.Clean() // 可能導致空指標異常
```

</details>

### 指標接收器的最佳實踐

1. **用於大型結構體**:
   避免複製大型資料結構的成本

2. **用於修改操作**:

<details>
<summary>點擊展開程式碼</summary>

```go
func (r *Room) Clean() { ... }
func (r *Room) Book(guestName string) { ... }
```

</details>

3. **保持一致性**:
   如果類型有任何一個方法使用指標接收器，考慮全部使用指標接收器

4. **實現介面時**:
   注意 `*T` 類型實現了介面不代表 `T` 類型也實現了該介面

5. **線程安全考量**:
   多線程環境中使用指標接收器需要考慮同步問題

### 指標接收器使用案例

<details>
<summary>點擊展開程式碼</summary>

```go
// 清潔房間（修改狀態）
func (r *Room) Clean() {
    r.LastCleaned = time.Now()
    r.Status = "已清潔"
    r.Available = true
}

// 預訂房間（修改多項屬性）
func (r *Room) Book(guestName string, startDate, endDate time.Time) error {
    if !r.Available {
        return fmt.Errorf("房間 %s 目前不可預訂", r.Number)
    }
    
    r.GuestName = guestName
    r.StartDate = startDate
    r.EndDate = endDate
    r.Available = false
    r.Status = "已預訂"
    
    return nil
}

// 方法鏈示例
func (r *Room) SetCapacity(capacity int) *Room {
    r.Capacity = capacity
    return r
}

func (r *Room) SetAmenities(amenities []string) *Room {
    r.Amenities = amenities
    return r
}
```

</details>

### 值接收器與指標接收器的選擇

| 特性 | 值接收器 | 指標接收器 |
|------|---------|-----------|
| 修改原始值 | ❌ | ✅ |
| 避免大結構體複製 | ❌ | ✅ |
| 方法鏈 | ❌ | ✅ |
| 並發安全性 | ✅ (副本隔離) | ⚠️ (需同步) |
| 空值調用安全 | ✅ | ⚠️ |

## 結構體嵌入與組合

Go 不支援傳統的繼承，但提供結構體嵌入作為組合的強大機制。

### 基本嵌入

<details>
<summary>點擊展開程式碼</summary>

```go
type Person struct {
    Name    string
    Age     int
    Address string
}

type Employee struct {
    Person        // 匿名嵌入 Person 結構體
    EmployeeID string
    Position   string
    Salary     float64
}
```

</details>

在此例中，`Employee` 結構體嵌入了 `Person` 結構體。

### 欄位和方法提升

1. **欄位提升**:

<details>
<summary>點擊展開程式碼</summary>

```go
employee := Employee{
    Person: Person{
        Name:    "張小明",
        Age:     30,
        Address: "台北市信義區",
    },
    EmployeeID: "E001",
    Position:   "軟體工程師",
    Salary:     85000,
}

// 可直接存取提升的欄位
fmt.Println(employee.Name)  // 輸出: 張小明
fmt.Println(employee.Age)   // 輸出: 30
```

</details>

2. **方法提升**:

<details>
<summary>點擊展開程式碼</summary>

```go
func (p Person) Greet() string {
    return fmt.Sprintf("你好，我是 %s", p.Name)
}

// Employee 自動獲得 Greet 方法
fmt.Println(employee.Greet())  // 輸出: 你好，我是 張小明
```

</details>

### 嵌入多個結構體

<details>
<summary>點擊展開程式碼</summary>

```go
type ContractInfo struct {
    ContractID   string
    StartDate    time.Time
    EndDate      time.Time
    ContractType string
}

type Employee struct {
    Person         // 嵌入 Person
    ContractInfo   // 嵌入 ContractInfo
    EmployeeID string
    Position   string
}
```

</details>

### 名稱衝突的處理

當嵌入的結構體包含同名欄位或方法時：

<details>
<summary>點擊展開程式碼</summary>

```go
type A struct {
    X int
}

type B struct {
    X int
}

type C struct {
    A
    B
}

func main() {
    c := C{}
    // c.X        // 編譯錯誤：不明確的選擇器
    c.A.X = 1     // 需明確指定路徑
    c.B.X = 2
}
```

</details>

### 嵌入介面

Go 允許在結構體中嵌入介面，用於實現特定設計模式：

<details>
<summary>點擊展開程式碼</summary>

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type ReadWriter struct {
    Reader  // 嵌入 Reader 介面
    Writer  // 嵌入 Writer 介面
}
```

</details>

### 嵌入與組合的比較

1. **嵌入**:
   - 提升欄位和方法
   - 簡化語法
   - 但增加了隱式依賴

2. **顯式組合**:

<details>
<summary>點擊展開程式碼</summary>

```go
type Employee struct {
    person Person        // 非嵌入，使用命名欄位
    EmployeeID string
}

// 使用:
fmt.Println(employee.person.Name)  // 需明確指定路徑
```

</details>

   - 更清晰的依賴關係
   - 避免名稱衝突
   - 但語法更冗長

## 實作：預約資料模型

讓我們實作一個完整的預約系統資料模型，整合前面所學的概念。

### 定義模型

<details>
<summary>點擊展開程式碼</summary>

```go
// reservation.go
package hotel

import (
    "errors"
    "fmt"
    "time"
)

// Customer 代表預約的客戶
type Customer struct {
    ID        int    `json:"id" db:"id"`
    FirstName string `json:"first_name" db:"first_name"`
    LastName  string `json:"last_name" db:"last_name"`
    Email     string `json:"email" db:"email"`
    Phone     string `json:"phone" db:"phone"`
}

// 客戶全名方法
func (c Customer) FullName() string {
    return fmt.Sprintf("%s %s", c.FirstName, c.LastName)
}

// Reservation 代表房間預約
type Reservation struct {
    ID            int       `json:"id" db:"id"`
    RoomID        int       `json:"room_id" db:"room_id"`
    Customer                // 嵌入客戶資訊
    CheckInDate   time.Time `json:"check_in_date" db:"check_in_date"`
    CheckOutDate  time.Time `json:"check_out_date" db:"check_out_date"`
    GuestCount    int       `json:"guest_count" db:"guest_count"`
    TotalPrice    float64   `json:"total_price" db:"total_price"`
    PaymentStatus string    `json:"payment_status" db:"payment_status"`
    CreatedAt     time.Time `json:"created_at" db:"created_at"`
    Notes         string    `json:"notes,omitempty" db:"notes"`
}

// 計算住宿天數
func (r Reservation) NightsCount() int {
    return int(r.CheckOutDate.Sub(r.CheckInDate).Hours() / 24)
}

// 驗證預約資料
func (r *Reservation) Validate() error {
    if r.RoomID <= 0 {
        return errors.New("無效的房間ID")
    }
    
    if r.CheckInDate.IsZero() || r.CheckOutDate.IsZero() {
        return errors.New("入住和退房日期不能為空")
    }
    
    if r.CheckOutDate.Before(r.CheckInDate) {
        return errors.New("退房日期不能早於入住日期")
    }
    
    if r.GuestCount <= 0 {
        return errors.New("客人數量必須大於零")
    }
    
    if r.Email == "" {
        return errors.New("電子郵件不能為空")
    }
    
    return nil
}

// 計算價格
func (r *Reservation) CalculatePrice(roomPrice float64) {
    nights := r.NightsCount()
    r.TotalPrice = roomPrice * float64(nights)
}

// 確認預約
func (r *Reservation) Confirm() *Reservation {
    r.PaymentStatus = "已確認"
    return r
}

// 取消預約
func (r *Reservation) Cancel() *Reservation {
    r.PaymentStatus = "已取消"
    return r
}

// 更新客戶資訊
func (r *Reservation) UpdateCustomerInfo(firstName, lastName, email, phone string) *Reservation {
    r.FirstName = firstName
    r.LastName = lastName
    r.Email = email
    r.Phone = phone
    return r
}

// 預約狀態
func (r Reservation) Status() string {
    now := time.Now()
    
    if r.PaymentStatus == "已取消" {
        return "已取消"
    }
    
    if now.Before(r.CheckInDate) {
        return "即將到來"
    }
    
    if now.After(r.CheckOutDate) {
        return "已完成"
    }
    
    return "入住中"
}

// 預約摘要
func (r Reservation) Summary() string {
    return fmt.Sprintf(
        "預約 #%d: %s, %d 位客人, 從 %s 到 %s (%d 晚), 總價: $%.2f, 狀態: %s",
        r.ID,
        r.FullName(),
        r.GuestCount,
        r.CheckInDate.Format("2006-01-02"),
        r.CheckOutDate.Format("2006-01-02"),
        r.NightsCount(),
        r.TotalPrice,
        r.Status(),
    )
}
```

</details>

### 使用範例

<details>
<summary>點擊展開程式碼</summary>

```go
// main.go
package main

import (
    "fmt"
    "time"
    
    "myapp/hotel" // 假設上面的代碼在此包中
)

func main() {
    // 創建房間
    room := hotel.Room{
        ID:       1,
        Number:   "202",
        Type:     "豪華雙人房",
        Price:    3800.0,
        Capacity: 2,
    }
    
    // 創建客戶
    customer := hotel.Customer{
        ID:        1,
        FirstName: "小明",
        LastName:  "王",
        Email:     "wang.xiaoming@example.com",
        Phone:     "0912-345-678",
    }
    
    // 創建預約
    checkIn, _ := time.Parse("2006-01-02", "2025-03-15")
    checkOut, _ := time.Parse("2006-01-02", "2025-03-17")
    
    reservation := hotel.Reservation{
        ID:            1,
        RoomID:        room.ID,
        Customer:      customer,
        CheckInDate:   checkIn,
        CheckOutDate:  checkOut,
        GuestCount:    2,
        PaymentStatus: "待確認",
        CreatedAt:     time.Now(),
    }
    
    // 計算價格
    reservation.CalculatePrice(room.Price)
    
    // 確認預約
    reservation.Confirm()
    
    // 輸出預約摘要
    fmt.Println(reservation.Summary())
    
    // 顯示房間資訊
    fmt.Println(room.Info())
    
    // 顯示預約總天數
    fmt.Printf("預約總共 %d 晚\n", reservation.NightsCount())
    
    // 檢查預約是否有效
    if err := reservation.Validate(); err != nil {
        fmt.Printf("預約驗證失敗: %s\n", err)
    } else {
        fmt.Println("預約資料有效")
    }
}
```

</details>

### 實際應用場景

1. **API 整合**:

<details>
<summary>點擊展開程式碼</summary>

```go
// JSON 序列化
jsonData, _ := json.Marshal(reservation)

// POST 請求
resp, _ := http.Post("https://api.hotel.com/reservations", 
                     "application/json", 
                     bytes.NewBuffer(jsonData))
```

</details>

2. **資料庫整合**:

<details>
<summary>點擊展開程式碼</summary>

```go
// 使用 sqlx 套件
_, err := db.NamedExec(`
    INSERT INTO reservations (
        room_id, first_name, last_name, email, phone, 
        check_in_date, check_out_date, guest_count, 
        total_price, payment_status, created_at, notes
    ) VALUES (
        :room_id, :first_name, :last_name, :email, :phone,
        :check_in_date, :check_out_date, :guest_count,
        :total_price, :payment_status, :created_at, :notes
    )`, reservation)
```

</details>

3. **預約業務邏輯**:

<details>
<summary>點擊展開程式碼</summary>

```go
// 假設有一個管理預約的服務
func (s *ReservationService) MakeReservation(roomID int, customerInfo Customer, 
                                           checkIn, checkOut time.Time, 
                                           guestCount int) (*Reservation, error) {
    // 檢查房間是否可用
    room, err := s.roomRepo.GetByID(roomID)
    if err != nil {
        return nil, err
    }
    
    if !s.IsRoomAvailable(roomID, checkIn, checkOut) {
        return nil, errors.New("所選日期房間已被預訂")
    }
    
    // 建立預約
    reservation := &Reservation{
        RoomID:        roomID,
        Customer:      customerInfo,
        CheckInDate:   checkIn,
        CheckOutDate:  checkOut,
        GuestCount:    guestCount,
        PaymentStatus: "待確認",
        CreatedAt:     time.Now(),
    }
    
    // 計算價格
    reservation.CalculatePrice(room.Price)
    
    // 驗證
    if err := reservation.Validate(); err != nil {
        return nil, err
    }
    
    // 儲存至資料庫
    err = s.reservationRepo.Create(reservation)
    if err != nil {
        return nil, err
    }
    
    return reservation, nil
}
```

</details>

## 總結

在本文中，我們深入探討了 Go 語言的結構體和方法：

1. **值接收器與指標接收器**:
   - 值接收器適合不修改狀態的操作
   - 指標接收器適合需要修改結構體的方法和大型結構體
   
2. **結構體嵌入**:
   - Go 透過嵌入實現組合而非繼承
   - 欄位和方法的提升簡化了訪問
   - 嵌入多個結構體要注意名稱衝突
   
3. **實際應用**:
   - 透過預約系統實現展示了各種概念的整合
   - 展示了如何選擇適當的接收器類型
   - 實現業務邏輯與資料驗證

透過靈活運用這些概念，我們可以在 Go 中實現清晰、高效且易於維護的物件導向設計。

# 參考資訊

1. [A Tour of Go - 方法和指標接收器](https://tour.golang.org/methods/4)
2. [Effective Go - 嵌入](https://golang.org/doc/effective_go#embedding)
3. [Go語言設計與實現 - 郝林](https://book.douban.com/subject/27044219/)
4. [Go學習筆記 - 雨痕](https://github.com/qyuhen/book)
5. [Go語言高級編程 - 柴樹傑, 曹春暉](https://github.com/chai2010/advanced-go-programming-book)