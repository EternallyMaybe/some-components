### 视频播放器
#### 简述
移除video原本样式，重写样式
#### 使用方法

```
import newVideo from './video'

<new-video
    :src='src'
    :volumeProps = 'volumeProps'>
</new-video>
```
#### 参数说明
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|:----:|:----:|:----:|:----:|:----:|
| src | 视频地址 | String | —— | —— |
| volumeProps | 音量大小，范围0-1 | Number | —— | 0.5 |