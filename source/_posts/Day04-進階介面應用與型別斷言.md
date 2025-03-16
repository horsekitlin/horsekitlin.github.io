---
title: Day04-進階介面應用與型別斷言
tags:
  - Golang
date: 2025-03-17 19:45:20
categories:
  - Golang學習
---

# Go 語言進階介面應用

在前一篇文章中，我們介紹了 Go 語言的基本介面概念，包括隱式介面實現、空介面使用和基本資料存取介面設計。本文將深入探討更進階的介面應用，包括型別斷言、介面組合以及如何實作完整的資料存取層。

## 型別斷言（Type Assertion）

型別斷言是一種在執行時檢查介面值中存儲的具體類型的機制。當我們使用介面類型時，常需要恢復原始類型以訪問特定的方法或欄位。

### 基本型別斷言語法

型別斷言的基本語法是 `x.(T)`，其中 `x` 是介面類型的變數，`T` 是我們斷言 `x` 可能持有的具體類型。

<details>
<summary>點擊展開程式碼</summary>

```go
var i interface{} = "Hello, Go"

// 斷言 i 存儲的是 string 類型
s := i.(string)
fmt.Println(s) // 輸出: "Hello, Go"

// 錯誤的斷言會導致 panic
// n := i.(int) // 錯誤: interface conversion: interface {} is string, not int

// 安全的型別斷言（帶檢查）
n, ok := i.(int)
if ok {
    fmt.Println("i 是整數:", n)
} else {
    fmt.Println("i 不是整數") // 這行會執行
}
```

</details>

### 型別斷言的兩種形式

1. **直接斷言**：`value := x.(T)` - 如果失敗會導致 panic
2. **帶檢查的斷言**：`value, ok := x.(T)` - 如果失敗，ok 為 false，value 為類型 T 的零值

### 型別選擇（Type Switch）

當需要對多種可能的類型進行斷言時，型別選擇（type switch）是一種更優雅的方式：

<details>
<summary>點擊展開程式碼</summary>

```go
func processValue(value interface{}) {
    switch v := value.(type) {
    case nil:
        fmt.Println("是 nil")
    case int:
        fmt.Println("是整數:", v)
    case string:
        fmt.Println("是字串:", v)
    case bool:
        fmt.Println("是布林值:", v)
    case []byte:
        fmt.Println("是位元組切片，長度:", len(v))
    case []int:
        fmt.Printf("是整數切片: %v\n", v)
    case map[string]interface{}:
        fmt.Println("是字典，包含鍵:", len(v))
        for key := range v {
            fmt.Printf("  - %s\n", key)
        }
    default:
        fmt.Printf("未知類型: %T\n", v)
    }
}

// 使用範例
processValue(42)
processValue("Hello")
processValue([]byte{1, 2, 3})
processValue(map[string]interface{}{"name": "小明", "age": 30})
processValue(struct{ x, y int }{10, 20})
```

</details>

### 常見型別斷言錯誤與處理

1. **斷言非介面類型**：只能對介面類型變數進行型別斷言

<details>
<summary>點擊展開程式碼</summary>

```go
str := "hello"
// val := str.(string) // 編譯錯誤: invalid type assertion: str.(string) (non-interface type string on left)

// 正確做法：首先轉換為介面
var i interface{} = str
val := i.(string) // 正確
```

</details>

2. **斷言到不相容類型**：斷言的類型必須是介面值所包含的具體類型或者是該值可以轉換的介面類型

<details>
<summary>點擊展開程式碼</summary>

```go
type MyStringer interface {
    String() string
}

type MyInt int

func (m MyInt) String() string {
    return fmt.Sprintf("MyInt: %d", m)
}

func example() {
    var i interface{} = MyInt(42)
    
    // 可以斷言到具體類型
    v1, ok := i.(MyInt)
    fmt.Println(v1, ok) // MyInt(42), true
    
    // 可以斷言到實現的介面
    v2, ok := i.(MyStringer)
    fmt.Println(v2.String(), ok) // "MyInt: 42", true
    
    // 不能斷言到未實現的介面
    v3, ok := i.(fmt.Stringer)
    fmt.Println(v3, ok) // nil, false（因為 MyInt 沒有實現標準庫的 Stringer 介面）
}
```

</details>

3. **誤用型別選擇**：型別選擇需要使用特殊語法 `x.(type)`，且只能在 switch 語句中使用

<details>
<summary>點擊展開程式碼</summary>

```go
func wrongUsage(v interface{}) {
    // t := v.(type) // 編譯錯誤: use of .(type) outside type switch
    
    // 正確用法
    switch t := v.(type) {
    case int:
        fmt.Printf("整數: %d\n", t)
    default:
        fmt.Printf("其他類型: %T\n", t)
    }
}
```

</details>

### 型別斷言的最佳實踐

1. **優先使用帶檢查的斷言**：除非你確定類型不會錯誤，否則總是使用 `value, ok := x.(T)`
2. **考慮使用型別選擇**：當需要檢查多種可能的類型時
3. **避免過度使用**：過度使用型別斷言可能意味著你的設計有問題
4. **用於多態行為**：在需要根據具體類型執行不同邏輯的情況下使用

<details>
<summary>點擊展開程式碼</summary>

```go
// 一個實用的例子：自定義格式化
func formatAny(value interface{}) string {
    switch v := value.(type) {
    case nil:
        return "NULL"
    case int, int8, int16, int32, int64:
        return fmt.Sprintf("%d", v)
    case float32, float64:
        return fmt.Sprintf("%.2f", v)
    case bool:
        if v {
            return "是"
        }
        return "否"
    case time.Time:
        return v.Format("2006-01-02 15:04:05")
    case fmt.Stringer:
        return v.String()
    default:
        return fmt.Sprintf("%v", v)
    }
}

// 實際應用
type Person struct {
    Name string
    Age  int
}

func (p Person) String() string {
    return fmt.Sprintf("%s (%d歲)", p.Name, p.Age)
}

func demo() {
    fmt.Println(formatAny(42))          // "42"
    fmt.Println(formatAny(3.14159))     // "3.14"
    fmt.Println(formatAny(true))        // "是"
    fmt.Println(formatAny(time.Now()))  // 當前時間格式化
    fmt.Println(formatAny(Person{"張三", 28})) // "張三 (28歲)"
}
```

</details>

## 介面組合（Interface Composition）

介面組合是 Go 語言中組織和重用代碼的強大機制。通過組合多個小型介面，可以構建出更複雜、更具表達力的介面。

### 介面組合的基本概念

在 Go 中，一個介面可以包含其他介面的所有方法，這種設計稱為介面組合（或嵌入）。

<details>
<summary>點擊展開程式碼</summary>

```go
// 基本介面
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type Closer interface {
    Close() error
}

// 組合介面
type ReadWriter interface {
    Reader
    Writer
}

type ReadCloser interface {
    Reader
    Closer
}

type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}
```

</details>

### 標準庫中的介面組合實例

Go 標準庫中大量使用了介面組合，特別是在 `io` 包中：

<details>
<summary>點擊展開程式碼</summary>

