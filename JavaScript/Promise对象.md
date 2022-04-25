# Promise对象
JavaScript是单线程的语言，通过维护执行栈与任务队列而实现了异步操作，setTimeout与Ajax就是典型的异步操作，Promise就是异步操作的一个解决方案，用于表示一个异步操作的最终完成或失败及其结果值，Promise有各种开源实现，在ES6中被统一规范，由浏览器直接支持。

## 基本语法
```
new Promise( function(resolve, reject) { /* executor */
    // 执行代码 需要指明resolve与reject的回调位置
});

```

executor是带有resolve和reject两个参数的函数。Promise构造函数执行时立即调用executor函数，resolve和reject两个函数作为参数传递给executor。resolve和reject函数被调用时，分别将promise的状态改为完成fulfilled或失败rejected。executor内部通常会执行一些异步操作，一旦异步操作执行完毕，要么调用resolve函数来将promise状态改成fulfilled，要么调用reject函数将promise的状态改为rejected。如果在executor函数中抛出一个错误，那么该promise状态为rejected，executor函数的返回值被忽略。

## 实例
Promise可以进行链式调用，避免过多的异步操作造成的回调地狱，then()函数默认会返回一个和原来不同的新的Promise。
```
var promise = new Promise(function(resolve,reject){
     var rand = Math.random() * 2;
     setTimeout(function(){
         if(rand < 1) resolve(rand);
         else reject(rand);
     },1000)
})
promise.then(function(rand){
    console.log("resolve",rand); // resolve回调执行
}).catch(function(rand){
    console.log("reject",rand); // reject回调执行
}).then(function(){
    console.log("再执行then");
    return Promise.resolve(1);
}).then(function(num){
    console.log(num,"还可以继续执行并接收参数");
})

```
> then本身可以接受两个参数resolve与reject

## 方法
### Promise.all(iterable)
这个方法返回一个新的promise对象，该promise对象在iterable参数对象里所有的promise对象都成功的时候才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。这个新的promise对象在触发成功状态以后，会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致；如果这个新的promise对象触发了失败状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。Promise.all方法常被用于处理多个promise对象的状态集合。
```
var p1 = new Promise((resolve, reject) => {
  resolve("success1");
})

var p2 = new Promise((resolve, reject) => {
  resolve("success2");
})

var p3 = new Promise((resolve, reject) => {
  reject("fail");
})

Promise.all([p1, p2]).then((result) => {
  console.log(result);      // 成功状态 //["success1", "success2"]
}).catch((error) => {
  console.log(error);
})

Promise.all([p1,p3,p2]).then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);      // 失败状态 // fail
})

```

### Promise.race(iterable)
当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象。
```
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  },1000);
})

var p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("failed");
  }, 2000);
})

Promise.race([p1, p2]).then((result) => {
  console.log(result); // p1先获得结果，那么就执行p1的回调
}).catch((error) => {
  console.log(error);
})

```

### Promise.resolve(value)
返回一个状态由给定value决定的Promise对象
```
let promise = Promise.resolve(1);
promise.then((num) => {
    console.log(num); // 1
}).catch((err) => {
    console.log(err);
});

let thenable = {then: (resolve, reject) => resolve(1)};
let promise = Promise.resolve(thenable);

promise.then((value) => {
   console.log(value); // 1
}).catch((err) => {
    console.log(err);
});
```

###  Promise.reject(reason)
返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法
```
var promise = Promise.reject("err");
promise.then(() => {
    console.log(1);
}).catch((err) => {
    console.log(err); // err
});

```

## Promise A+规范
### 两条规则
1. Promise本质是一个状态机，且状态只能为以下三种：Pending（等待态）、Fulfilled（执行态）、Rejected（拒绝态），状态的变更是单向的，只能从Pending -> Fulfilled 或 Pending -> Rejected，状态变更不可逆
2. then方法接收两个可选参数，分别对应状态改变时触发的回调。then方法返回一个promise。then 方法可以被同一个 promise 调用多次。

### 手写代码
```
//Promise/A+规定的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  // 构造方法接收一个回调
  constructor(executor) {
    this._status = PENDING     // Promise状态
    this._value = undefined    // 储存then回调return的值
    this._resolveQueue = []    // 成功队列, resolve时触发
    this._rejectQueue = []     // 失败队列, reject时触发

    // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = (val) => {
      //把resolve执行回调的操作封装成一个函数,放进setTimeout里,以兼容executor是同步代码的情况
      const run = () => {
        if(this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = FULFILLED              // 变更状态
        this._value = val                     // 储存当前value

        // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
        while(this._resolveQueue.length) {    
          const callback = this._resolveQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }
    // 实现同resolve
    let _reject = (val) => {
      const run = () => {
        if(this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = REJECTED               // 变更状态
        this._value = val                     // 储存当前value
        while(this._rejectQueue.length) {
          const callback = this._rejectQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }
    // new Promise()时立即执行executor,并传入resolve和reject
    executor(_resolve, _reject)
  }

  // then方法,接收一个成功的回调和一个失败的回调
  then(resolveFn, rejectFn) {
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    typeof resolveFn !== 'function' ? resolveFn = value => value : null
    typeof rejectFn !== 'function' ? rejectFn = reason => {
      throw new Error(reason instanceof Error? reason.message:reason);
    } : null
  
    // return一个新的promise
    return new MyPromise((resolve, reject) => {
      // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
      const fulfilledFn = value => {
        try {
          // 执行第一个(当前的)Promise的成功回调,并获取返回值
          let x = resolveFn(value)
          // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      // reject同理
      const rejectedFn  = error => {
        try {
          let x = rejectFn(error)
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      switch (this._status) {
        // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
        case PENDING:
          this._resolveQueue.push(fulfilledFn)
          this._rejectQueue.push(rejectedFn)
          break;
        // 当状态已经变为resolve/reject时,直接执行then回调
        case FULFILLED:
          fulfilledFn(this._value)    // this._value是上一个then回调return的值(见完整版代码)
          break;
        case REJECTED:
          rejectedFn(this._value)
          break;
      }
    })
  }
}
```