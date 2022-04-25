# Hooks
对于React Hooks这个Hooks的意思，阮一峰大佬解释说，React Hooks的意思是，组件尽量写成纯函数，如果需要外部功能和副作用，就用钩子把外部代码钩进来，React Hooks就是那些钩子。我觉得这个解释非常到位了，拿useState来说，在写函数组件的时候是将这个函数勾过来使用，而在这个函数内部是保存着一些内部的作用域变量的，也就是常说的闭包，所以Hooks也可以理解为将另一个作用域变量以及函数逻辑勾过来在当前作用域使用。

## Hooks 优势

能优化类组件的三大问题
能在无需修改组件结构的情况下复用状态逻辑（自定义 Hooks ）
能将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）
副作用的关注点分离：副作用指那些没有发生在数据向视图转换过程中的逻辑，如 ajax 请求、访问原生dom 元素、本地持久化缓存、绑定/解绑事件、添加订阅、设置定时器、记录日志等。以往这些副作用都是写在类组件生命周期函数中的。**而 useEffect 在全部渲染完毕后才会执行，useLayoutEffect 会在浏览器 layout 之后，painting 之前执行。**

**不要在普通的 JavaScript 函数中调用 Hook,你可以：**

   - 在 React 的函数组件中调用 Hook
   - 在自定义 Hook 中调用其他 Hook

## useState
1. React 假设当你多次调用 useState 的时候，你能保证每次渲染时它们的调用顺序是不变的。
2. 通过在函数组件里调用它来给组件添加一些内部 state，React会 在重复渲染时保留这个 state
3. useState 唯一的参数就是初始 state
4. useState 会返回一个数组：一个 state，一个更新 state 的函数

   - 在初始化渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同
   - 你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并，而是直接替换

5.  每次渲染都是独立的闭包
- 每一次渲染都有它自己的 Props 和 State
- 每一次渲染都有它自己的事件处理函数
- 当点击更新状态的时候，函数组件都会重新被调用，那么每次渲染都是独立的，取到的值不会受后面操作的影响

6. 惰性初始化 state
initialState 参数只会在组件的初始化渲染中起作用，后续渲染时会被忽略
如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用

## useCallback & useMemo
简单理解呢 useCallback 与 useMemo 一个缓存的是函数，一个缓存的是函数的返回的结果。useCallback 是来优化子组件的，防止子组件的重复渲染。useMemo 可以优化当前组件也可以优化子组件，优化当前组件主要是通过 memoize 来将一些复杂的计算逻辑进行缓存。当然如果只是进行一些简单的计算也没必要使用 useMemo。
我们可以将 useMemo 的返回值定义为返回一个函数这样就可以变通的实现了 useCallback。useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。

### useCallback
```
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);

```
### useMemo
```const cacheSomething = useMemo(create,deps)```
- create: 第一个参数为一个函数，函数的返回值作为缓存值。
- deps： 第二个参数为一个数组，存放当前 useMemo 的依赖项，在函数组件下一次执行的时候，会对比 deps 依赖项里面的状态，是否有改变，如果有改变重新执行 create ，得到新的缓存值。
- cacheSomething：返回值，执行 create 的返回值。如果 deps 中有依赖项改变，返回的重新执行 create 产生的值，否则取上一次缓存值。


## useEffect
Effect Hook 可以让你在函数组件中执行副作用（数据获取，设置订阅以及手动更改React组件中的DOM都属于副作用）操作
```useEffect(function, array)```
useEffect 在全部渲染完毕后才会执行，useLayoutEffect 会在浏览器 layout 之后，painting 之前执行

### useEffect实现componentDidMount
第二个参数为空数组，相当于类组件里面的componentDidMount
```useEffect(() => { }, [])```

### useEffect实现componentDidUpdate
不传第二个参数，useEffect会在初次渲染和每次更新时，都会执行
```useEffect(() => {})```

### useEffect实现componentWillUnmount
effect返回一个函数，React将会在执行清楚操作的时候调用它
```
useEffect(() => {
   console.log("订阅了一些事情")
   return () => {
      console.log("执行清楚操作")
   }
})
```

### useEffect支持async/await
```
const App = () => {
  useEffect(() => {
    (async function getDatas() {
      await getData();
    })();
  }, []);
  return <div></div>;
};

```
## useRef
```const refContainer = useRef(initialValue)```
useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变

## useContext
```const val = useContext(MyContext)```

### 使用
index.js
```
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// 创建两个context
export const UserContext = React.createContext();
export const TokenContext = React.createContext();
ReactDOM.render(
  <UserContext.Provider value={{ id: 1, name: "chimmy", age: "20" }}>
    <TokenContext.Provider value="我是token">
      <App />
    </TokenContext.Provider>
  </UserContext.Provider>,
  document.getElementById("root")
);

```
app.js
```
import React, { useContext } from "react";
import { UserContext, TokenContext } from "./index";

function Example() {
  let user = useContext(UserContext);
  let token = useContext(TokenContext);
  console.log("UserContext", user);
  console.log("TokenContext", token);
  return (
    <div>
      name:{user?.name},age:{user?.age}
    </div>
  );
}
export default Example;

```