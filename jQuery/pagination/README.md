### 分页
#### 简述
采用art-template模板结合jQuery封装的分页
#### 使用方法

```
var pagination = new Pagination();
pagination.init({
    mount: "#Pagination",
    current: 0,
    totalPage: 0
});
```
#### 参数说明
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:----:|:----:|:----:|:----:|:----:|
| mount | 挂载节点 | String | —— | #Pagination |
| current | 当前页 | Number | —— | 0 |
| totalPage | 总页数 | Number | —— | 0 |
#### 其他说明
* 内置页面更新方法，通过pagination.update可以更新