<template>
    <div class="zm-video video">
        <video :src="src"
            ref="video" 
            isZMVideo="true"
            @canplay="getTime"
            @timeupdate="timeUpdate"
            @ended="endHandle"
            @mousemove="handleControls"
            @mouseleave="leaveVideo"
            @mouseup="clickVideo">
        </video>
        <div class="mask"
            v-show="showMask"
            @mouseup="clickVideo">
            <div class="icon-bg">
                <i class="icon" :class="duration !== 0 && endState ? 'icon-replay' : 'icon-play-large'"></i>
            </div>
        </div>
        <div class="controls"
            @mouseenter="alwaysShow"
            @mouseleave="leaveControls">
            <div class="icon-container">
                <i class="icon" :class="duration !== 0 && play ? 'icon-pause' : 'icon-play'" @click="play = !play"></i>
            </div>
            <div class="time">
                <div class="time-current" :class="{'video-off': duration === 0}">{{currentTime}}</div>
                /
                <div class="time-total">{{totalTime}}</div>
            </div>
            <div class="progressbar">
                <div class="video-duration"></div>
                <div class="video-buffered" style="{width: `${bufferpercentage}%`}"></div>
                <input class="progress video-progress" 
                    type="range" 
                    min="0" 
                    step="0.1" 
                    :max="parseInt(duration, 10)"
                    v-model="videoValue"
                    @mousedown="mousedownHandle"
                    @mouseup="mouseupHandle" 
                    :style="{backgroundSize: videoBackgroundSize}">
            </div>
            <div class="volume-container">
                <i class="volume icon"
                    :class="!volume ? 'icon-volume-off' : 'icon-volume-up'"
                    @click="handleVolume"
                    @mouseenter="showVolumeProgress = true"
                    @mouseleave="handleVolumeShow">
                </i>
                <div class="progress-container"
                    @mouseleave="showVolumeProgress = false"
                    v-show="showVolumeProgress">
                    <input type="range" 
                        min="0" 
                        step="0.01" 
                        max="1" 
                        v-model="volumeValue"
                        ref="volumeValue"
                        class="progress volume-progress" 
                        style="{background-size: volumeBackgroundSize}"/>
                </div>
            </div>
            <div class="icon" :class="!fullScreen ? 'icon-full-screen' : 'icon-restore'" @click="fullScreen = !fullScreen"></div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            src: String,
            volumeProps: {
                type: Number,
                default: .5
            }
        },
        data() {
            return {
                // 全屏数据
                fullScreen: false,
                // 视频数据
                play: false,
                stopLock: false,
                duration: 0,
                videoValue: 0,
                currentTime: "00:00",
                totalTime: "00:00",
                videoBackgroundSize: "0% 100%",
                clickCount: 0,
                timer: null,
                // 音量控制数据
                volume: true,
                volumeValue: .5,
                tempVolumeValue: .5,
                showVolumeProgress: false,
                volumeBackgroundSize: "50% 100%",
                // 展示控制条
                showControls: true,
                // 定时器
                timeoutId: "",
                // 遮罩数据
                endState: false,
                showMask: false,
                bufferpercentage: 0,
                // 鼠标移动前位置
                mousePosition: {
                    clientX: 0,
                    clientY: 0
                }
            }
        },
        computed: {
            scrollTop() {
                return document.querySelector(".main").scrollTop;
            }
        },
        watch: {
            volumeProps(val) {
                this.volumeValue = val;
            },
            play(val) {
                this.endState = false;
                if (val) {
                    this.$refs.video.play();
                    this.showMask = false;
                } else {
                    this.$refs.video.pause();
                    this.alwaysShow();
                    this.stopLock || (this.showMask = true);
                }
            },
            fullScreen(val) {
                if (val) {
                    this.$refs.video.webkitRequestFullScreen();
                } else {
                    setTimeout(function () {
                        document.querySelector(".main").scrollTop = this.scrollTop
                    }, 50),
                    this.$refs.video.webkitExitFullScreen()
                }
            },
            videoValue(val) {
                var percentage = (val / this.duration).toFixed(20);
                this.videoBackgroundSize = 100 * percentage + .2 + "% 100%"
            },
            volumeValue(val) {
                this.volumeBackgroundSize = 100 * val + "% 100%";
                this.$refs.video.volume = val;
                this.volume = 0 != val;
                sessionStorage.setItem("volume", val);
            }
        },
        methods: {
            // 获取视频时间
            getTime(e) {
                this.duration = e.target.duration,
                this.totalTime = this.dealSeconds(this.duration)
            },
            // 获取播放进度
            timeUpdate(e) {
                // 当鼠标点击时进行锁定，避免视频一直播放，因而导致对视频的重新赋值不准的情况
                if (this.stopLock) return;
                // 更新进度条样式
                let time = e.target.currentTime,
                    currentTime = time && void 0 !== time ? time : 0;
                this.videoValue = currentTime;
                this.currentTime = this.dealSeconds(currentTime);
            },
            // 媒介已到达结尾时触发
            endHandle(e) {
                this.play = false;
                // 控制条渲染完再设置状态
                this.$nextTick(function () {
                    this.endState = true;
                    this.$emit("endHandle", e);
                })
            },
            // 鼠标按下range时停止视频播放，同时对视频加锁
            mousedownHandle() {
                this.stopLock = true;
                this.play = false;
            },
            // 鼠标移除range时触发视频播放，同时取消锁定
            mouseupHandle() {
                this.$refs.video.currentTime = this.videoValue;
                this.play = true;
                this.stopLock = false;
            },
            dealSeconds(seconds) {
                var secondsInt = parseInt(seconds, 10),
                    minutes = parseInt(seconds / 60, 10) % 60,
                    minutesStr = minutes >= 10 ? minutes : "0" + minutes,
                    secondsTemp = secondsInt % 60;
                return minutesStr + ":" + (secondsTemp >= 10 ? secondsTemp : "0" + secondsTemp)
            },
            // 双击全屏
            clickVideo(e) {
                if (0 !== e.button) return;
                this.clickCount++;
                if (1 === this.clickCount) {
                    this.timer = setTimeout(function () {
                        this.play = !this.play;
                        this.clickCount = 0;
                        this.$emit("clearTimer");
                    }, 300) 
                } else {
                    this.fullScreen = !this.fullScreen;
                    clearTimeout(this.timer);
                    this.clickCount = 0;
                }
            },
            // 操作声音控制条
            handleVolume() {
                if (this.volume) {
                    this.volume = false;
                    this.tempVolumeValue = this.volumeValue;
                    this.volumeValue = 0;
                    this.$refs.video.volume = 0;
                } else {
                    this.volume = true;
                    this.volumeValue = this.tempVolumeValue;
                    this.$refs.video.volume = this.volumeValue;
                }
            },
            handleVolumeShow(e) {
                if (e.offsetY > 2) {
                    this.showVolumeProgress = false;
                }
            },
            // 控制条的展示
            handleControls() {
                let self = this;
                clearTimeout(this.timeoutId);
                this.showControls = true;
                this.timeoutId = setTimeout(() => {
                    self.showControls = false;
                }, 2000);
            },
            alwaysShow() {
                clearTimeout(this.timeoutId);
                this.showControls = true;
            },
            leaveVideo() {
                if (this.play) {
                    this.showControls = false
                };
            },
            leaveControls(e) {
                if (e.offsetY > 0) {
                    this.leaveVideo();
                }
            },
            playVideo() {
                this.$nextTick(function () {
                    this.play = true;
                })
            },
            stopVideo() {
                this.$nextTick(function () {
                    this.play = false;
                })
            }
        },
        mounted: function () {
            let self = this,
                video = this.$refs.video;
            video.volume = .5;
            // 控制条2s消失
            this.timeoutId = setTimeout(function () {
                self.showControls = false;
            }, 2000),
            // 监听ESC退出事件
            document.addEventListener("webkitfullscreenchange", function () {
                if (null == document.webkitFullscreenElement && t.fullScreen) {
                    self.fullScreen = !self.fullScreen;
                }
            }),
            e.onprogress = function () {
                let percentage = video.buffered.length ? video.buffered.end(video.buffered.length - 1) / video.duration : 0;
                self.bufferpercentage = 100 * percentage.toFixed(20)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .zm-video {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        height: 100%;
        width: 100%;
        position: relative
    }

    .zm-video video {
        width: 100%;
        height: 100%;
        cursor: pointer
    }

    .zm-video .controls {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        box-sizing: border-box;
        position: absolute;
        z-index: 8;
        bottom: 0;
        left: 0;
        padding: 0 18px;
        width: 100%;
        height: 46px;
        font-size: 17px;
        background-color: rgba(0, 0, 0, .8)
    }

    .zm-video .controls .icon-container {
        width: 18px
    }

    .zm-video .controls .icon {
        cursor: pointer
    }

    .zm-video .controls .icon-volume-off,
    .zm-video .controls .icon-volume-up {
        width: 22px
    }

    .zm-video .controls .time {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        margin: 4px 0 0 12px;
        font-size: 12px;
        color: #9b9b9b
    }

    .zm-video .controls .time-current,
    .zm-video .controls .time-total {
        width: 45px;
        text-align: center
    }

    .zm-video .controls .time-current {
        color: #008df9
    }

    .zm-video .controls .progress {
        -webkit-appearance: none;
        overflow: inherit;
        height: 4px;
        background-image: -webkit-linear-gradient(left, #008df9, #008df9);
        background-image: linear-gradient(90deg, #008df9, #008df9);
        background-repeat: no-repeat;
        background-size: 0 100%;
        cursor: pointer
    }

    .zm-video .controls .progress:focus {
        outline: 0
    }

    .zm-video .controls .volume-container {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: end;
        -ms-flex-align: end;
        align-items: flex-end;
        position: relative;
        margin-right: 16px;
        width: 26px
    }

    .zm-video .controls .progress-container {
        position: absolute;
        top: -109px;
        left: -4px;
        z-index: 2;
        width: 26px;
        height: 110px
    }

    .zm-video .controls .volume-progress {
        position: absolute;
        bottom: 54px;
        left: -36px;
        z-index: 3;
        height: 6px;
        width: 100px;
        border-radius: 3px;
        background-size: 50% 100%;
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
        background-color: #555
    }

    .zm-video .controls .video-progress {
        background-color: transparent
    }

    .zm-video .controls .progress::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        height: 4px
    }

    .zm-video .controls .progress::-webkit-slider-thumb {
        -webkit-appearance: none;
        margin-top: -5px;
        border-radius: 50%;
        height: 14px;
        width: 14px;
        background-image: -webkit-linear-gradient(bottom, #1e80c1, #1a93cb 50%, #16a6d4), -webkit-linear-gradient(#11648f, #11648f);
        background-image: linear-gradient(0deg, #1e80c1, #1a93cb 50%, #16a6d4), linear-gradient(#11648f, #11648f);
        background-blend-mode: normal, normal;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, .51)
    }

    .zm-video .controls .progressbar {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        position: relative;
        margin-left: 10px;
        margin-right: 20px
    }

    .zm-video .controls .video-buffered,
    .zm-video .controls .video-duration,
    .zm-video .controls .video-progress {
        position: absolute;
        top: -2px;
        width: 100%;
        height: 6px;
        border-radius: 3px
    }

    .zm-video .controls .video-duration {
        background-color: #3c3c3c
    }

    .zm-video .controls .video-buffered {
        background-color: #084b7d
    }

    .zm-video .mask {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        position: absolute;
        z-index: 7;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, .2);
        cursor: pointer
    }

    .zm-video .mask .icon-bg {
        border-radius: 50%;
        width: 86px;
        height: 86px;
        background-color: rgba(0, 0, 0, .4)
    }

    .zm-video .mask .icon-bg:hover {
        background-color: rgba(0, 0, 0, .6)
    }

    .zm-video .icon-play {
        background-position: -18px -90px
    }

    .zm-video .icon-play,
    .zm-video .icon-play:hover {
        background-image: url(data:image/png;base64,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);
        width: 18px;
        height: 18px
    }

    .zm-video .icon-play:hover {
        background-position: -102px -54px
    }

    .zm-video .icon-pause {
        background-position: -54px -90px
    }

    .zm-video .icon-pause,
    .zm-video .icon-pause:hover {
        background-image: url(data:image/png;base64,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);
        width: 14px;
        height: 18px
    }

    .zm-video .icon-pause:hover {
        background-position: -68px -90px
    }

    .zm-video .icon-volume-off {
        background-position: -102px 0
    }

    .zm-video .icon-volume-off,
    .zm-video .icon-volume-off:hover {
        background-image: url(data:image/png;base64,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);
        width: 22px;
        height: 18px
    }

    .zm-video .icon-volume-off:hover {
        background-position: -102px -18px
    }

    .zm-video .icon-volume-up {
        background-position: -80px -50px
    }

    .zm-video .icon-volume-up,
    .zm-video .icon-volume-up:hover {
        background-image: url(data:image/png;base64,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);
        width: 22px;
        height: 18px
    }

    .zm-video .icon-volume-up:hover {
        background-position: -80px -68px
    }

    .zm-video .icon-full-screen {
        background-position: -36px -90px
    }

    .zm-video .icon-full-screen,
    .zm-video .icon-full-screen:hover {
        background-image: url(data:image/png;base64,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);
        width: 18px;
        height: 18px
    }

    .zm-video .icon-full-screen:hover {
        background-position: -102px -36px
    }

    .zm-video .icon-restore {
        background-position: -102px -72px
    }

    .zm-video .icon-restore,
    .zm-video .icon-restore:hover {
        background-image: url(data:image/png;base64,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);
        width: 18px;
        height: 18px
    }

    .zm-video .icon-restore:hover {
        background-position: 0 -90px
    }

    .zm-video .icon-replay {
        margin: 19px 0 0 18px;
        background-position: 0 0
    }

    .zm-video .icon-replay,
    .zm-video .icon-replay:hover {
        background-image: url(data:image/png;base64,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);
        width: 51px;
        height: 50px
    }

    .zm-video .icon-replay:hover {
        background-position: -51px 0
    }

    .zm-video .icon-play-large {
        margin: 24px 0 0 30px;
        background-position: 0 -50px
    }

    .zm-video .icon-play-large,
    .zm-video .icon-play-large:hover {
        background-image: url(data:image/png;base64,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);
        width: 40px;
        height: 40px
    }

    .zm-video .icon-play-large:hover {
        background-position: -40px -50px
    }

    .zm-video video[isZMVideo=true]::-webkit-media-controls {
        display: none !important
    }

    .zm-video video[isZMVideo=true]::-moz-media-controls {
        display: none !important
    }

    .zm-video video[isZMVideo=true]::-o-media-controls {
        display: none !important
    }

    .zm-video video[isZMVideo=true]::media-controls {
        display: none !important
    }
</style>