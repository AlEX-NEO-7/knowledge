# CSS3新特性
CSS3是最新的CSS标准，旨在扩展CSS2.1。

## 圆角
通过border-radius属性可以给任何元素制作圆角。
- border-radius: 所有四个边角border-*-*-radius属性的缩写。
- border-top-left-radius: 定义了左上角的弧度。
- border-top-right-radius: 定义了右上角的弧度。
- border-bottom-right-radius: 定义了右下角的弧度。
- border-bottom-left-radius: 定义了左下角的弧度。

## 阴影
```box-shadow: h-shadow v-shadow blur spread color inset```

- h-shadow: 必需，水平阴影的位置，允许负值。
- v-shadow: 必需，垂直阴影的位置，允许负值。
- blur: 可选，模糊距离。
- spread: 可选，阴影的大小。
- color: 可选，阴影的颜色。在CSS颜色值寻找颜色值的完整列表。
- inset: 可选，从外层的阴影改变阴影内侧阴影。

## 背景
CSS3中包含几个新的背景属性，提供更大背景元素控制。

- background-image: 规定背景图片路径。
- background-clip: 规定背景的绘制区域。
- background-origin: 规定背景图片的定位区域。
- background-size: 规定背景图片的尺寸。


## 渐变
CSS3渐变可以在两个或多个指定的颜色之间显示平稳的过渡。

- Linear Gradients: 线性渐变，向下/向上/向左/向右/对角方向。
- Radial Gradients: 径向渐变，由中心定义。

## 2D转换
CSS3转换可以对元素进行移动、缩放、转动、拉长或拉伸。

- transform: 适用于2D或3D转换的元素。
- transform-origin: 允许更改转化元素位置

## 3D转换
CSS3可以使用3D转换来对元素进行格式化。

- transform: 向元素应用2D或3D转换。
- transform-origin: 允许你改变被转换元素的位置。
- transform-style: 规定被嵌套元素如何在3D空间中显示。
- perspective: 规定3D元素的透视效果。
- perspective-origin: 规定3D元素的底部位置。
- backface-visibility: 定义元素在不面对屏幕时是否可见。

## 动画
CSS3可以创建动画，它可以取代许多网页动画图像、Flash动画和JavaScript实现的效果。

- @keyframes: 规定动画。
- animation: 所有动画属性的简写属性，除了animation-play-state属性。
- animation-name: 规定@keyframes动画的名称。
- animation-duration: 规定动画完成一个周期所花费的秒或毫秒，默认是0。
- animation-timing-function: 规定动画的速度曲线，默认是ease。
- animation-fill-mode: 规定当动画不播放时，例如当动画完成时，或当动画有一个延迟未开始播放时，要- 应用到元素的样式。
- animation-delay: 规定动画何时开始，默认是0。
- animation-iteration-count: 规定动画被播放的次数，默认是1。
- animation-direction: 规定动画是否在下一周期逆向地播放，默认是normal。
- animation-play-state: 规定动画是否正在运行或暂停，默认是running。

```
<div id="t9"></div>
<style type="text/css">
    @keyframes animation{
        from {background:red;}
        to {background:yellow;}
    }
    #t9{
        height: 100px;
        width: 100px;
        border: 1px solid #eee;
        animation:animation 5s ease infinite alternate;
    }
</style>

```

## 过渡
CSS3中可以使元素从一种样式转变到另一个的时候，无需使用Flash动画或JavaScript。

- transition: 简写属性，用于在一个属性中设置四个过渡属性。
- transition-property: 规定应用过渡的CSS属性的名称。
- transition-duration: 定义过渡效果花费的时间，默认是 0。
- transition-timing-function: 规定过渡效果的时间曲线，默认是ease。
- transition-delay: 规定过渡效果何时开始，默认是 0。