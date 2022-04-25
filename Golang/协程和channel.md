# 协程 / channel
## 协程
Goroutine 是 Go 运行时管理的轻量级线程
主线程结束时，协程会被中断，需要有效的阻塞机制

- 数据竞争

多个线程同时对同一个内存空间进行写操作会导致数据竞争
sync包可以解决此问题，互斥锁Mutex，但在 Go 中不常用
因为go中有更高效的信道channel来解决这个问题

```
开启协程
go fn()
```

## channel
- channel，官方翻译为信道，是一种带有类型的管道
- 引用类型，使用前需要make(Type, (缓冲区容量))
- 不带缓冲区的管道必须结合结合协程使用 
- 可以查看长度len(channel)或容量cap(channel) 
### 声明与存取
```
var c chan int = make(chan int, 100) // 第二个参数为缓冲区大小，默认为1

c <- i      // 存入
var n int = <- c  // 取出
<-c   // 丢弃
```
- 先进先出，自动阻塞

- 数据需要保持流动，否则会阻死报错

### 关闭
```close(c)```

- 可以使用for...range，需要defer close(c) 防止缺乏关闭机制报错
- 可以使用select...case