# vue生命周期
## Vue2.x
- 一开始vue会创建一个实例并且注入watch、data、computed、method等配置，在注入配置之前会调用beforeCreate方法，所以在beforeCreate方法中不能使用data、method等配置;
- 在注入配置之后，会调用created方法，此时已经可以使用Vue的相关配置了；
- 之后该实例会被解析成vnode树，完成之后会调用beforeMount方法，此时还是vnode树，没有真实的dom存在，所以此时获取不到真实dom；
- 接下来会根据vnode生成真实的dom，生成之后会调用mounted方法，在该方法中已经可以获取到页面的真实dom了，生成真实dom之后页面就会挂载；
- 当页面某个响应式数据发生变化时，则会重新渲染vnode树，重新生成dom，再重新渲染并挂载，而在触发重新渲染之前会触发beforeUpdate方法，在这个方法中如果修改data的数据不会发生重新渲染，在重新之后会触发Updated函数，在这个函数内则不能修改响应式的数据，不然会导致页面数据一直处于重新渲染状态。
- 之后在组件销毁之前会触发beforeDestroy方法，在销毁之后会触发destroyed，在这个方法中页面只剩dom空壳，组件已经被拆解，数据绑定和监听器等配置都已经被移除了。

## Vue3.x
在Vue3的组合式API中，我们可以直接将需要使用的生命周期函数导入到组件内，并在setup函数中使用，目的是为了保证轻量化。

除了beforeCreate和Created外，（因为这两个生命周期函数被setup替代），有九个生命周期钩子函数供使用。

- onBeforeMount ：挂载之前调用
- onMounted ：组件挂载时调用
- onBeforeUpdate ：数据更新前调用，发生在虚拟DOM打补丁之前。这里适合在更新之前访问现有的DOM，比如移除手动已添加的事件监听器
- onUpdated ：由于数据更改，虚拟DOM会重新渲染和打补丁，在这之后会调用该钩子函数
- onBeforeUnmount ：在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。
- onUnmounted ：组件卸载时调用
- onActivated ：keep-alive缓存的组件激活时调用
- onDeactivated ：keep-alive缓存的组件停用时调用
- onErrorCaptured ：当捕获一个子孙组件的错误时调用，此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

## 父子组件的生命周期

父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted