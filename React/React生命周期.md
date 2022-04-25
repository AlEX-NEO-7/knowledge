# React生命周期
## 旧版生命周期
- 整个挂载过程：
   1. 初始化：constructor，参数是props
   2. 即将挂载页面：componentWillMount
   3. 组件渲染虚拟DOM：render
   4. 虚拟DOM生成真实的DOM挂载到页面：componentDidMount
- 整个更新过程：
   1. 当属性发生变化并且接收到新值：componentWillReceiveProps，参数为nextProps，之后setState会发生变化
   2. 是否重新渲染组件：shouldComponentUpdate，参数为nextProps，nextState
   3. 即将重新渲染组件：componentWillUpdate，参数为nextProps，nextState
   4. 组件渲染虚拟DOM：render
   5. 虚拟DOM生成真实的DOM挂载到页面：componentDidUpdate
- 销毁阶段：componentWillUnmount

## 新版生命周期
- 整个挂载过程：
   1. 初始化：constructor
   2. 从属性中获取新的状态：static getDerviedStateFromProps，参数是props和state
   3. 组件渲染虚拟DOM：render
   4. 虚拟DOM生成真实的DOM挂载到页面：componentDidMount
- 整个更新过程：
   1. 从属性中获取新的状态：static getDerviedStateFromProps, 之后setState会发生变化
   2. 是否重新渲染：shouldComponentUpdate, 参数为nextProps，nextState
   3. 组件渲染虚拟DOM：render
   4. 更新前的快照：getSnapshotBeforeUpdate 参数是prevProps，prevState
   5. 虚拟DOM生成真实的DOM挂载到页面：componentDidMount
- 销毁阶段：componentWillUnmount
