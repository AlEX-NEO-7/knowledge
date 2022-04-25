# Map
## 声明
```
var m1 map[string]string
m1 = make(map[string]string)

m1 := map[string]string = {
   "早上": "写BUG"
}
```
## 方法
- 增加/修改 ```map[key]```
- 查找 ```v, ok := map[key]```
- 删除 ```delete(map, key)```
- for...range