```go
// 標準庫中的相關定義 (io 包)
// type Reader interface { Read(p []byte) (n int, err error) }
// type Writer interface { Write(p []byte) (n int, err error) }
// type Closer interface { Close() error }
// type ReadWriter interface { Reader; Writer }
// type ReadCloser interface { Reader; Closer }
// type WriteCloser interface { Writer; Closer }
// type ReadWriteCloser interface { Reader; Writer; Closer }

// 使用這些介面的例子
func CopyAndClose(src io.Reader, dst io.WriteCloser) error {
    // 從 src 複製到 dst
    _, err := io.Copy(dst, src)
    if err != nil {
        dst.Close() // 嘗試關閉
        return err
    }
    
    // 關閉目標
    return dst.Close()
}

// 實際使用
func example() {
    // 開檔案
    src, err := os.Open("source.txt")
    if err != nil {
        log.Fatal(err)
    }
    defer src.Close()
    
    // 建立檔案
    dst, err := os.Create("destination.txt")
    if err != nil {
        log.Fatal(err)
    }
    
    // src 是 io.Reader，dst 是 io.WriteCloser
    if err := CopyAndClose(src, dst); err != nil {
        log.Fatal(err)
    }
}
```

</details>

### 自定義介面組合實例

讓我們設計一個檔案處理系統，利用介面組合來實現各種功能：

<details>
<summary>點擊展開程式碼</summary>

```go
// filesys.go
package filesys

import (
    "io"
    "time"
)

// 基本檔案資訊
type FileInfo interface {
    Name() string       // 檔案名稱
    Size() int64        // 檔案大小
    ModTime() time.Time // 修改時間
    IsDir() bool        // 是否目錄
}

// 檔案讀取器
type FileReader interface {
    io.Reader
    io.Seeker
    io.Closer
    Stat() (FileInfo, error) // 獲取檔案資訊
}

// 檔案寫入器
type FileWriter interface {
    io.Writer
    io.Seeker
    io.Closer
    Truncate(size int64) error // 截斷檔案
    Sync() error               // 同步到磁碟
}

// 完整檔案訪問
type File interface {
    FileReader
    FileWriter
    Name() string // 檔案路徑
}

// 目錄介面
type Directory interface {
    Path() string                      // 目錄路徑
    ReadDir() ([]FileInfo, error)      // 讀取目錄內容
    Create(name string) (File, error)  // 創建檔案
    Mkdir(name string) error           // 創建子目錄
    Remove(name string) error          // 刪除檔案/目錄
}

// 檔案系統介面
type FileSystem interface {
    OpenFile(path string, flag int, perm uint32) (File, error)
    Open(path string) (FileReader, error) // 唯讀方式開啟
    Stat(path string) (FileInfo, error)   // 檢查檔案狀態
    Remove(path string) error             // 刪除檔案
    Mkdir(path string, perm uint32) error // 創建目錄
}
```

</details>

### 實現介面組合的類型

接下來，讓我們實現上面設計的介面：

<details>
<summary>點擊展開程式碼</summary>

```go
// localfs.go
package filesys

import (
    "io"
    "os"
    "path/filepath"
    "time"
)

// 本地檔案實現
type LocalFile struct {
    file *os.File
}

// 實現 FileReader 介面
func (f *LocalFile) Read(p []byte) (n int, err error) {
    return f.file.Read(p)
}

func (f *LocalFile) Seek(offset int64, whence int) (int64, error) {
    return f.file.Seek(offset, whence)
}

func (f *LocalFile) Close() error {
    return f.file.Close()
}

func (f *LocalFile) Stat() (FileInfo, error) {
    info, err := f.file.Stat()
    if err != nil {
        return nil, err
    }
    return &LocalFileInfo{info}, nil
}

// 實現 FileWriter 介面
func (f *LocalFile) Write(p []byte) (n int, err error) {
    return f.file.Write(p)
}

func (f *LocalFile) Truncate(size int64) error {
    return f.file.Truncate(size)
}

func (f *LocalFile) Sync() error {
    return f.file.Sync()
}

// 實現 File 介面
func (f *LocalFile) Name() string {
    return f.file.Name()
}

// 本地檔案資訊實現
type LocalFileInfo struct {
    info os.FileInfo
}

func (i *LocalFileInfo) Name() string {
    return i.info.Name()
}

func (i *LocalFileInfo) Size() int64 {
    return i.info.Size()
}

func (i *LocalFileInfo) ModTime() time.Time {
    return i.info.ModTime()
}

func (i *LocalFileInfo) IsDir() bool {
    return i.info.IsDir()
}

// 本地檔案系統實現
type LocalFileSystem struct{}

func NewLocalFileSystem() FileSystem {
    return &LocalFileSystem{}
}

func (fs *LocalFileSystem) OpenFile(path string, flag int, perm uint32) (File, error) {
    file, err := os.OpenFile(path, flag, os.FileMode(perm))
    if err != nil {
        return nil, err
    }
    return &LocalFile{file}, nil
}

func (fs *LocalFileSystem) Open(path string) (FileReader, error) {
    file, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    return &LocalFile{file}, nil
}

func (fs *LocalFileSystem) Stat(path string) (FileInfo, error) {
    info, err := os.Stat(path)
    if err != nil {
        return nil, err
    }
    return &LocalFileInfo{info}, nil
}

func (fs *LocalFileSystem) Remove(path string) error {
    return os.Remove(path)
}

func (fs *LocalFileSystem) Mkdir(path string, perm uint32) error {
    return os.Mkdir(path, os.FileMode(perm))
}

// 本地目錄實現
type LocalDirectory struct {
    path string
    fs   *LocalFileSystem
}

func (fs *LocalFileSystem) OpenDir(path string) (Directory, error) {
    info, err := os.Stat(path)
    if err != nil {
        return nil, err
    }
    if !info.IsDir() {
        return nil, os.ErrNotExist
    }
    return &LocalDirectory{path, fs}, nil
}

func (d *LocalDirectory) Path() string {
    return d.path
}

func (d *LocalDirectory) ReadDir() ([]FileInfo, error) {
    entries, err := os.ReadDir(d.path)
    if err != nil {
        return nil, err
    }
    
    infos := make([]FileInfo, 0, len(entries))
    for _, entry := range entries {
        info, err := entry.Info()
        if err != nil {
            continue
        }
        infos = append(infos, &LocalFileInfo{info})
    }
    return infos, nil
}

func (d *LocalDirectory) Create(name string) (File, error) {
    path := filepath.Join(d.path, name)
    return d.fs.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0666)
}

func (d *LocalDirectory) Mkdir(name string) error {
    path := filepath.Join(d.path, name)
    return os.Mkdir(path, 0755)
}

func (d *LocalDirectory) Remove(name string) error {
    path := filepath.Join(d.path, name)
    return os.Remove(path)
}
```

</details>

### 使用介面組合系統

<details>
<summary>點擊展開程式碼</summary>

