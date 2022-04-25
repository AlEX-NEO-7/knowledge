# React中组件间通信的方式
React中组件间通信包括父子组件、兄弟组件、隔代组件、非嵌套组件之间通信。

## Props
props适用于父子组件的通信
```
<!-- 子组件 -->
import React from "react";

class Child extends React.PureComponent{
    render() {
        return (
            <>
                <div>接收父组件的值: {this.props.msg}</div>
                <button onClick={() => this.props.changeMsg("Changed Msg")}>修改父组件的值</button>
            </>
        )
    }
}

export default Child;

```
```
<!-- 父组件 -->
import React from "react";
import Child from "./child";

class Parent extends React.PureComponent{

    constructor(props){
        super(props);
        this.state = { msg: "Parent Msg" };
    }

    changeMsg = (msg) => {
        this.setState({ msg });
    }

    render() {
        return (
            <div>
                <Child msg={this.state.msg} changeMsg={this.changeMsg} />
            </div>
        )
    }
}

export default Parent;

```

## Context
React Context适用于父子组件以及隔代组件通信，React Context提供了一个无需为每层组件手动添加props就能在组件树间进行数据传递的方法。在React应用中数据是通过props属性自上而下即由父及子进行传递的，但这种做法对于某些类型的属性而言是极其繁琐的，这些属性是应用程序中许多组件都需要的，Context提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递props，实际上React-Router就是使用这种方式传递数据，这也解释了为什么<Router>要在所有<Route>的外面。。
使用Context是为了共享那些对于一个组件树而言是全局的数据，简单来说就是在父组件中通过Provider来提供数据，然后在子组件中通过Consumer来取得Provider定义的数据，不论子组件有多深，只要使用了Provider那么就可以取得在Provider中提供的数据，而不是局限于只能从当前父组件的props属性来获取数据，只要在父组件内定义的Provider数据，子组件都可以调用。当然如果只是想避免层层传递props且传递的层数不多的情况下，可以考虑将props进行一个浅拷贝之后将之后组件中不再使用的props删除后利用Spread操作符即{...handledProps}将其展开进行传递，实现类似于Vue的$attrs与$listeners的API操作。

```
import React from "react";

const createNamedContext = name => {
  const context = React.createContext();
  context.Provider.displayName = `${name}.Provider`;
  context.Consumer.displayName = `${name}.Consumer`;
  return context;
}

const context = /*#__PURE__*/ createNamedContext("Share");

export default context;

```
```
<!-- 子组件 -->
import React from "react";
import ShareContext from "./ShareContext";

class Child extends React.PureComponent{
    render() {
        return (
            <>
                <ShareContext.Consumer>
                    { /* 基于 context 值进行渲染 */ }
                    {
                        value => <div>SharedValue: {value}</div>
                    }
                </ShareContext.Consumer>
            </>
        )
    }
}

export default Child;

```
```
<!-- 父组件 -->
import React from "react";
import Child from "./child";
import ShareContext from "./ShareContext";

class Parent extends React.PureComponent{

    constructor(props){
        super(props);
        this.state = { msg: "Parent Msg" };
    }

    render() {
        return (
            <div>
                <ShareContext.Provider
                    value={100}
                >
                    <Child msg={this.state.msg} />
                </ShareContext.Provider>
            </div>
        )
    }
}

export default Parent;

```
## Refs
Refs适用于父子组件的通信，Refs提供了一种方式，允许我们访问DOM节点或在render方法中创建的React元素，在典型的React数据流中，props是父组件与子组件交互的唯一方式，要修改一个子组件，你需要使用新的props来重新渲染它，但是在某些情况下，需要在典型数据流之外强制修改子组件，被修改的子组件可能是一个React组件的实例，也可能是一个DOM元素，渲染组件时返回的是组件实例，而渲染DOM元素时返回是具体的DOM节点，React提供的这个ref属性，表示为对组件真正实例的引用，其实就是ReactDOM.render()返回的组件实例。此外需要注意避免使用refs来做任何可以通过声明式实现来完成的事情，通常在可以使用props与state的情况下勿依赖refs

