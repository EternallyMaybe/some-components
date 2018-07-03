### 图片分页
#### 简述
仿百度图片查看图片时的图片列表分页，采用art-template模板结合jQuery进行的封装
#### 使用方法

```
var imagePagation = new ImagePagation();
imagePagation.init({
    mount: "#imagePagation",
    activeIndex: 0，
    pageSize: 1
});
```
#### 参数说明
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:----:|:----:|:----:|:----:|:----:|
| mount | 挂载节点 | String | —— | #imagePagation |
| activeIndex | 图片选中下标 | Number | —— | 0 |
| pageSize | 获取数据的大小限制 | Number | —— | 1 |