```go
// example.go
package main

import (
    "fmt"
    "io"
    "log"
    "os"
    
    "myapp/filesys" // 假設上面的代碼在此包中
)

func main() {
    // 創建檔案系統
    fs := filesys.NewLocalFileSystem()
    
    // 開啟或創建檔案
    file, err := fs.OpenFile("example.txt", os.O_RDWR|os.O_CREATE, 0666)
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()
    
    // 寫入資料
    data := []byte("Hello, 檔案系統介面！")
    if _, err := file.Write(data); err != nil {
        log.Fatal(err)
    }
    
    // 同步到磁碟
    if err := file.Sync(); err != nil {
        log.Fatal(err)
    }
    
    // 重置讀取位置
    if _, err := file.Seek(0, io.SeekStart); err != nil {
        log.Fatal(err)
    }
    
    // 讀取資料
    readData := make([]byte, 100)
    n, err := file.Read(readData)
    if err != nil && err != io.EOF {
        log.Fatal(err)
    }
    
    fmt.Printf("讀取到 %d 個位元組: %s\n", n, readData[:n])
    
    // 獲取檔案資訊
    info, err := file.Stat()
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("檔案名稱: %s\n", info.Name())
    fmt.Printf("檔案大小: %d 位元組\n", info.Size())
    fmt.Printf("修改時間: %v\n", info.ModTime())
    
    // 操作目錄
    if err := fs.Mkdir("testdir", 0755); err != nil && !os.IsExist(err) {
        log.Fatal(err)
    }
    
    dir, err := fs.(*filesys.LocalFileSystem).OpenDir("testdir")
    if err != nil {
        log.Fatal(err)
    }
    
    // 在目錄中創建檔案
    newFile, err := dir.Create("newfile.txt")
    if err != nil {
        log.Fatal(err)
    }
    defer newFile.Close()
    
    if _, err := newFile.Write([]byte("這是新檔案")); err != nil {
        log.Fatal(err)
    }
    
    // 列出目錄內容
    entries, err := dir.ReadDir()
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Println("目錄內容:")
    for _, entry := range entries {
        fmt.Printf("- %s (%d 位元組)\n", entry.Name(), entry.Size())
    }
}
```

</details>

### 介面組合的設計原則

1. **保持介面單一職責**：每個介面只專注於一個特定功能
2. **從小處著手**：先設計小型特定介面，再通過組合構建更複雜的介面
3. **考慮使用者視角**：設計介面時考慮使用者的需求和習慣
4. **避免方法衝突**：當組合多個介面時，確保不會有同名方法造成衝突
5. **遵循標準庫模式**：儘可能與標準庫中的介面保持一致的設計風格

## 實作：完整資料存取層

讓我們實作一個更完整的資料存取層，包括交易支援、查詢功能和資料庫連接管理。

### 定義基本介面

<details>
<summary>點擊展開程式碼</summary>

```go
// repository.go
package repository

import (
    "context"
    "errors"
    "time"
)

// 基本實體介面
type Entity interface {
    GetID() interface{}
}

// 查詢選項
type QueryOptions struct {
    Limit  int
    Offset int
    Sort   map[string]string // 欄位名 -> "asc"/"desc"
    Filter map[string]interface{}
}

// 儲存庫操作結果
type Result struct {
    RowsAffected int64
    LastInsertID interface{}
}

// 儲存庫交易介面
type Transaction interface {
    Commit() error
    Rollback() error
}

// 基本儲存庫介面
type Repository interface {
    // 查詢
    FindByID(ctx context.Context, id interface{}) (Entity, error)
    FindOne(ctx context.Context, filter map[string]interface{}) (Entity, error)
    FindAll(ctx context.Context, opts QueryOptions) ([]Entity, error)
    Count(ctx context.Context, filter map[string]interface{}) (int64, error)
    
    // 寫入
    Create(ctx context.Context, entity Entity) (*Result, error)
    Update(ctx context.Context, entity Entity) (*Result, error)
    Delete(ctx context.Context, id interface{}) (*Result, error)
    
    // 批次操作
    BulkCreate(ctx context.Context, entities []Entity) (*Result, error)
    BulkUpdate(ctx context.Context, entities []Entity) (*Result, error)
    BulkDelete(ctx context.Context, ids []interface{}) (*Result, error)
    
    // 交易
    BeginTransaction(ctx context.Context) (Transaction, error)
    
    // 其他
    Ping(ctx context.Context) error
    Close() error
}

// 定義常見錯誤
var (
    ErrNotFound      = errors.New("實體不存在")
    ErrAlreadyExists = errors.New("實體已存在")
    ErrInvalidEntity = errors.New("無效的實體")
    ErrQueryFailed   = errors.New("查詢失敗")
    ErrDBConnection  = errors.New("資料庫連接失敗")
)
```

</details>

### 用戶實體定義

<details>
<summary>點擊展開程式碼</summary>

```go
// user.go
package repository

import (
    "time"
)

// 用戶實體
type User struct {
    ID        int64      `db:"id" json:"id"`
    Username  string     `db:"username" json:"username"`
    Email     string     `db:"email" json:"email"`
    Password  string     `db:"password" json:"-"` // 禁止 JSON 輸出
    FirstName string     `db:"first_name" json:"first_name"`
    LastName  string     `db:"last_name" json:"last_name"`
    Active    bool       `db:"active" json:"active"`
    CreatedAt time.Time  `db:"created_at" json:"created_at"`
    UpdatedAt time.Time  `db:"updated_at" json:"updated_at"`
    DeletedAt *time.Time `db:"deleted_at" json:"deleted_at,omitempty"`
}

// 實作 Entity 介面
func (u User) GetID() interface{} {
    return u.ID
}

// 用戶儲存庫介面
type UserRepository interface {
    Repository // 嵌入基本儲存庫介面
    
    // 額外方法
    FindByUsername(ctx context.Context, username string) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    FindActive(ctx context.Context, opts QueryOptions) ([]*User, error)
    SetActive(ctx context.Context, id int64, active bool) error
    ChangePassword(ctx context.Context, id int64, password string) error
}
```

</details>

### SQL 資料庫實現

<details>
<summary>點擊展開程式碼</summary>

