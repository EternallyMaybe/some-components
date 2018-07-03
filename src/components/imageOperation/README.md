### 图片操作面板
#### 简述
包含收起、查看大图、向左转、向右转功能
#### 使用方法

```
import imageOperation from './imageOperation'

<image-operation
    :images='images'
    :selected = 'selected'>
</image-operation>
```
#### 参数说明
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:----:|:----:|:----:|:----:|:----:|
| images | 图片列表 | Array | —— | —— |
| selected | 选中图片 | Number | —— | —— |