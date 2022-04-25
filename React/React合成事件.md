# React中的合成事件
React自己实现了一套高效的事件注册、存储、分发和重用逻辑，在DOM事件体系基础上做了很大改进，减少了内存消耗，简化了事件逻辑，并最大程度地解决了IE等浏览器的不兼容问题。

## 描述
React的合成事件SyntheticEvent实际上就是React自己在内部实现的一套事件处理机制，它是浏览器的原生事件的跨浏览器包装器，除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括stopPropagation()和preventDefault()，合成事件与浏览器的原生事件不同，也不会直接映射到原生事件，也就是说通常不要使用addEventListener为已创建的DOM元素添加监听器，而应该直接使用React中定义的事件机制，而且在混用的情况下原生事件如果定义了阻止冒泡可能会阻止合成事件的执行，当然如果确实需要使用原生事件去处理需求，可以通过事件触发传递的SyntheticEvent对象的nativeEvent属性获得原生Event对象的引用.

## React中的事件有以下几个特点
- React上注册的事件最终会绑定在document这个DOM上，而不是React组件对应的DOM，通过这种方式减少内存开销，所有的事件都绑定在document上，其他节点没有绑定事件，实际上就是事件委托的。
- React自身实现了一套事件冒泡机制，使用React实现的Event对象与原生Event对象不同，不能相互混用。
- React通过队列的形式，从触发的组件向父组件回溯，然后调用他们JSX中定义的callback。
- React的合成事件SyntheticEvent与浏览器的原生事件不同，也不会直接映射到原生事件。
- React通过对象池的形式管理合成事件对象的创建和销毁，减少了垃圾的生成和新对象内存的分配，提高了性能。

## 对于每个SyntheticEvent对象都包含以下属性
```
   boolean bubbles
   boolean cancelable
   DOMEventTarget currentTarget
   boolean defaultPrevented
   number eventPhase
   boolean isTrusted
   DOMEvent nativeEvent
   void preventDefault()
   boolean isDefaultPrevented()
   void stopPropagation()
   boolean isPropagationStopped()
   void persist()
   DOMEventTarget target
   number timeStamp
   string type

```

支持的合成事件一览，注意以下的事件处理函数在冒泡阶段被触发，如需注册捕获阶段的事件处理函数，则应为事件名添加Capture，例如处理捕获阶段的点击事件请使用onClickCapture，而不是onClick。

## React事件系统
简单来说，在挂载的时候，通过listenerBank把事件存起来了，触发的时候document进行dispatchEvent，找到触发事件的最深的一个节点，向上遍历拿到所有的callback放在eventQueue，根据事件类型构建event对象，遍历执行eventQueue，不简单点说，我们可以查看一下React对于事件处理的源码实现，commit id为4ab6305，TAG是React16.10.2，在React17不再往document上挂事件委托，而是挂到DOM容器上，目录结构都有了很大更改，我们还是依照React16，首先来看一下事件的处理流程。

```
/**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactDOMEventListener, which is injected and can therefore support
 *    pluggable event sources. This is the only work that occurs in the main
 *    thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 */

/**
 * React和事件系统概述:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 */

```

在packages\react-dom\src\events\ReactBrowserEventEmitter.js中就描述了上边的流程，并且还有相应的英文注释，使用google翻译一下，这个太概述了，所以还是需要详细描述一下，在事件处理之前，我们编写的JSX需要经过babel的编译，创建虚拟DOM，并处理组件props，拿到事件类型和回调fn等，之后便是事件注册、存储、合成、分发、执行阶段。

- Top-level delegation用于捕获最原始的浏览器事件，它主要由ReactEventListener负责，ReactEventListener被注入后可以支持插件化的事件源，这一过程发生在主线程。
- React对事件进行规范化和重复数据删除，以解决浏览器的问题，这可以在工作线程中完成。
- 将这些本地事件(具有关联的顶级类型用来捕获它)转发到EventPluginHub，后者将询问插件是否要提取任何合成事件。
- 然后EventPluginHub将通过为每个事件添加dispatches(引用该事件的侦听器和ID的序列)来对其进行注释来进行处理。
- 再接着，EventPluginHub会调度分派事件。