```go
// sql_user_repository.go
package repository

import (
    "context"
    "database/sql"
    "errors"
    "fmt"
    "strings"
    "time"
    
    "github.com/jmoiron/sqlx"
    _ "github.com/lib/pq" // PostgreSQL 驅動
)

// SQL 交易包裝
type SQLTransaction struct {
    tx *sqlx.Tx
}

func (t *SQLTransaction) Commit() error {
    return t.tx.Commit()
}

func (t *SQLTransaction) Rollback() error {
    return t.tx.Rollback()
}

// SQL 用戶儲存庫
type SQLUserRepository struct {
    db         *sqlx.DB
    tableName  string
    maxRetries int
}

// 建立 SQL 用戶儲存庫
func NewSQLUserRepository(driverName, dataSourceName, tableName string) (*SQLUserRepository, error) {
    db, err := sqlx.Connect(driverName, dataSourceName)
    if err != nil {
        return nil, fmt.Errorf("%w: %v", ErrDBConnection, err)
    }
    
    // 設定連接池
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)
    db.SetConnMaxLifetime(5 * time.Minute)
    
    return &SQLUserRepository{
        db:         db,
        tableName:  tableName,
        maxRetries: 3,
    }, nil
}

// 查詢單一用戶
func (r *SQLUserRepository) FindByID(ctx context.Context, id interface{}) (Entity, error) {
    var user User
    
    query := fmt.Sprintf("SELECT * FROM %s WHERE id = $1 AND deleted_at IS NULL", r.tableName)
    err := r.db.GetContext(ctx, &user, query, id)
    
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrNotFound
        }
        return nil, fmt.Errorf("%w: %v", ErrQueryFailed, err)
    }
    
    return &user, nil
}

// 根據條件查詢單一用戶
func (r *SQLUserRepository) FindOne(ctx context.Context, filter map[string]interface{}) (Entity, error) {
    if len(filter) == 0 {
        return nil, errors.New("必須提供至少一個過濾條件")
    }
    
    var user User
    
    // 建構查詢
    conditions := make([]string, 0, len(filter))
    args := make([]interface{}, 0, len(filter))
    i := 1
    
    for key, value := range filter {
        conditions = append(conditions, fmt.Sprintf("%s = $%d", key, i))
        args = append(args, value)
        i++
    }
    
    // 添加刪除條件
    conditions = append(conditions, "deleted_at IS NULL")
    
    query := fmt.Sprintf(
        "SELECT * FROM %s WHERE %s LIMIT 1",
        r.tableName,
        strings.Join(conditions, " AND "),
    )
    
    err := r.db.GetContext(ctx, &user, query, args...)
    
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrNotFound
        }
        return nil, fmt.Errorf("%w: %v", ErrQueryFailed, err)
    }
    
    return &user, nil
}

// 查詢用戶列表
func (r *SQLUserRepository) FindAll(ctx context.Context, opts QueryOptions) ([]Entity, error) {
    // 過濾條件
    whereClause := "deleted_at IS NULL"
    args := make([]interface{}, 0)
    paramIndex := 1
    
    if len(opts.Filter) > 0 {
        conditions := make([]string, 0, len(opts.Filter))
        
        for key, value := range opts.Filter {
            conditions = append(conditions, fmt.Sprintf("%s = $%d", key, paramIndex))
            args = append(args, value)
            paramIndex++
        }
        
        if len(conditions) > 0 {
            whereClause = fmt.Sprintf("%s AND %s", whereClause, strings.Join(conditions, " AND "))
        }
    }
    
    // 排序
    orderClause := ""
    if len(opts.Sort) > 0 {
        orders := make([]string, 0, len(opts.Sort))
        
        for field, direction := range opts.Sort {
            orders = append(orders, fmt.Sprintf("%s %s", field, direction))
        }
        
        orderClause = fmt.Sprintf("ORDER BY %s", strings.Join(orders, ", "))
    } else {
        // 預設排序
        orderClause = "ORDER BY id ASC"
    }
    
    // 分頁
    limitClause := ""
    if opts.Limit > 0 {
        limitClause = fmt.Sprintf("LIMIT $%d", paramIndex)
        args = append(args, opts.Limit)
        paramIndex++
        
        if opts.Offset > 0 {
            limitClause = fmt.Sprintf("%s OFFSET $%d", limitClause, paramIndex)
            args = append(args, opts.Offset)
        }
    }
    
    // 完整查詢
    query := fmt.Sprintf(
        "SELECT * FROM %s WHERE %s %s %s",
        r.tableName,
        whereClause,
        orderClause,
        limitClause,
    )
    
    var users []User
    if err := r.db.SelectContext(ctx, &users, query, args...); err != nil {
        return nil, fmt.Errorf("%w: %v", ErrQueryFailed, err)
    }
    
    // 轉換為 Entity 切片
    result := make([]Entity, len(users))
    for i := range users {
        result[i] = &users[i]
    }
    
    return result, nil
}

// 計數
func (r *SQLUserRepository) Count(ctx context.Context, filter map[string]interface{}) (int64, error) {
    // 過濾條件
    whereClause := "deleted_at IS NULL"
    args := make([]interface{}, 0)
    paramIndex := 1
    
    if len(filter) > 0 {
        conditions := make([]string, 0, len(filter))
        
        for key, value := range filter {
            conditions = append(conditions, fmt.Sprintf("%s = $%d", key, paramIndex))
            args = append(args, value)
            paramIndex++
        }
        
        if len(conditions) > 0 {
            whereClause = fmt.Sprintf("%s AND %s", whereClause, strings.Join(conditions, " AND "))
        }
    }
    
    // 查詢
    query := fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE %s", r.tableName, whereClause)
    
    var count int64
    if err := r.db.GetContext(ctx, &count, query, args...); err != nil {
        return 0, fmt.Errorf("%w: %v", ErrQueryFailed, err)
    }
    
    return count, nil
}

// 建立用戶
func (r *SQLUserRepository) Create(ctx context.Context, entity Entity) (*Result, error) {
    user, ok := entity.(*User)
    if !ok {
        return nil, ErrInvalidEntity
    }
    
    // 設置創建時間和更新時間
    now := time.Now()
    user.CreatedAt = now
    user.UpdatedAt = now
    
    // 插入查詢
    query := fmt.Sprintf(`
        INSERT INTO %s (
            username, email, password, first_name, last_name, 
            active, created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8
        ) RETURNING id
    `, r.tableName)
    
    var id int64
    err := r.db.QueryRowContext(
        ctx,
        query,
        user.Username,
        user.Email,
        user.Password,
        user.FirstName,
        user.LastName,
        user.Active,
        user.CreatedAt,
        user.UpdatedAt,
    ).Scan(&id)
    
    if err != nil {
        return nil, fmt.Errorf("創建用戶失敗: %w", err)
    }
    
    user.ID = id
    return &Result{
        RowsAffected: 1,
        LastInsertID: id,
    }, nil
}

// 更新用戶
func (r *SQLUserRepository) Update(ctx context.Context, entity Entity) (*Result, error) {
    user, ok := entity.(*User)
    if !ok {
        return nil, ErrInvalidEntity
    }
    
    // 更新時間
    user.UpdatedAt = time.Now()
    
    // 更新查詢
    query := fmt.Sprintf(`
        UPDATE %s SET
            username = $1,
            email = $2,
            first_name = $3,
            last_name = $4,
            active = $5,
            updated_at = $6
        WHERE id = $7 AND deleted_at IS NULL
    `, r.tableName)
    
    result, err := r.db.ExecContext(
        ctx,
        query,
        user.Username,
        user.Email,
        user.FirstName,
        user.LastName,
        user.Active,
        user.UpdatedAt,
        user.ID,
    )
    
    if err != nil {
        return nil, fmt.Errorf("更新用戶失敗: %w", err)
    }
    
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return nil, err
    }
    
    if rowsAffected == 0 {
        return nil, ErrNotFound
    }
    
    return &Result{
        RowsAffected: rowsAffected,
        LastInsertID: user.ID,
    }, nil
}

// 刪除用戶 (軟刪除)
func (r *SQLUserRepository) Delete(ctx context.Context, id interface{}) (*Result, error) {
    now := time.Now()
    
    query := fmt.Sprintf(
        "UPDATE %s SET deleted_at = $1 WHERE id = $2 AND deleted_at IS NULL",
        r.tableName,
    )
    
    result, err := r.db.ExecContext(ctx, query, now, id)
    if err != nil {
        return nil, fmt.Errorf("刪除用戶失敗: %w", err)
    }
    
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return nil, err
    }
    
    if rowsAffected == 0 {
        return nil, ErrNotFound
    }
    
    return &Result{
        RowsAffected: rowsAffected,
    }, nil
}

// 批次創建
func (r *SQLUserRepository) BulkCreate(ctx context.Context, entities []Entity) (*Result, error) {
    if len(entities) == 0 {
        return &Result{RowsAffected: 0}, nil
    }
    
    tx, err := r.db.BeginTxx(ctx, nil)
    if err != nil {
        return nil, fmt.Errorf("開始交易失敗: %w", err)
    }
    defer tx.Rollback()
    
    now := time.Now()
    totalAffected := int64(0)
    
    for _, entity := range entities {
        user, ok := entity.(*User)
        if !ok {
            return nil, ErrInvalidEntity
        }
        
        user.CreatedAt = now
        user.UpdatedAt = now
        
        query := fmt.Sprintf(`
            INSERT INTO %s (
                username, email, password, first_name, last_name, 
                active, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8
            ) RETURNING id
        `, r.tableName)
        
        var id int64
        err := tx.QueryRowContext(
            ctx,
            query,
            user.Username,
            user.Email,
            user.Password,
            user.FirstName,
            user.LastName,
            user.Active,
            user.CreatedAt,
            user.UpdatedAt,
        ).Scan(&id)
        
        if err != nil {
            return nil, fmt.Errorf("批次創建用戶失敗: %w", err)
        }
        
        user.ID = id
        totalAffected++
    }
    
    if err := tx.Commit(); err != nil {
        return nil, fmt.Errorf("提交交易失敗: %w", err)
    }
    
    return &Result{
        RowsAffected: totalAffected,
    }, nil
}

// 批次更新
func (r *SQLUserRepository) BulkUpdate(ctx context.Context, entities []Entity) (*Result, error) {
    if len(entities) == 0 {
        return &Result{RowsAffected: 0}, nil
    }
    
    tx, err := r.db.BeginTxx(ctx, nil)
    if err != nil {
        return nil, fmt.Errorf("開始交易失敗: %w", err)
    }
    defer tx.Rollback()
    
    now := time.Now()
    totalAffected := int64(0)
    
    for _, entity := range entities {
        user, ok := entity.(*User)
        if !ok {
            return nil, ErrInvalidEntity
        }
        
        user.UpdatedAt = now
        
        query := fmt.Sprintf(`
            UPDATE %s SET
                username = $1,
                email = $2,
                first_name = $3,
                last_name = $4,
                active = $5,
                updated_at = $6
            WHERE id = $7 AND deleted_at IS NULL
        `, r.tableName)
        
        result, err := tx.ExecContext(
            ctx,
            query,
            user.Username,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Active,
            user.UpdatedAt,
            user.ID,
        )
        
        if err != nil {
            return nil, fmt.Errorf("批次更新用戶失敗: %w", err)
        }
        
        rowsAffected, err := result.RowsAffected()
        if err != nil {
            return nil, err
        }
        
        totalAffected += rowsAffected
    }
    
    if err := tx.Commit(); err != nil {
        return nil, fmt.Errorf("提交交易失敗: %w", err)
    }
    
    return &Result{
        RowsAffected: totalAffected,
    }, nil
}

// 批次刪除
func (r *SQLUserRepository) BulkDelete(ctx context.Context, ids []interface{}) (*Result, error) {
    if len(ids) == 0 {
        return &Result{RowsAffected: 0}, nil
    }
    
    // 構建 IN 條件的參數
    placeholders := make([]string, len(ids))
    args := make([]interface{}, len(ids))
    
    for i, id := range ids {
        placeholders[i] = fmt.Sprintf("$%d", i+2) // $2, $3, ...
        args[i] = id
    }
    
    now := time.Now()
    args = append([]interface{}{now}, args...) // now as $1
    
    query := fmt.Sprintf(
        "UPDATE %s SET deleted_at = $1 WHERE id IN (%s) AND deleted_at IS NULL",
        r.tableName,
        strings.Join(placeholders, ", "),
    )
    
    result, err := r.db.ExecContext(ctx, query, args...)
    if err != nil {
        return nil, fmt.Errorf("批次刪除用戶失敗: %w", err)
    }
    
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return nil, err
    }
    
    return &Result{
        RowsAffected: rowsAffected,
    }, nil
}

// 開始交易
func (r *SQLUserRepository) BeginTransaction(ctx context.Context) (Transaction, error) {
    tx, err := r.db.BeginTxx(ctx, nil)
    if err != nil {
        return nil, fmt.Errorf("開始交易失敗: %w", err)
    }
    
    return &SQLTransaction{tx}, nil
}

// 根據用戶名查詢
func (r *SQLUserRepository) FindByUsername(ctx context.Context, username string) (*User, error) {
    var user User
    
    query := fmt.Sprintf(
        "SELECT * FROM %s WHERE username = $1 AND deleted_at IS NULL",
        r.tableName,
    )
    
    err := r.db.GetContext(ctx, &user, query, username)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrNotFound
        }
        return nil, fmt.Errorf("%w: %v", ErrQueryFailed, err)
    }
    
    return &user, nil
}

// 根據電子郵件查詢
func (r *SQLUserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
    var user User
    
    query := fmt.Sprintf(
        "SELECT * FROM %s WHERE email = $1 AND deleted_at IS NULL",
        r.tableName,
    )
    
    err := r.db.GetContext(ctx, &user, query, email)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrNotFound
        }
        return nil, fmt.Errorf("%w: %v", ErrQueryFailed, err)
    }
    
    return &user, nil
}

// 查詢活躍用戶
func (r *SQLUserRepository) FindActive(ctx context.Context, opts QueryOptions) ([]*User, error) {
    // 確保過濾條件包含 active = true
    if opts.Filter == nil {
        opts.Filter = make(map[string]interface{})
    }
    opts.Filter["active"] = true
    
    entities, err := r.FindAll(ctx, opts)
    if err != nil {
        return nil, err
    }
    
    // 轉換為 *User 切片
    users := make([]*User, len(entities))
    for i, entity := range entities {
        user, ok := entity.(*User)
        if !ok {
            return nil, ErrInvalidEntity
        }
        users[i] = user
    }
    
    return users, nil
}

// 設置用戶活躍狀態
func (r *SQLUserRepository) SetActive(ctx context.Context, id int64, active bool) error {
    query := fmt.Sprintf(
        "UPDATE %s SET active = $1, updated_at = $2 WHERE id = $3 AND deleted_at IS NULL",
        r.tableName,
    )
    
    result, err := r.db.ExecContext(ctx, query, active, time.Now(), id)
    if err != nil {
        return fmt.Errorf("更新用戶活躍狀態失敗: %w", err)
    }
    
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return err
    }
    
    if rowsAffected == 0 {
        return ErrNotFound
    }
    
    return nil
}

// 修改密碼
func (r *SQLUserRepository) ChangePassword(ctx context.Context, id int64, password string) error {
    if password == "" {
        return errors.New("密碼不能為空")
    }
    
    query := fmt.Sprintf(
        "UPDATE %s SET password = $1, updated_at = $2 WHERE id = $3 AND deleted_at IS NULL",
        r.tableName,
    )
    
    result, err := r.db.ExecContext(ctx, query, password, time.Now(), id)
    if err != nil {
        return fmt.Errorf("更新密碼失敗: %w", err)
    }
    
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return err
    }
    
    if rowsAffected == 0 {
        return ErrNotFound
    }
    
    return nil
}

// 檢查資料庫連線
func (r *SQLUserRepository) Ping(ctx context.Context) error {
    return r.db.PingContext(ctx)
}

// 關閉資料庫連線
func (r *SQLUserRepository) Close() error {
    return r.db.Close()
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
    "context"
    "fmt"
    "log"
    "time"
    
    "myapp/repository" // 假設上面的代碼在此包中
)

func main() {
    // 建立儲存庫
    userRepo, err := repository.NewSQLUserRepository("postgres", "postgres://user:password@localhost/mydb?sslmode=disable", "users")
    if err != nil {
        log.Fatalf("初始化儲存庫失敗: %v", err)
    }
    defer userRepo.Close()
    
    ctx := context.Background()
    
    // 檢查連線
    if err := userRepo.Ping(ctx); err != nil {
        log.Fatalf("資料庫連線檢查失敗: %v", err)
    }
    
    // 建立用戶
    user := &repository.User{
        Username:  "john_doe",
        Email:     "john.doe@example.com",
        Password:  "hashed_password", // 實際使用時應進行適當的密碼雜湊
        FirstName: "John",
        LastName:  "Doe",
        Active:    true,
    }
    
    result, err := userRepo.Create(ctx, user)
    if err != nil {
        log.Fatalf("創建用戶失敗: %v", err)
    }
    
    fmt.Printf("用戶已創建，ID: %v\n", result.LastInsertID)
    
    // 查詢用戶
    retrievedEntity, err := userRepo.FindByID(ctx, user.ID)
    if err != nil {
        log.Fatalf("查詢用戶失敗: %v", err)
    }
    
    retrievedUser, ok := retrievedEntity.(*repository.User)
    if !ok {
        log.Fatalf("無效的返回類型")
    }
    
    fmt.Printf("查詢到用戶: %s %s (%s)\n", retrievedUser.FirstName, retrievedUser.LastName, retrievedUser.Email)
    
    // 更新用戶
    retrievedUser.FirstName = "Johnny"
    retrievedUser.LastName = "Doeson"
    
    if _, err := userRepo.Update(ctx, retrievedUser); err != nil {
        log.Fatalf("更新用戶失敗: %v", err)
    }
    
    fmt.Println("用戶已更新")
    
    // 根據用戶名查詢
    userByName, err := userRepo.FindByUsername(ctx, "john_doe")
    if err != nil {
        log.Fatalf("根據用戶名查詢失敗: %v", err)
    }
    
    fmt.Printf("根據用戶名查詢: %s %s\n", userByName.FirstName, userByName.LastName)
    
    // 使用交易
    tx, err := userRepo.BeginTransaction(ctx)
    if err != nil {
        log.Fatalf("開始交易失敗: %v", err)
    }
    
    // 在實際專案中，這裡會有一系列操作
    // 如果出現錯誤，則回滾交易
    
    // 提交交易
    if err := tx.Commit(); err != nil {
        log.Fatalf("提交交易失敗: %v", err)
    }
    
    // 刪除用戶
    if _, err := userRepo.Delete(ctx, user.ID); err != nil {
        log.Fatalf("刪除用戶失敗: %v", err)
    }
    
    fmt.Println("用戶已刪除")
    
    // 列出所有用戶
    users, err := userRepo.FindAll(ctx, repository.QueryOptions{
        Limit:  10,
        Offset: 0,
        Sort: map[string]string{
            "created_at": "desc",
        },
    })
    
    if err != nil {
        log.Fatalf("查詢所有用戶失敗: %v", err)
    }
    
    fmt.Println("用戶列表:")
    for i, entity := range users {
        if user, ok := entity.(*repository.User); ok {
            fmt.Printf("%d. %s %s (%s)\n", i+1, user.FirstName, user.LastName, user.Email)
        }
    }
    
    // 計數
    count, err := userRepo.Count(ctx, map[string]interface{}{
        "active": true,
    })
    
    if err != nil {
        log.Fatalf("計數失敗: %v", err)
    }
    
    fmt.Printf("活躍用戶數: %d\n", count)
}
```

