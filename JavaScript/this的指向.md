# this指向

```
   //new Foo().getName先访问原型上的方法 成员访问和new优先级都是19
   function Foo() {
      getName = function () {
         console.log(1);
      };
      return this;
   }

   Foo.prototype.getName = function () {
      console.log(3);
   };

   function getName() {
      console.log(5);
   };
   new Foo().getName() //3
   let a = new Foo();
   a.getName() // 3

   // 函数执行时里面的getName函数会覆盖外面的getName函数
   function Foo() {
      getName = function () {
         console.log(1);
      };
      return this
   }

   function getName() {
      console.log(5);
   }

   Foo().getName(); // 1

   var value = 1;

   var foo = {
      value: 2,
      bar: function () {
         return this.value;
      },
      f: function () {
         console.log(this)
         return function () {
            return this
         }
      }
   }

   console.log(foo.f()())

   // //示例1
   // console.log(foo.bar()); // 2
```