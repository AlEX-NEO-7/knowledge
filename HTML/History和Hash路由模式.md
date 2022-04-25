# 前端路由
目前的前端框架都是单页面应用（SPA），它利用了```JavaScript```动态变换网页内容，避免了页面重载；路由则提供了浏览器地址变化，网页内容也跟随变化，两者结合起来则为我们提供了体验良好的单页面```web```应用。

## hash模式
使用```window.location.hash```属性及窗口的```onhashchange```事件，可以实现监听浏览器地址hash值变化，执行相应的js切换网页。

   1. hash指的是地址中 # 号以及以后的字符, 也称为散列值。hash也称作锚点，本身是用来做页面内的跳转定位的；
   2. 散列值是不会随请求发送到服务器端的，所以该百年hash，不会重新加载页面；
   3. 监听```window```的```hashchange```事件，当散列值改变时，可以通过```location.hash```来获取和设置hash值；
   4. location.hash值的变化会直接反应到浏览器地址栏；

### 触发hashchange事件的几种情况
- 浏览器地址栏变化会触发```window.location.hash```值的变化，从而触发```onhashchange```事件；
- 当浏览器地址栏中的URL包含hash如```http://www.baidu.com/#home```, 这时按下输入，浏览器发送```http://www.baidu.com/```请求至服务器，请求完毕之后设置散列值为```#home```,进而触发```onhashchange```事件；
- 只改变浏览器地址栏URL的hash部分，按下回车不会发送请求至服务器，只会触发```onhashchange```事件；
- html中```<a>```标签的href属性，当点击该链接时页面跳转至id元素所在区域，浏览器自动设置```window.location.hash```属性，地址栏hash值变化，并触发```onhashchange```事件；

```
// 设置url的hash，会在当前url后加上#a
window.location.hash = 'a';
let hash = window.location.hash; // '#a' 

window.addEventListener('hashchange', function(){
   // 监听hash变化
})
```
## history模式
```history API```是```H5```提供的新特性，允许开发者直接更改前端路由，即更新浏览器的URL地址而不重新发起请求。
   1. ```window.history```属性指向```History```对象，它表示当前窗口的浏览历史；
   2. ```History```对象保存了当前窗口访问过的所有页面网址。通过```length```属性可以得出当前窗口一共访问过几个网址；
   3. 浏览器工具栏的前进和后退按钮其实就是对```History```对象进行操作；

### 属性
```History```对象主要有两个属性。

- ```History.length```: 当前窗口访问过的网址数量（包括当前）
- ```History.state```: History 堆栈最上层的状态值

### 方法

- ```History.back()```: 移动到上一个网址，等同于点击浏览器的后退键。对于第一个访问的网址，该方法无效。
- ```History.forward()```: 移动到下一个网址，等同于点击浏览器的前进键。对于最后一个访问的网址，该方法无效。
- ```History.go()```: 接受一个整数作为参数，以当前网址为基准，移动到参数指定的网址。如果参数超出实际存在的网址范围，该方法无效；如果不指定参数，默认参数为0，相当于刷新页面。

```
history.back()
history.forward();
history.go(-1);
history.go(1);
history.go(0);
```
### History.pushState()
该方法用于在历史记录中添加一条记录。```pushState()```方法不会刷新页面，只会导致History对象变化，地址栏也会变化。


该方法接受三个参数：
- ```object``` 是一个对象，通过```pushState```方法可以将该对象内容传递到新页面中。如果不需要这个对象可以填null。
- ```title```  标题，浏览器的支持情况不太好，传一个空字符串比较安全。
- ```url``` 新的网址，必须与当前页面同处在一个域。不指定的话则为当前的路径，如果设置了一个跨域网址会报错。

> pushState不会触发hashchange事件，但是锚点值改变会在History对象创建一条浏览记录

### History.replaceState()
该方法用来修改History对象的当前记录，用法与pushState一样。
```
history.pushState({page: 1}, '', '?page=1')
// URL 显示为 http://example.com/example.html?page=1

history.pushState({page: 2}, '', '?page=2');
// URL 显示为 http://example.com/example.html?page=2

history.replaceState({page: 3}, '', '?page=3');
// URL 显示为 http://example.com/example.html?page=3

history.back()
// URL 显示为 http://example.com/example.html?page=1

history.back()
// URL 显示为 http://example.com/example.html

history.go(2)
// URL 显示为 http://example.com/example.html?page=3
```
### popstate 事件
每当history对象出现变化时，就会触发popstate事件。

- 仅仅调用```pushState```方法和```replaceState```方法，并不会触发该事件
- 只有用户点击浏览器倒退按钮和前进按钮，或者使用JavaScript调用```History.back()```、```History.forward()```、```History.go()```方法时才会触发。
- 另外，该事件只针对同一个文档，如果浏览器历史的切换，导致加载不同的文档，该事件也不会触发。
- 页面第一次加载的时候，浏览器不会触发```popstate```事件。

```
window.addEventListener('popstate', function(e){
   // e.state 相当于 history.state
   console.log('state: ' + JSON.stringify(e.state));
	console.log(history.state);
})
```