</details>

### 使用 Mock 進行單元測試

<details>
<summary>點擊展開程式碼</summary>

```go
// repository_mock.go
package repository

import (
    "context"
    "errors"
    "sync"
)

// 模擬用戶儲存庫
type MockUserRepository struct {
    users      map[int64]*User
    lastID     int64
    mu         sync.RWMutex
    mockErrors map[string]error
}

// 建立模擬儲存庫
func NewMockUserRepository() *MockUserRepository {
    return &MockUserRepository{
        users:      make(map[int64]*User),
        lastID:     0,
        mockErrors: make(map[string]error),
    }
}

// 設置模擬錯誤
func (r *MockUserRepository) SetError(method string, err error) {
    r.mockErrors[method] = err
}

// 清除模擬錯誤
func (r *MockUserRepository) ClearErrors() {
    r.mockErrors = make(map[string]error)
}

// 查詢用戶
func (r *MockUserRepository) FindByID(ctx context.Context, id interface{}) (Entity, error) {
    if err := r.mockErrors["FindByID"]; err != nil {
        return nil, err
    }
    
    r.mu.RLock()
    defer r.mu.RUnlock()
    
    userID, ok := id.(int64)
    if !ok {
        return nil, errors.New("ID 必須是 int64 類型")
    }
    
    user, exists := r.users[userID]
    if !exists || user.DeletedAt != nil {
        return nil, ErrNotFound
    }
    
    // 創建副本
    userCopy := *user
    return &userCopy, nil
}

// 根據條件查詢
func (r *MockUserRepository) FindOne(ctx context.Context, filter map[string]interface{}) (Entity, error) {
    if err := r.mockErrors["FindOne"]; err != nil {
        return nil, err
    }
    
    r.mu.RLock()
    defer r.mu.RUnlock()
    
    for _, user := range r.users {
        if user.DeletedAt != nil {
            continue
        }
        
        match := true
        for key, value := range filter {
            switch key {
            case "username":
                if user.Username != value.(string) {
                    match = false
                }
            case "email":
                if user.Email != value.(string) {
                    match = false
                }
            case "active":
                if user.Active != value.(bool) {
                    match = false
                }
            // 添加其他欄位
            }
            
            if !match {
                break
            }
        }
        
        if match {
            userCopy := *user
            return &userCopy, nil
        }
    }
    
    return nil, ErrNotFound
}

// 查詢所有用戶
func (r *MockUserRepository) FindAll(ctx context.Context, opts QueryOptions) ([]Entity, error) {
    if err := r.mockErrors["FindAll"]; err != nil {
        return nil, err
    }
    
    r.mu.RLock()
    defer r.mu.RUnlock()
    
    var results []Entity
    for _, user := range r.users {
        if user.DeletedAt != nil {
            continue
        }
        
        // 應用過濾條件
        match := true
        for key, value := range opts.Filter {
            switch key {
            case "active":
                if user.Active != value.(bool) {
                    match = false
                }
            // 可以添加其他過濾條件
            }
            
            if !match {
                break
            }
        }
        
        if match {
            userCopy := *user
            results = append(results, &userCopy)
        }
    }
    
    // 這裡可以添加排序和分頁邏輯
    
    return results, nil
}

// 計數
func (r *MockUserRepository) Count(ctx context.Context, filter map[string]interface{}) (int64, error) {
    if err := r.mockErrors["Count"]; err != nil {
        return 0, err
    }
    
    entities, err := r.FindAll(ctx, QueryOptions{Filter: filter})
    if err != nil {
        return 0, err
    }
    
    return int64(len(entities)), nil
}

// 建立用戶
func (r *MockUserRepository) Create(ctx context.Context, entity Entity) (*Result, error) {
    if err := r.mockErrors["Create"]; err != nil {
        return nil, err
    }
    
    user, ok := entity.(*User)
    if !ok {
        return nil, ErrInvalidEntity
    }
    
    r.mu.Lock()
    defer r.mu.Unlock()
    
    // 檢查用戶名和電子郵件是否已存在
    for _, existingUser := range r.users {
        if existingUser.DeletedAt != nil {
            continue
        }
        
        if existingUser.Username == user.Username {
            return nil, errors.New("用戶名已存在")
        }
        
        if existingUser.Email == user.Email {
            return nil, errors.New("電子郵件已存在")
        }
    }
    
    // 分配新 ID
    r.lastID++
    user.ID = r.lastID
    
    // 儲存副本
    userCopy := *user
    r.users[user.ID] = &userCopy
    
    return &Result{
        RowsAffected: 1,
        LastInsertID: user.ID,
    }, nil
}

// 更新用戶
func (r *MockUserRepository) Update(ctx context.Context, entity Entity) (*Result, error) {
    if err := r.mockErrors["Update"]; err != nil {
        return nil, err
    }
    
    user, ok := entity.(*User)
    if !ok {
        return nil, ErrInvalidEntity
    }
    
    r.mu.Lock()
    defer r.mu.Unlock()
    
    existingUser, exists := r.users[user.ID]
    if !exists || existingUser.DeletedAt != nil {
        return nil, ErrNotFound
    }
    
    // 檢查用戶名和電子郵件是否與其他用戶衝突
    for id, otherUser := range r.users {
        if id == user.ID || otherUser.DeletedAt != nil {
            continue
        }
        
        if otherUser.Username == user.Username {
            return nil, errors.New("用戶名已存在")
        }
        
        if otherUser.Email == user.Email {
            return nil, errors.New("電子郵件已存在")
        }
    }
    
    // 保存副本
    userCopy := *user
    r.users[user.ID] = &userCopy
    
    return &Result{
        RowsAffected: 1,
        LastInsertID: user.ID,
    }, nil
}

// 刪除用戶
func (r *MockUserRepository) Delete(ctx context.Context, id interface{}) (*Result, error) {
    if err := r.mockErrors["Delete"]; err != nil {
        return nil, err
    }
    
    r.mu.Lock()
    defer r.mu.Unlock()
    
    userID, ok := id.(int64)
    if !ok {
        return nil, errors.New("ID 必須是 int64 類型")
    }
    
    user, exists := r.users[userID]
    if !exists || user.DeletedAt != nil {
        return nil, ErrNotFound
    }
    
    // 軟刪除
    now := NowFunc()
    user.DeletedAt = &now
    
    return &Result{
        RowsAffected: 1,
    }, nil
}

// 批次創建
func (r *MockUserRepository) BulkCreate(ctx context.Context, entities []Entity) (*Result, error) {
    if err := r.mockErrors["BulkCreate"]; err != nil {
        return nil, err
    }
    
    rowsAffected := int64(0)
    for _, entity := range entities {
        if _, err := r.Create(ctx, entity); err != nil {
            return nil, err
        }
        rowsAffected++
    }
    
    return &Result{
        RowsAffected: rowsAffected,
    }, nil
}

// 批次更新
func (r *MockUserRepository) BulkUpdate(ctx context.Context, entities []Entity) (*Result, error) {
    if err := r.mockErrors["BulkUpdate"]; err != nil {
        return nil, err
    }
    
    rowsAffected := int64(0)
    for _, entity := range entities {
        if _, err := r.Update(ctx, entity); err != nil {
            return nil, err
        }
        rowsAffected++
    }
    
    return &Result{
        RowsAffected: rowsAffected,
    }, nil
}

// 批次刪除
func (r *MockUserRepository) BulkDelete(ctx context.Context, ids []interface{}) (*Result, error) {
    if err := r.mockErrors["BulkDelete"]; err != nil {
        return nil, err
    }
    
    rowsAffected := int64(0)
    for _, id := range ids {
        if _, err := r.Delete(ctx, id); err != nil {
            return nil, err
        }
        rowsAffected++
    }
    
    return &Result{
        RowsAffected: rowsAffected,
    }, nil
}

// 開始交易 (模擬實現)
func (r *MockUserRepository) BeginTransaction(ctx context.Context) (Transaction, error) {
    if err := r.mockErrors["BeginTransaction"]; err != nil {
        return nil, err
    }
    
    return &MockTransaction{}, nil
}

// 根據用戶名查詢
func (r *MockUserRepository) FindByUsername(ctx context.Context, username string) (*User, error) {
    if err := r.mockErrors["FindByUsername"]; err != nil {
        return nil, err
    }
    
    entity, err := r.FindOne(ctx, map[string]interface{}{
        "username": username,
    })
    
    if err != nil {
        return nil, err
    }
    
    user, ok := entity.(*User)
    if !ok {
        return nil, ErrInvalidEntity
    }
    
    return user, nil
}

// 根據電子郵件查詢
func (r *MockUserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
    if err := r.mockErrors["FindByEmail"]; err != nil {
        return nil, err
    }
    
    entity, err := r.FindOne(ctx, map[string]interface{}{
        "email": email,
    })
    
    if err != nil {
        return nil, err
    }
    
    user, ok := entity.(*User)
    if !ok {
        return nil, ErrInvalidEntity
    }
    
    return user, nil
}

// 查詢活躍用戶
func (r *MockUserRepository) FindActive(ctx context.Context, opts QueryOptions) ([]*User, error) {
    if err := r.mockErrors["FindActive"]; err != nil {
        return nil, err
    }
    
    if opts.Filter == nil {
        opts.Filter = make(map[string]interface{})
    }
    opts.Filter["active"] = true
    
    entities, err := r.FindAll(ctx, opts)
    if err != nil {
        return nil, err
    }
    
    users := make([]*User, len(entities))
    for i, entity := range entities {
        user, ok := entity.(*User)
        if !ok {
            return nil, ErrInvalidEntity
        }
        users[i] = user
    }
    
    return users, nil
}

// 設置用戶活躍狀態
func (r *MockUserRepository) SetActive(ctx context.Context, id int64, active bool) error {
    if err := r.mockErrors["SetActive"]; err != nil {
        return err
    }
    
    r.mu.Lock()
    defer r.mu.Unlock()
    
    user, exists := r.users[id]
    if !exists || user.DeletedAt != nil {
        return ErrNotFound
    }
    
    user.Active = active
    user.UpdatedAt = NowFunc()
    
    return nil
}

// 修改密碼
func (r *MockUserRepository) ChangePassword(ctx context.Context, id int64, password string) error {
    if err := r.mockErrors["ChangePassword"]; err != nil {
        return err
    }
    
    if password == "" {
        return errors.New("密碼不能為空")
    }
    
    r.mu.Lock()
    defer r.mu.Unlock()
    
    user, exists := r.users[id]
    if !exists || user.DeletedAt != nil {
        return ErrNotFound
    }
    
    user.Password = password
    user.UpdatedAt = NowFunc()
    
    return nil
}

// 檢查連線 (模擬)
func (r *MockUserRepository) Ping(ctx context.Context) error {
    return r.mockErrors["Ping"]
}

// 關閉 (模擬)
func (r *MockUserRepository) Close() error {
    return r.mockErrors["Close"]
}

// 模擬交易
type MockTransaction struct {
    committed bool
    rolledBack bool
}

func (t *MockTransaction) Commit() error {
    t.committed = true
    return nil
}

func (t *MockTransaction) Rollback() error {
    t.rolledBack = true
    return nil
}

// 用於測試的時間函數
var NowFunc = time.Now
```