```
<!-- 子组件 -->
import React from "react";

class Child extends React.PureComponent{

    render() {
        return (
            <>
                <div>接收父组件的值: {this.props.msg}</div>
            </>
        )
    }
}

export default Child;

```
```
<!-- 父组件 -->
import React from "react";
import Child from "./child";

class Parent extends React.PureComponent{

    constructor(props){
        super(props);
        this.state = { msg: "Parent Msg" };
        this.child = React.createRef();
    }

    componentDidMount(){
        console.log(this.child.current); // Child {props: {…}, context: {…}, ...}
    }

    render() {
        return (
            <div>
                <Child msg={this.state.msg} ref={this.child} />
            </div>
        )
    }
}

export default Parent;

```
## EventBus
EventBus可以适用于任何情况的组件通信，在项目规模不大的情况下，完全可以使用中央事件总线EventBus 的方式，EventBus可以比较完美地解决包括父子组件、兄弟组件、隔代组件之间通信，实际上就是一个观察者模式，观察者模式建立了一种对象与对象之间的依赖关系，一个对象发生改变时将自动通知其他对象，其他对象将相应做出反应。所以发生改变的对象称为观察目标，而被通知的对象称为观察者，一个观察目标可以对应多个观察者，而且这些观察者之间没有相互联系，可以根据需要增加和删除观察者，使得系统更易于扩展。首先我们需要实现一个订阅发布类作为单例模块导出，每个需要的组件再进行import，当然作为Mixins全局静态横切也可以，或者使用event库，此外务必注意在组件销毁的时候卸载订阅的事件调用，否则会造成内存泄漏。
```
// event-bus.js
var PubSub = function() {
    this.handlers = {};
}

PubSub.prototype = {
    constructor: PubSub,
    on: function(key, handler) { // 订阅
        if(!(key in this.handlers)) this.handlers[key] = [];
        if(!this.handlers[key].includes(handler)) {
             this.handlers[key].push(handler);
             return true;
        }
        return false;
    },

    once: function(key, handler) { // 一次性订阅
        if(!(key in this.handlers)) this.handlers[key] = [];
        if(this.handlers[key].includes(handler)) return false;
        const onceHandler = (...args) => {
            handler.apply(this, args);
            this.off(key, onceHandler);
        }
        this.handlers[key].push(onceHandler);
        return true;
    },

    off: function(key, handler) { // 卸载
        const index = this.handlers[key].findIndex(item => item === handler);
        if (index < 0) return false;
        if (this.handlers[key].length === 1) delete this.handlers[key];
        else this.handlers[key].splice(index, 1);
        return true;
    },

    commit: function(key, ...args) { // 触发
        if (!this.handlers[key]) return false;
        console.log(key, "Execute");
        this.handlers[key].forEach(handler => handler.apply(this, args));
        return true;
    },

}

export default new PubSub();

```
```
<!-- 子组件 -->
import React from "react";
import eventBus from "./event-bus";


class Child extends React.PureComponent{

    render() {
        return (
            <>
                <div>接收父组件的值: {this.props.msg}</div>
                <button onClick={() => eventBus.commit("ChangeMsg", "Changed Msg")}>修改父组件的值</button>
            </>
        )
    }
}

export default Child;

```
```
<!-- 父组件 -->
import React from "react";
import Child from "./child";
import eventBus from "./event-bus";

class Parent extends React.PureComponent{

    constructor(props){
        super(props);
        this.state = { msg: "Parent Msg" };
        this.child = React.createRef();
    }

    changeMsg = (msg) => {
        this.setState({ msg });
    }

    componentDidMount(){
        eventBus.on("ChangeMsg", this.changeMsg);
    }

    componentWillUnmount(){
        eventBus.off("ChangeMsg", this.changeMsg);

    }

    render() {
        return (
            <div>
                <Child msg={this.state.msg} ref={this.child} />
            </div>
        )
    }
}

export default Parent;

```

## Redux
Redux同样可以适用于任何情况的组件通信，Redux中提出了单一数据源Store用来存储状态数据，所有的组件都可以通过Action修改Store，也可以从Store中获取最新状态，使用了redux就可以解决多个组件的共享状态管理以及组件之间的通信问题。