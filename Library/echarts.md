# Echarts
用于数据可视化开发

## 基本使用
基本分为三个部分：
1. 获取一个用于渲染的DOM；
2. 初始化DOM
3. 配置一些配置项
```
import * as echarts from 'echarts';

// 获取DOM
var chartDom = document.getElementById('main');
// 初始化DOM
var myChart = echarts.init(chartDom);
var option;

// 配置
option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
};

// 把配置应用在初始化的DOM内
option && myChart.setOption(option);
```

## 配置项
### title
设置标题相关配置
- id 
- show 
- text 
- link 
- target 
- textStyle  (还有副标题相关subtext...)
### xAxis & yAxis
设置直角坐标系grid中的x和y轴
- id 
- show
- type: 'value'(数值轴)，'category'(类目轴，从data里面拿数据)，'time'(时间轴)，'log'(对数轴)
- data
- position：left or right

### tooltip
提示框组件
- show
- trigger：触发类型
   1. 'item': 数据项图形触发，主要在散点图，饼图等无类目轴项目使用
   2. 'axis': 坐标轴触发，主要在柱状体，折线图等会使用类目轴的图表中使用。
   3. 'none': 什么都不触发
- axisPointer
   1. show : true (一般外面写了show属性里面即可不写)
   2. type : cross
- triggerOn: 触发条件
   1. 'mousemove'
   2. 'click'
   3. 'mousemove|click'
   4. 'none'

### series
设置数据的展示图表以及相关配置
- type: 设置图表类型（多种）
   1. line
   2. bar
   3. pie
   4. tree
- id
- name: 在tooltip里面显示的横坐标的名称
- data
- showBackground
- backgruondStyle
- itemStyle：图形样式
- emphasis：高亮的图形样式和标签样式
- 外观相关api(字体、边框、背景颜色之类)

