# ES6
## 变量提升
JS引擎在正式执行一段代码前会进行一次预编译，预编译的简单理解就是在内存中开辟一块空间，存放一些变量和函数。这个过程就是，创建GO（全局对象），加载脚本，等脚本加载完后就开始语法解析，就是预编译的阶段了。先是查找函数声明，定义好函数体；然后查找变量声明，定义为undefined。接下来就是解释执行代码，执行到函数又会创建AO（活动对象），也是查找形参和变量，定义为undefined，接着再是实参赋值给形参，然后执行函数代码。

## var、let、const
let与var相比，let没有变量提升，不可以重复定义，let声明的变量只在当前作用域生效（if的例子，for的例子）。const变量是不能修改指针指向，但是可以修改值。let和const都不会挂载到window对象上

## 暂时性死区
当我们在一个区块中用let或者const定义变量后，这个区块对这些命令的变量从一开始就会形成一个封闭的区域，如果我们在声明前就尝试调用它们，就会报错。这一段会报错的区域就是暂时性死区。其实当我们在进入这个区域之前let和const声明的变量就已经存在了，只是不允许被调用，必须等待代码执行到声明位置。

## Set、Map
Set和Map的作用都是用于数据重组和数据存储
Set是一种叫做集合的数据解构，Map是一种叫字典的数据结构
### Set

Set是一种类数组的结构，没有length有size。
Set可以用Array.from(set)转化成数组
### WeakSet和Set的区别
WeakSet只能存储对象引用，不能存放值，Set对象可以。
WeakSet里面存储的对象引用都是弱引用，所以垃圾回收机制是不考虑WeakSet对该对象的应用
### Map和Set的区别
共同点 ：集合、字典可以存储不重复的值
不同点 ：集合是以[value, value]的形式存储元素，字典是以[key, value]的形式存储的。
### WeakMap
WeakMap是一对键值对，键是弱引用对象， 值是任意的
WeakMap的key不可枚举

## 运算符
### 解构运算符
解构对象不能为null，undefined
```const { name, age } = a; // a是一个对象```

### 展开运算符
```
const a = [1,2,3,4];
const b = [...a]; // 1,2,3,4
```
> 对象去重{...a, ...b}

### 空值合并操作符
空值合并操作符： ``` let a = 0 ?? 1; ```
> 与||不同 只有?? 左边的值为undefined或者null才会取右边的值

### 可选链操作符：``` let a = s?.name.firstName ```
> 不会因为值为null或undefined而造成短路报错

## 数组
### 常见数组方法
#### 1. push(元素1,...,元素n)
把指定的元素依次添加到数组的末尾

#### 2. pop()
删除数组最后一个元素，返回删除的元素

#### 3. shift()
删除数组第一个元素，返回删除的元素

#### 4. unshift(元素1,...,元素n)
将指定元素依次添加到数组的开头，并且返回新数组长度

#### 5. splice（拼接）
- 当传入参数是两个参数时，即spice(index,count),如果count不等于0，splice方法实现**删除功能**，同时返回删除的元素,从index开始删除count个元素
- 当传入参数是三个参数以上，且count不为0时，即 splice(index,count,元素1,...,元素n)splice方法实现**替换功能**，同时返回替换的所有元素，从index开始替换count个元素，元素为传入的元素1开始
- 当传入参数是三个参数以上，且count为0时，即splice(index,0,元素1,...,元素n)，splice方法实现**添加功能**，用第三个及其之后的参数添加到index参数指定位置上
数组去重
> 操作原数组

#### 6. slice(index1,index2)（切片）
index2为可选参数，改函数返回从数组中的第index1到index2或最后位置的元素的数组。
> 不操作原数组

#### 7. sort
- 如果不传递参数，元素按照Unicode编码从小到大排序
- 如果传递一个匿名函数作为参数，传入的函数需要有两个参数，返回值为第一个参数减去第二个参数，当两个参数的差值为正数时，前后比较的两个元素将调换位置。第一个参数为后面的值，第二个为前面的值。

#### 8. concat(数组1,...,数组n)
将传入的数组一次连接成一个新的数组

#### 9. reverse()
将当前数组倒序

#### 10. join(分隔符)
改方法可以将数组内的各个元素按照指定的分隔符连接成一个字符串，默认为，

#### 11. forEach
遍历数组,传入一个函数作为参数，函数可有四个参数
- currentValue：必填参数，表示正在处理的元素
- index：可选，表示正在处理的元素索引
- array：可选，表示正在操作的数组
- thisArg：可选，取值通常为this,为空是undefined

#### 12. filter
filter会返回所有函数返回值为true的元素, 传入一个函数作为参数，函数可有四个参数
- currentValue：必填参数，表示正在处理的元素
- index：可选，表示正在处理的元素索引
- array：可选，表示正在操作的数组
- thisArg：可选，取值通常为this,为空是undefined

#### 13. map
用于创建一个新数组，其中每个元素是指定元素调用函数处理后的结果,传入一个函数作为参数，函数可有四个参数
- currentValue：必填参数，表示正在处理的元素
- index：可选，表示正在处理的元素索引
- array：可选，表示正在操作的数组
- thisArg：可选，取值通常为this,为空是undefined

