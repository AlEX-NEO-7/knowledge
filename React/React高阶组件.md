# React中的高阶组件
高阶组件HOC即Higher Order Component是React中用于复用组件逻辑的一种高级技巧，HOC自身不是React API的一部分，它是一种基于React的组合特性而形成的设计模式。

## 描述
高阶组件从名字上就透漏出高级的气息，实际上这个概念应该是源自于JavaScript的高阶函数，高阶函数就是接受函数作为输入或者输出的函数，可以想到柯里化就是一种高阶函数，同样在React文档上也给出了高阶组件的定义，高阶组件是接收组件并返回新组件的函数。

具体而言，高阶组件是参数为组件，返回值为新组件的函数，组件是将props转换为UI，而高阶组件是将组件转换为另一个组件。HOC在React的第三方库中很常见，例如Redux的connect和Relay的createFragmentContainer。

```
   // 高阶组件定义
   const higherOrderComponent = (WrappedComponent) => {
      return class EnhancedComponent extends React.Component {
         // ...
         render() {
            return <WrappedComponent {...this.props} />;
         }
   };
   }

   // 普通组件定义
   class WrappedComponent extends React.Component{
      render(){
         //....
      }
   }

   // 返回被高阶组件包装过的增强组件
   const EnhancedComponent = higherOrderComponent(WrappedComponent);

```

在这里要注意，不要试图以任何方式在HOC中修改组件原型，而应该使用组合的方式，通过将组件包装在容器组件中实现功能。通常情况下，实现高阶组件的方式有以下两种:
- 属性代理Props Proxy。
- 反向继承Inheritance Inversion。

## 属性代理
例如我们可以为传入的组件增加一个存储中的id属性值，通过高阶组件我们就可以为这个组件新增一个props，当然我们也可以对在JSX中的WrappedComponent组件中props进行操作，注意不是操作传入的WrappedComponent类，我们不应该直接修改传入的组件，而可以在组合的过程中对其操作。
```
const HOC = (WrappedComponent, store) => {
    return class EnhancedComponent extends React.Component {
        render() {
            const newProps = {
                id: store.id
            }
            return <WrappedComponent
                {...this.props}
                {...newProps}
            />;
        }
    }
}

```

## 反向继承
反向继承是指返回的组件去继承之前的组件，在反向继承中我们可以做非常多的操作，修改state、props甚至是翻转Element Tree，反向继承有一个重要的点，反向继承不能保证完整的子组件树被解析，也就是说解析的元素树中包含了组件(函数类型或者Class类型)，就不能再操作组件的子组件了。
当我们使用反向继承实现高阶组件的时候可以通过渲染劫持来控制渲染，具体是指我们可以有意识地控制WrappedComponent的渲染过程，从而控制渲染控制的结果，例如我们可以根据部分参数去决定是否渲染组件。

```
const HOC = (WrappedComponent) => {
    return class EnhancedComponent extends WrappedComponent {
        render() {
            return this.props.isRender && super.render();  
        }
    }
}

```