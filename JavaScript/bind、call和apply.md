# apply()、call()、bind()
每个Function对象都存在apply()、call()、bind()方法，其作用都是可以在特定的作用域中调用函数，等于设置函数体内this对象的值，以扩充函数赖以运行的作用域。

## 使用
```
   window.name = "A"; // 挂载到window对象的name
   document.name = "B"; // 挂载到document对象的name
   var s = { // 自定义一个对象s
      name: "C"
   }

   var rollCall = {
      name: "Teacher",
      sayName: function(){
         console.log(this.name);
      }
   }
   rollCall.sayName(); // Teacher

   // apply
   rollCall.sayName.apply(); // A // 不传参默认绑定window
   rollCall.sayName.apply(window); // A // 绑定window对象
   rollCall.sayName.apply(document); // B // 绑定document对象
   rollCall.sayName.apply(s); // C // 绑定自定义对象

   // call
   rollCall.sayName.call(); // A // 不传参默认绑定window
   rollCall.sayName.call(window); // A // 绑定window对象
   rollCall.sayName.call(document); // B // 绑定document对象
   rollCall.sayName.call(s); // C // 绑定自定义对象

   // bind // 最后一个()是为让其执行
   rollCall.sayName.bind()(); //A // 不传参默认绑定window
   rollCall.sayName.bind(window)(); //A // 绑定window对象
   rollCall.sayName.bind(document)(); //B // 绑定document对象
   rollCall.sayName.bind(s)(); // C // 绑定自定义对象

```

## 区别
```
   // apply与call传参方式不同
   window.name = "Teacher";
   var rollCall = {
      sayAllName: function(...args){
         console.log(this.name);
         args.forEach((v) => console.log(v));
      }
   }

   // apply 将参数作为一个数组传递
   rollCall.sayAllName.apply(window,["A","B","C"]); // Teacher A B C

   // call 将参数直接传递，使用逗号分隔
   rollCall.sayAllName.call(window,"A","B","C"); // Teacher A B C

   // bind 仅将对象绑定，并不立即执行，其返回值是一个函数，传参方式与 call 相同
   var convertThis = rollCall.sayAllName.bind(window,"A","B","C"); 
   convertThis(); // Teacher A B C

```

## bind源码
```
Function.prototype.mybind = function (thisArg, ...args) {
   if (typeof this !== "function") {
      throw TypeError("Bind must be called on a function")
   }
   // 1. 保存this
   // 2. 构建一个函数用于保存原函数的原型
   // 3. 绑定的函数（返回的函数）
   const _this = this, 
      nop = function () {}, 
      bound = function (...tempArgs) {
         // 三目运算符是判断是否是使用new来调用的bound，ture -> this指向实例， false -> this指向指定的对象（thisArg）
         // 传参是bound的参数和bind传入的参数结合
         return _this.apply(this instanceof nop ? this : thisArg, args.concat(tempArgs))
      }

   // 维护原型关系
   if(this.prototype){
      nop.prototype = this.prototype
   }

   bound.prototype = new nop();

   return bound;
}
```

## call / apply源码
```
Function.prototype.mycall = function (thisArg, ...args) {
   if (typeof this !== "function") {
      throw TypeError("variable is not a function")
   }

   // 保存this函数
   thisArg = thisArg || window
   const fn = Symbol("fn")
   thisArg[fn] = this
   
   // 执行this函数
   const result = thisArg[fn](...args)
   delete thisArg[fn]
   
   return result
}

Function.prototype.myapply = function (thisArg, argArray) {
   if (typeof this !== "function") {
      throw TypeError("variable is not a function")
   }

   thisArg = thisArg || window
   const fn = Symbol("fn")
   thisArg[fn] = this

   const result = thisArg[fn](...argArray)
   delete thisArg[fn]

   return result
}
```
