# defer / init 
## defer fn()
defer后边会接一个函数，但该函数不会立刻被执行，而是等到包含它的程序返回时 (包含它的函数执行了return语句、运行到函数结尾自动返回、对应的goroutine panic) defer函数才会被执行。通常用于资源释放、打印日志、异常捕获等

> 如果有多个defer函数，调用顺序类似于栈，越后面的defer函数越先被执行(后进先出)

## defer…recover
错误捕捉延迟处理，结合被延迟调用的匿名函数使用 
```
defer func (){
   if err := recover; err != nil {
      fmt.Println("捕获异常", err)
   }
}()
```

## init函数
1. 每个包都有自己的init，可以有多个
2. 执行顺序（取决于包的依赖）
被依赖包的全局变量 -> 被依赖包的init函数 -> … -> main包的全局变量 -> main的init函数 -> main函数