# Flex布局
Flex布局也称弹性布局，可以为盒状模型提供最大的灵活性，是布局的首选方案，现已得到所有现代浏览器的支持。

## 基础
通过指定display: flex来标识一个弹性布局盒子，称为FLEX容器，容器内部的盒子就成为FLEX容器的成员，容器默认两根轴线，水平的主轴与垂直的交叉轴，主轴的开始位置叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end，容器成员默认按照主轴排列。

## 容器属性
### flex-direction
flex-direction属性决定主轴的方向，取值为row | row-reverse | column | column-reverse

### flex-wrap
flex-wrap属性决定当主轴方向放不下成员时是否换行，取值为wrap | no-wrap | wrap-reverse

### flex-flow
flex-flow是flex-direction flex-wrap，默认row wrap

### justify-content
justify-content属性定义了成员在主轴上的对齐方式，可以很容易地实现多种布局，取值为flex-start | flex-end | center | space-between | space-around

### align-items
align-items属性定义了成员在交叉轴上的对齐方式，取值为flex-start | flex-end | center | baseline | stretch

### align-content
align-content属性定义了多根轴线的对齐方式。如果成员只有一根轴线，该属性不起作用，取值为flex-start | flex-end | center | space-between | space-around | stretch

## 成员属性
### order
order属性定义成员的排列顺序，数值越小，排列越靠前，默认为0。

### flex
flex属性是flex-grow, flex-shrink和flex-basis的简写，默认值0 1 auto。后两个属性可选。

### flex-grow
flex-grow属性定义成员的放大比例，默认为0。

### flex-shrink
flex-shrink属性定义了成员的缩小比例，默认为1，即如果空间不足，该成员将缩小。

### flex-basis
flex-basis属性定义了在分配多余空间之前，成员占据的主轴空间main size，浏览器根据这个属性，计算主轴是否有多余空间，它的默认值为auto，即成员的本来大小。

### align-self
align-self属性允许单个成员有与其他成员不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。