</details>

### 單元測試範例

<details>
<summary>點擊展開程式碼</summary>

```go
// user_repository_test.go
package repository_test

import (
    "context"
    "testing"
    "time"
    
    "myapp/repository" // 假設上面的代碼在此包中
)

func TestMockUserRepository_CRUD(t *testing.T) {
    // 建立儲存庫
    repo := repository.NewMockUserRepository()
    ctx := context.Background()
    
    // 建立用戶
    user := &repository.User{
        Username:  "testuser",
        Email:     "test@example.com",
        Password:  "password123",
        FirstName: "Test",
        LastName:  "User",
        Active:    true,
    }
    
    // 測試創建
    result, err := repo.Create(ctx, user)
    if err != nil {
        t.Fatalf("創建用戶失敗: %v", err)
    }
    
    if result.RowsAffected != 1 {
        t.Errorf("預期影響 1 行，實際為 %d", result.RowsAffected)
    }
    
    if user.ID <= 0 {
        t.Errorf("用戶 ID 應大於 0，實際為 %d", user.ID)
    }
    
    // 測試查詢
    retrievedEntity, err := repo.FindByID(ctx, user.ID)
    if err != nil {
        t.Fatalf("查詢用戶失敗: %v", err)
    }
    
    retrievedUser, ok := retrievedEntity.(*repository.User)
    if !ok {
        t.Fatalf("返回類型錯誤")
    }
    
    if retrievedUser.Username != user.Username {
        t.Errorf("預期用戶名為 %s，實際為 %s", user.Username, retrievedUser.Username)
    }
    
    // 測試更新
    retrievedUser.FirstName = "Updated"
    retrievedUser.LastName = "Name"
    
    updateResult, err := repo.Update(ctx, retrievedUser)
    if err != nil {
        t.Fatalf("更新用戶失敗: %v", err)
    }
    
    if updateResult.RowsAffected != 1 {
        t.Errorf("預期影響 1 行，實際為 %d", updateResult.RowsAffected)
    }
    
    // 驗證更新
    updatedEntity, _ := repo.FindByID(ctx, user.ID)
    updatedUser := updatedEntity.(*repository.User)
    
    if updatedUser.FirstName != "Updated" || updatedUser.LastName != "Name" {
        t.Errorf("用戶未正確更新")
    }
    
    // 根據用戶名查詢
    userByName, err := repo.FindByUsername(ctx, user.Username)
    if err != nil {
        t.Fatalf("根據用戶名查詢失敗: %v", err)
    }
    
    if userByName.ID != user.ID {
        t.Errorf("查詢到錯誤的用戶")
    }
    
    // 根據電子郵件查詢
    userByEmail, err := repo.FindByEmail(ctx, user.Email)
    if err != nil {
        t.Fatalf("根據電子郵件查詢失敗: %v", err)
    }
    
    if userByEmail.ID != user.ID {
        t.Errorf("查詢到錯誤的用戶")
    }
    
    // 測試刪除
    deleteResult, err := repo.Delete(ctx, user.ID)
    if err != nil {
        t.Fatalf("刪除用戶失敗: %v", err)
    }
    
    if deleteResult.RowsAffected != 1 {
        t.Errorf("預期影響 1 行，實際為 %d", deleteResult.RowsAffected)
    }
    
    // 驗證刪除
    _, err = repo.FindByID(ctx, user.ID)
    if err != repository.ErrNotFound {
        t.Errorf("預期錯誤 %v，實際為 %v", repository.ErrNotFound, err)
    }
}

func TestMockUserRepository_QueryOperations(t *testing.T) {
    // 建立儲存庫
    repo := repository.NewMockUserRepository()
    ctx := context.Background()
    
    // 建立一些測試數據
    users := []repository.User{
        {
            Username:  "user1",
            Email:     "user1@example.com",
            Password:  "pass1",
            FirstName: "First1",
            LastName:  "Last1",
            Active:    true,
        },
        {
            Username:  "user2",
            Email:     "user2@example.com",
            Password:  "pass2",
            FirstName: "First2",
            LastName:  "Last2",
            Active:    true,
        },
        {
            Username:  "user3",
            Email:     "user3@example.com",
            Password:  "pass3",
            FirstName: "First3",
            LastName:  "Last3",
            Active:    false,
        },
    }
    
    // 插入測試數據
    for _, user := range users {
        userCopy := user
        repo.Create(ctx, &userCopy)
    }
    
    // 測試 FindAll
    allUsers, err := repo.FindAll(ctx, repository.QueryOptions{})
    if err != nil {
        t.Fatalf("FindAll 失敗: %v", err)
    }
    
    if len(allUsers) != 3 {
        t.Errorf("預期查詢到 3 個用戶，實際為 %d", len(allUsers))
    }
    
    // 測試 Count
    count, err := repo.Count(ctx, nil)
    if err != nil {
        t.Fatalf("Count 失敗: %v", err)
    }
    
    if count != 3 {
        t.Errorf("預期計數為 3，實際為 %d", count)
    }
    
    // 測試過濾查詢
    activeUsers, err := repo.FindAll(ctx, repository.QueryOptions{
        Filter: map[string]interface{}{
            "active": true,
        },
    })
    
    if err != nil {
        t.Fatalf("過濾查詢失敗: %v", err)
    }
    
    if len(activeUsers) != 2 {
        t.Errorf("預期查詢到 2 個活躍用戶，實際為 %d", len(activeUsers))
    }
    
    // 測試 FindActive
    activeUsersList, err := repo.FindActive(ctx, repository.QueryOptions{})
    if err != nil {
        t.Fatalf("FindActive 失敗: %v", err)
    }
    
    if len(activeUsersList) != 2 {
        t.Errorf("預期 FindActive 返回 2 個用戶，實際為 %d", len(activeUsersList))
    }
    
    // 測試 SetActive
    firstUserID := activeUsersList[0].ID
    err = repo.SetActive(ctx, firstUserID, false)
    if err != nil {
        t.Fatalf("SetActive 失敗: %v", err)
    }
    
    // 驗證狀態更新
    updatedUser, _ := repo.FindByID(ctx, firstUserID)
    if updatedUser.(*repository.User).Active {
        t.Errorf("SetActive 未正確更新狀態")
    }
    
    // 再次計數活躍用戶
    activeCount, _ := repo.Count(ctx, map[string]interface{}{"active": true})
    if activeCount != 1 {
        t.Errorf("預期活躍用戶計數為 1，實際為 %d", activeCount)
    }
}

func TestMockUserRepository_Errors(t *testing.T) {
    // 建立儲存庫
    repo := repository.NewMockUserRepository()
    ctx := context.Background()
    
    // 設置模擬錯誤
    expectedError := repository.ErrDBConnection
    repo.SetError("FindByID", expectedError)
    
    // 測試錯誤處理
    _, err := repo.FindByID(ctx, int64(1))
    if err != expectedError {
        t.Errorf("預期錯誤 %v，實際為 %v", expectedError, err)
    }
    
    // 清除錯誤並確認
    repo.ClearErrors()
    _, err = repo.FindByID(ctx, int64(1))
    if err != repository.ErrNotFound {
        t.Errorf("預期錯誤 %v，實際為 %v", repository.ErrNotFound, err)
    }
}
```

