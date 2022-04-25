# keep-alive
Vue的缓存组件，有时候我们跳转页面再返回不希望页面重新渲染，或者是处于性能考虑，不想要多次重新渲染页面，

## Keep-alive的组件生命周期，
- 首次进入：
created -> mounted -> actived
退出后触发deactivated
- 再次进入：
只会触发actived
事件挂载的方法等，只执行一次的放在 mounted 中；组件每次进去执行的方法放在 activated 中
## 使用
- 场景：
跳转页面后返回保持原有的状态

### 更改App.vue
```
<div id="app" class='wrapper'>
   <keep-alive>
      <!-- 需要缓存的视图组件 -->
      <router-view v-if="$route.meta.keepAlive"></router-view>
   </keep-alive>
   
   <!-- 不需要缓存的视图组件 -->
   <router-view v-if="!$route.meta.keepAlive"></router-view>
</div>
```
### 在路由中设置KeepActive
```
{
path: 'list',
name: 'itemList', // 商品管理
component (resolve) {
   require(['@/pages/item/list'], resolve)
},
meta: {
   keepAlive: true, // keepAlive为true
   title: '商品管理'
}
}
```

### 更改BeforeEach钩子
实现前进返回留住缓存， 退出则需重新渲染
判断页面是前进还是后退， 在BeforeEach钩子加入：
```
let toDepth = to.path.split('/').length
let fromDepth = from.path.split('/').length
if (toDepth < fromDepth) {
// console.log('后退。。。')
from.meta.keepAlive = false
to.meta.keepAlive = true
}
```

### 记录页面滚动位置
#### 在deactivated中记录当前滚动位置
```
   deactivated(){
      window.localStorage.setItem(this.key, JSON.stringify({
         listScrollTop: this.scrollTop
         }))
   }
```
#### 在actived中实现滚动
```
this.cacheData = window.localStorage.getItem(this.key) ? JSON.parse(window.localStorage.getItem(this.key)) : null
$('.sidebar-item').scrollTop(this.cacheData.listScrollTop)
```
