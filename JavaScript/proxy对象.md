# Proxy对象
Proxy 意思为代理，即在访问对象之前建立一道拦截，任何访问该对象的操作之前都会通过这道拦截。

## Proxy可以拦截什么

- getPrototypeOf()

- setPrototypeOf()

- isExtensible()

- preventExtensions()

- getOwnPropertyDescriptor()

- defineProperty()

- has()

- get()

- set()

- deleteProperty()

- ownKeys()

- apply()

- construct()
## 实例
### set
```
let user = new Proxy(
{
  age: 18
},
{
  set: function (target, key, value) {
    if (value > 140) {
      throw "你要成仙了!";
    }
    target[key]=value
  }
}
);
user.age = 20;
console.log(user.age)//20
user.age=200
//Uncaught 你要成仙了! 

```

### get
```
let handler = {
  //定义了get方法的拦截器
  get: function (target, key) {
    //target:要拦截的对象
    //key: 修改的属性
      if(target.hasOwnProperty(key)){
          if(key=='name'){
           return "法外狂徒-张三"
         }
      }
       return "18"
  }
};
let obj = {
  name: "张三"
};
let user = new Proxy(obj, handler);

//注意，这里的user不是上个示例的user对象了,而是Proxy的实例
console.log(user.name); //法外狂徒-张三

console.log(user.age); //18

```