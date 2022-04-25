# Generator函数
生成器generator是ES6标准引入的新的数据类型，一个generator看上去像一个函数，但可以返回多次，通过yield关键字，把函数的执行流挂起，为改变执行流程提供了可能，从而为异步编程提供解决方案。

## 方法
- Generator.prototype.next()：返回一个由yield表达式生成的值。
- Generator.prototype.return()：返回给定的值并结束生成器。
- Generator.prototype.throw()：向生成器抛出一个错误。
## 实例
使用function*声明方式会定义一个生成器函数generator function，它返回一个Generator对象，可以把它理解成，Generator函数是一个状态机，封装了多个内部状态，执行Generator函数会返回一个遍历器对象。
调用一个生成器函数并不会马上执行它里面的语句，而是返回一个这个生成器的迭代器iterator 对象，他是一个指向内部状态对象的指针。当这个迭代器的next()方法被首次（后续）调用时，其内的语句会执行到第一个（后续）出现yield的位置为止，yield后紧跟迭代器要返回的值，也就是指针就会从函数头部或者上一次停下来的地方开始执行到下一个yield。或者如果用的是yield*，则表示将执行权移交给另一个生成器函数（当前生成器暂停执行）。
next()方法返回一个对象，这个对象包含两个属性：value和done，value属性表示本次yield表达式的返回值，done属性为布尔类型，表示生成器后续是否还有yield语句，即生成器函数是否已经执行完毕并返回。

```
function* f(x) {
    yield x + 10;
    yield x + 20;
    return x + 30;
}
var g = f(1);
console.log(g); // f {<suspended>}
console.log(g.next()); // {value: 11, done: false}
console.log(g.next()); // {value: 21, done: false}
console.log(g.next()); // {value: 31, done: true}
console.log(g.next()); // {value: undefined, done: true} // 可以无限next()，但是value总为undefined，done总为true

```

调用next()方法时，如果传入了参数，那么这个参数会传给上一条执行的yield语句左边的变量。
```
function* f(x) {
    var y = yield x + 10;
    console.log(y);
    yield x + y;
    console.log(x,y);
    return x + 30;
}
var g = f(1);
console.log(g); // f {<suspended>}
console.log(g.next()); // {value: 11, done: false}
console.log(g.next(50)); // {value: 51, done: false} // y被赋值为50
console.log(g.next()); // {value: 31, done: true} // x,y 1,50
console.log(g.next()); // {value: undefined, done: true}

```

若显式指明return方法给定返回值，则返回该值并结束遍历Generator函数，若未显式指明return的值，则返回undefined
```
function* f(x) {
    yield x + 10;
    yield x + 20;
    yield x + 30;
}
var g = f(1);
console.log(g); // f {<suspended>}
console.log(g.next()); // {value: 11, done: false}
console.log(g.next()); // {value: 21, done: false}
console.log(g.next()); // {value: 31, done: false} // 注意此处的done为false
console.log(g.next()); // {value: undefined, done: true}

```

yield*表达式表示yield返回一个遍历器对象，用于在Generator函数内部，调用另一个 Generator函数。
```
function* callee() {
    yield 100;
    yield 200;
    return 300;
}
function* f(x) {
    yield x + 10;
    yield* callee();
    yield x + 30;
}
var g = f(1);
console.log(g); // f {<suspended>}
console.log(g.next()); // {value: 11, done: false}
console.log(g.next()); // {value: 100, done: false}
console.log(g.next()); // {value: 200, done: false}
console.log(g.next()); // {value: 31, done: false}
console.log(g.next()); // {value: undefined, done: true}

```

## 源码手写
```
    function $generator(_context) {
        while(true) {
            switch(_context.prev = _context.next){
                case 0:
                    _context.next = 2;
                    return "result1";
                case 2:
                    _context.next = 4;
                    return "result2";
                case 4:
                    _context.next = 6;
                    return "result3";
                case 6:
                    _context.next = "end";
                    _context.stop();
                    return "result4";
                case "end":
                    return _context.stop();
            }
        }
    }

    let context = {
        next: 0,
        prev: 0,
        done: false,
        stop: function () {
            this.done = true;
        }
    }
    function generator() {
        return {
            next: function () {
                value = context.done ? undefined : $generator(context);
                done = context.done;
                return {
                    value,
                    done
                }
            }
        }
    }
```