## 事件注册
首先会调用setInitialDOMProperties()判断是否在registrationNameModules列表中，在的话便注册事件，列表包含了可以注册的事件。

如果事件名合法而且是一个函数的时候，就会调用ensureListeningTo()方法注册事件。ensureListeningTo会判断rootContainerElement是否为document或是Fragment，如果是则直接传递给listenTo，如果不是则通过ownerDocument来获取其根节点，对于ownerDocument属性，定义是这样的，ownerDocument可返回某元素的根元素，在HTML中HTML文档本身是元素的根元素，所以可以说明其实大部分的事件都是注册在document上面的，之后便是调用listenTo方法实际注册。


## React将事件分类
可以看到React将事件分成了三类，优先级由低到高：

- DiscreteEvent离散事件，例如blur、focus、 click、 submit、 touchStart，这些事件都是离散触发的。
- UserBlockingEvent用户阻塞事件，例如touchMove、mouseMove、scroll、drag、dragOver等等，这些事件会阻塞用户的交互。
- ContinuousEvent连续事件，例如load、error、loadStart、abort、animationEnd，这个优先级最高，也就是说它们应该是立即同步执行的，这就是Continuous的意义，是持续地执行，不能被打断。

此外React将事件系统用到了Fiber架构里，Fiber中将任务分成了5大类，对应不同的优先级，那么三大类的事件系统和五大类的Fiber任务系统的对应关系如下。

- Immediate: 此类任务会同步执行，或者说马上执行且不能中断，ContinuousEvent便属于此类。
- UserBlocking: 此类任务一般是用户交互的结果，需要及时得到反馈，DiscreteEvent与- UserBlockingEvent都属于此类。
- Normal: 此类任务是应对那些不需要立即感受到反馈的任务，比如网络请求。
- Low: 此类任务可以延后处理，但最终应该得到执行，例如分析通知。
- Idle: 此类任务的定义为没有必要做的任务。

## 事件存储
让我们回到上边的listenToTopLevel方法中的listeningSet.add(topLevelType)，即是将事件添加到注册到事件列表对象中，即将DOM节点和对应的事件保存到Weak Map对象中，具体来说就是DOM节点作为键名，事件对象的Set作为键值，这里的数据集合有自己的名字叫做EventPluginHub，当然在这里最理想的情况会是使用WeakMap进行存储，不支持则使用Map对象，使用WeakMap主要是考虑到WeakMaps保持了对键名所引用的对象的弱引用，不用担心内存泄漏问题，WeakMaps应用的典型场合就是DOM节点作为键名。

## 事件合成
不同的事件类型会有不同的合成事件基类，然后再通过EventConstructor.getPooled生成事件，accumulateTwoPhaseDispatches用于获取事件回调函数，最终调的是getListener方法。
为了避免频繁创建和释放事件对象导致性能损耗(对象创建和垃圾回收)，React使用一个事件池来负责管理事件对象(在React17中不再使用事件池机制)，使用完的事件对象会放回池中，以备后续的复用，也就意味着事件处理器同步执行完后，SyntheticEvent属性就会马上被回收，不能访问了，也就是事件中的e不能用了，如果要用的话，可以通过一下两种方式：

- 使用e.persist()，告诉React不要回收对象池，在React17依旧可以调用只是没有实际作用。
- 使用e. nativeEvent，因为它是持久引用的。

## 事件分发
事件分发就是遍历找到当前元素及父元素所有绑定的事件，将所有的事件放到event._dispachListeners队列中，以备后续的执行。

## 事件执行
执行事件队列用到的方法是runEventsInBatch，遍历执行executeDispatchesInOrder方法，通过executeDispatch执行调度，最终执行回调函数是通过invokeGuardedCallbackAndCatchFirstError方法。