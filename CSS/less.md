# less
css预处理器
## 变量
### 值变量
```
/* Less */
@color: #999;
@bgColor: skyblue;//不要添加引号
@width: 50%;
#wrap {
  color: @color;
  background: @bgColor;
  width: @width;
}

/* 生成后的 CSS */
#wrap {
  color: #999;
  background: skyblue;
  width: 50%;
}
```

### 选择器变量
```
@mySelector: ".wrap";

{@mySelector}{
   width:100px;
}
```

### 属性变量
```
@attr: "font-size";

.wrap{
   {@attr}:"15px"
}
```

### URL变量
```
@url:"../aaa/";

.wrap{
   background-image: url("@{url}dog.png");
}
```

### 声明变量
```
@background:{background:red};

.wrap{
   @background();
}
```

## 嵌套
```
/* Less */
#header{
  &:after{
    content:"Less is more!";
  }
  .title{
    font-weight:bold;
  }
  &_content{//理解方式：直接把 & 替换成 #header
    margin:20px;
  }
}
/* 生成的 CSS */
#header::after{
  content:"Less is more!";
}
#header .title{ //嵌套了
  font-weight:bold;
}
#header_content{//没有嵌套！
    margin:20px;
}

```

## 函数
- abs
- ceil
- iscolor