#### 14. reduce
用于使用回调函数对数组中的每个元素进行处理，并且将处理进行汇总返回,传入一个函数作为参数，函数可有五个参数
- result：必填参数，表示初始值或者回调函数执行后的返回值
- currentValue：必填参数，表示正在处理的元素
- index：可选，表示正在处理的元素索引
- array：可选，表示正在操作的数组
- initialValue：可选，作为第一次回调函数时的第一个参数的值。
```
ary.reduce(function(prev, next) {
   return prev + next;
}, 0)
```
#### 15. find
用于获取回调函数值为true的第一个数组元素。没有符合条件返回undefined
传入一个函数作为参数，函数可有四个参数
currentValue：必填参数，表示正在处理的元素
index：可选，表示正在处理的元素索引
array：可选，表示正在操作的数组
thisArg：可选，取值通常为this,为空是undefined

#### 16. includes(value)
判断数组包含值

### 合并数据
数组：a.concat(b,c)
对象：Object.assign({}, a, b, c)

### 数组过滤
```
a.filter((item, index) => {}) //返回所有返回值为true的值
a.find((item, index) => {}) //获取第一个返回值为true的值
``` 
> 只找一个find效率更高，找到后就不会遍历数组

### 扁平化数组和对象遍历
```
对象遍历方法 let a = Object.values(obj)
扁平化数组  let flat = a.flat(infinity); //传入嵌套的深度
```

### 数组去重
#### Set
```
   function unique(ary) {
      return [...new Set(ary)];
   }
```
#### for循环+indexOf
```
   function unique(ary) {
      let newAry = [];
      for(let i=0;i<ary.length;i++){
         let  cur = ary[i];
         if(newAry.indexOf(cur)===-1){
               newAry.push(cur);
         }
      }
      return newAry;
   }
```
> newAry.indexOf(cur)如果cur在该数组内返回index，不在返回-1

#### for循环+sort
```
   function unique(ary) {
      let a = ary.sort(function (a,b) {
         return a-b;
      });
      for(let i=0;i<a.length;i++){
         if(a[i]===a[i+1]){
            a.splice(i+1,1);
            i--;
         }
      }
      return a;
   }
```
> a-b升序 b-a降序

#### filter+indexOf
```
   function unique(ary) {
      return ary.filter(function (item,index,a) {
         return ary.indexOf(item)===index;
      })
   }
```
#### for循环+map
```
function unique(ary) {
   let newAry =[];
   let map = new Map();
   for(let i=0;i<ary.length;i++){
      if(!map.has(ary[i])){
            map.set(ary[i],true);
            newAry.push(ary[i]);
      }
   }
}
```
#### reduce+includes
```
function unique(ary) {
   return ary.reduce((prev,next)=>{
      // 该函数返回值是下一次执行的prev;
      return prev.includes(next)?prev:[...prev,next];
   },[])
}
```
> reduce : 第一个是函数，第二个参数会传给第一次回调的prev

###  迭代器和类数组
- 类数组是有length属性，其他属性是非负整数
- 不具有数组有的方法，原型是Object
```
let a = {
   2: "s",
   1: "b",
   length: 3
}
```
- 迭代器是有Symbol.iterator属性的数组
```
let array = [1,2,3,4];
let iterator = sb[Symbol.iterator]();
```

## 对象
### 计算属性
let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // 属性名是从 fruit 变量中得到的
};

alert( bag.apple ); // 5 如果 fruit="apple"

### 对象常用方法
#### 1. Object.assign(obj1,obj2)
用于克隆，返回一个对象，包含两个对象的属性

#### 2. Object.is()
用于判断两个值是否相同，返回true or false

#### 3. Object.keys()
用于返回对象可枚举的属性和方法名

#### 4. Object.defineProperty()
劫持变量的set和get方法，将属性添加到对象，或者修改现有的属性和特征
```
let a = {};
Object.defineProperty(a,'name',{
    value:'kong',
    enumerable:true //改属性是否可枚举
})
//如需操作多个
Object.defineProperties(a,{
    name:{
        value:'kong'
        enumerable:true
    },
    age:{
        value:'19'
        enumerable:true
    }
})
```
#### 5. isprototypeOf()
确定一个对象是否存在另一个对象的原型链上

#### 6. Object.freeze(obj)
冻结对象，对象不可改变

#### 7. Object.entries(obj)
返回对象键值对数组（二维数组）

#### 8. Object.getOwnPropertyNames(obj)
返回属性名构成的数组

#### 9. 检查是否存在 in
```
let user = { name: "John", age: 30 };

alert( "age" in user ); // true，user.age 存在
```

## 字符串
### 常见问题解决方案
#### 1. 查询字符串
str.indexOf("中");
数组也适用，返回对应值的索引，-1表示不存在

str.search("中");
返回对应索引，-1表示不存在

str.includes("中");
数组也适用，返回true or false

str.chartAt(0);
传入索引，返回对应字符串的值

#### 2. 修改字符串
str.slice(index1,index2)
str.substring(index1,index2)
str.substr(index,count)

#### 3. 字符串替换
str.replace("早上","下午");
高阶可用正则

#### 4. 字符串拼接
str.concat("ace");

#### 5. 字符串去空格
str.trim();

#### 6. 字符串转数组
str.split(分隔符);
以分隔符分割字符串返回数组

#### 7. 字符串以xx开头以xx结尾
str.startsWith("c");
str.endsWith("r");
返回true or false