# 流程控制
## if...else
不需要小括号

## switch...case
与其他语言一样

## for
也是不需要括号，GO中无while循环，用for循环的特殊形式代替

## label和goto
1. label: 会让break退出到打了标签的循环外
```
out:
for{
   break out
}
```
2. goto: 让运行跳过中间的部分直接到标签位置
```
if i == 1 {
   goto four
}

four:
   ...
```