# React Fiber
## 为什么Vue不用Fiber？
1. Vue 是基于 template 和 watcher 的组件级更新，把每个更新任务分割得足够小，不需要使用到 Fiber 架构，将任务进行更细粒度的拆分
2. React 是不管在哪里调用 setState，都是从根节点开始更新的，更新任务还是很大，需要使用到 Fiber 将大任务分割为多个小任务，可以中断和恢复，不阻塞主进程执行高优先级的任务

## Fiber Node
Fiber可以被理解成是一种数据结构，React Fiber就是采用链表来实现的。每一个虚拟DOM都可以表示为一个fiber。fiber作为一种数据结构，用于代表某些worker，换句话说，就是一个work单元，通过Fiber的架构，提供了一种跟踪，调度，暂停和中止工作的便捷方式。每一个fiber包括了child，sibling，return等属性。在第一次渲染之后，React会得到一个fiber tree，这棵树通常被称为current tree。当React开始处理更新时，它会构建一个 workInProgress tree，它反映了要刷新到屏幕的未来状态。

所有work都在workInProgress tree中的fiber上执行。当React遍历current tree时，对于每个现有fiber节点，它会使用render方法返回的React元素中的数据创建一个备用(alternate)fiber节点，这些节点用于构成workInProgress tree(备用tree)。处理完更新并完成所有相关工作后，React将备用tree刷新到屏幕。一旦这个workInProgress tree在屏幕上呈现，它就会变成current tree。

## Fiber执行原理
从根节点开始渲染和调度的过程会分为两个阶段：render阶段、commit阶段
- render阶段：这个阶段是可中断的，会找出所有节点的变更
- commit阶段：这个阶段是不可中断的，会执行所有的变更

### 辅助完成的函数
#### requestAnimationFrame
它是浏览器提供的绘制动画的api，它要求浏览器在下一次重绘之前调用指定的回调函数更新动画。
```requestAnimationFrame(callback)```


#### requestIdleCallback
requestIdleCallback 也是 react Fiber 实现的基础 api。requestIdleCallback能使开发者在主事件循环上执行后台和低优先级的工作，而不影响延迟关键事件，如动画和输入响应。正常帧任务完成后没超过16ms，说明有多余的空闲时间，此时就会执行requestIdleCallback里注册的任务。

开发者采用requestIdleCallback方法注册对应的任务，告诉浏览器我的这个任务优先级不高，如果每一帧内存在空闲时间，就可以执行注册的这个任务。另外，开发者是可以传入timeout参数去定义超时时间的，如果到了超时时间了，浏览器必须立即执行。
```window.requestIdleCallback(workloop, { timeout: 1000 })```

### render阶段
此阶段会找出所有节点的变更，如果节点的增删改等，这些变更react统称为副作用，此阶段会在workInProgress tree对每个节点进行分析，最后产出的结果是effect list。

#### 遍历Fiber tree
采用的是后序遍历方法：
1. 从顶点开始遍历
2. 如果有大儿子，先遍历大儿子；如果没有大儿子，则表示遍历完成
3. 大儿子：
   a. 如果有弟弟，则返回弟弟，跳到2
   b. 如果没有弟弟，则返回父节点，并标志完成父节点遍历，跳到2
   d. 如果没有父节点则标志遍历结束

#### 收集effect list
收集effect list的具体步骤为：

1. 如果当前节点需要更新，则打tag更新当前节点状态（props, state, context等）
2. 为每个子节点创建fiber。如果没有产生child fiber，则结束该节点，把effect list归并到return，把此节点的sibling节点作为下一个遍历节点；否则把child节点作为下一个遍历节点
3. 如果有剩余时间，则开始下一个节点，否则等下一次主线程空闲再开始下一个节点
4. 如果没有下一个节点了，进入pendingCommit状态，此时effect list收集完毕，结束。

定义一个方法收集此 fiber 节点下所有的副作用，并组成effect list。注意每个 fiber 有两个属性：

- firstEffect：指向第一个有副作用的子fiber
- lastEffect：指向最后一个有副作用的子fiber

### commit阶段
commit 阶段需要将上阶段计算出来的需要处理的副作用一次性执行，此阶段不能暂停，否则会出现UI更新不连续的现象。此阶段需要根据effect list，将所有更新都 commit 到DOM树上。