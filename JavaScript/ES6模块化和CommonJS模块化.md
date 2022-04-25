# 模块化导入导出
## 区别
import是ES6中的模块化标准，require是node中遵循Commonjs的标准。
require支持动态引入,也就是require(${path}/xx.js),import目前不支持.
import是关键字，require不是。
import编译时加载，必须放在模块顶部，在性能上比require好一些；require是运行时加载，理论上来说放哪里都可以。
import采用的是实时绑定方式，即导入导出值指向同一个内存地址，所以导入值会跟导出值一起变化；后者是在导出时进行值拷贝，就算导出值变化了，导入值也不会变化，如果需要更新导入，就需要重新导入。

## 使用
- CommonJS规范通过require导入，module.exports与exports进行导出。

- ES6标准使用export与export default来导出模块，使用import导入模块。此外在浏览器环境中是可以使用require来导入export、export default导出的模块的，但依然建议使用import标准导入模块。

## export、export default主要有以下区别：

- export能按需导入，export default不行。
- export可以有多个，export default仅有一个。
- export能直接导出变量表达式，export default不行。
- export方式导出，在导入时要加{}，export default则不需要。
