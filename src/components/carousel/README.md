### 轮播器
#### 简述
包含无缝、普通以及是否带动画功能的轮播器
#### 使用方法

```
import carousel from './carousel'

<carousel
    :move='100px'
    :type = 'common'>
</carousel>
```
#### 参数说明
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:----:|:----:|:----:|:----:|:----:|
| move | 移动距离 | String | —— | 610px |
| type | 类型 | String | seamless/common | seamless |
| animated | 是否增加移动动画 | Boolean | —— | false |
| interval | 自动轮播时间 | String | —— | 3000 |
| stopInterval | 是否取消自动轮播 | Boolean | —— | false |
| showIndicator | 是否展示指示器 | Boolean | —— | true |