</details>

## 總結

在本文中，我們深入探討了 Go 語言的進階介面應用，包括：

1. **型別斷言（Type Assertion）**
   - 學習了如何從介面值中安全地獲取具體類型
   - 掌握了型別選擇（type switch）的使用方法
   - 了解了型別斷言的常見錯誤和最佳實踐

2. **介面組合（Interface Composition）**
   - 學習了如何通過組合小型介面構建更強大的介面
   - 探討了標準庫中的介面組合實例
   - 設計並實現了一個檔案系統介面

3. **完整資料存取層實現**
   - 設計了完整的資料存取層介面
   - 實現了基於 SQL 資料庫的儲存庫
   - 提供了模擬儲存庫用於單元測試
   - 實現了交易支援和批次操作

通過深入理解這些進階介面概念，我們可以在 Go 中設計更靈活、更可維護的程式碼。介面是 Go 語言最強大的特性之一，掌握這些進階技巧能夠幫助我們建立更健壯的系統，並且更好地利用 Go 的類型系統來提高代碼的質量。

### 下一步學習

如果你希望進一步深入 Go 的介面系統，可以探索以下主題：

1. 介面值的內部實現和性能考量
2. 泛型與介面的結合使用（Go 1.18+）
3. 常見設計模式中的介面應用
4. 在並發程式中安全使用介面

深入理解介面可以幫助我們寫出更優雅、更靈活的 Go 程式，這是成為 Go 專家的重要一步。