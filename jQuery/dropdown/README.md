### 下拉列表
#### 简述
采用art-template模板结合jQuery封装的下拉列表
#### 使用方法

```
var dropdown = new dropdown();
dropdown.init({
    mount: "#dropdown",
    sourceData: [],
    dropTitle: ""
});
```
#### 参数说明
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:----:|:----:|:----:|:----:|:----:|
| mount | 挂载节点 | String | —— | #dropdown |
| sourceData | 数据 | Array | dropdown显示值为数组中每个对象name属性 | —— |
| dropTitle | 下拉标题 | String | —— | —— |