<template>
    <div class="carousel"
        ref="carousel"
        @mouseenter="handleButtonEnter"
        @mouseleave="handleButtonLeave">
        <div class="arrow arrow-left"
            v-show="arrowShow"
            @mouseenter="handleButtonEnter"
            @click.stop="slide(-1)">
            <i class="el-icon-arrow-left"></i>
        </div>
        <div class="arrow arrow-right"
            v-show="arrowShow"
            @mouseenter="handleButtonEnter"
            @click.stop="slide(1)">
            <i class="el-icon-arrow-right"></i>
        </div>
        <div class="carousel-panel"
            ref="panel"
            @mouseenter="handleButtonEnter"
            :style="{width: `${panelWidth}px`}">
            <slot></slot>
        </div>
        <div class="carousel-indicators" v-if="indicator && totalLength > 1">
            <div class="carousel-indicator"
                v-for="index in totalLength/2"
                :key="index"
                @mouseenter="indicatorHover(index - 1)"
                :class="{'indicator-active': currentIndex === index - 1}">
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            move: {
                type: String,
                default: "610px"
            },
            type: {
                type: String,
                default: "seamless"
            },
            animated: {
                type: Boolean,
                default: false
            },
            interval: {
                type: String,
                default: "3000"
            },
            stopInterval: {
                type: Boolean,
                default: false
            },
            showIndicator: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                totalLength: 0,
                // 面板宽度
                panelWidth: 0,
                // 左右按钮显示
                arrowShow: false,
                // 当前小图下标
                currentIndex: 0,
                // 当前大图下标
                largeCurrentIndex: 0,
                // 定时器ID
                intervalId: 0,
                timeoutId: 0,
                // 是否展示小图标
                indicator: false,
                // item宽度
                carouselItemWidth: 0,
                // 页面宽度
                width: 0,
                // item偏移
                startOffset: 0,
                endOffset: 0,
                // 两侧宽度
                sideWidth: 0,
                // 操作数组
                operations: []
            }
        },
        methods: {
            initData() {
                var carouselStyle = getComputedStyle(this.$refs.carousel),
                    children = this.$refs.panel.children;
                // 设置小图展示
                this.indicator = this.showIndicator;
                // 重置数量
                this.totalLength = "common" === this.type ? 2 * children.length : children.length;
                // 设置初始图片下标
                this.largeCurrentIndex = this.totalLength / 2;
                // 容器宽度
                this.width = parseInt(carouselStyle.width, 10);
                // item宽度，移动距离
                this.carouselItemWidth = parseInt(this.move, 10);
                // 图片两侧宽度
                this.sideWidth = parseInt((this.width - this.carouselItemWidth) / 2, 10);
                // panel宽度
                this.panelWidth = children.length * this.carouselItemWidth;
                // 初始化偏移
                this.startOffset = this.sideWidth;
            },
            // 设置偏移值
            setOffset() {
                var t = this;
                this.totalLength / 2 > 1 ? "seamless" === this.type ? (this.startOffset = (this.totalLength / 2 - 1) *
                        this.carouselItemWidth * -1 - (this.carouselItemWidth - this.startOffset),
                        this.endOffset = this.carouselItemWidth * (this.totalLength - 1) - Math.abs(this.startOffset)
                    ) : "common" === this.type && (this.startOffset = -1 * this.carouselItemWidth,
                        this.endOffset = this.carouselItemWidth * (this.totalLength / 2 - 2)) : this.indicator = !1;
                this.$nextTick(function () {
                    t.initTranslateX(),
                        "common" === t.type && t.itemMove(t.carouselItemWidth, "initial-offset")
                })
            },
            // 按钮显示、隐藏判断
            handleButtonEnter() {
                if (this.totalLength <= 2) return;
                this.arrowShow = true;
                this.clear();
            },
            handleButtonLeave() {
                this.arrowShow = false;
                this.clear();
                this.timeoutId = setTimeout(function () {
                    this.$refs.panel.children.length > 1 && this.setInterval()
                }, 5000)
            },
            // 设置translateX初始值
            initTranslateX() {
                var children = this.$refs.panel.children,
                    translate = this.startOffset;
                Array.prototype.forEach.call(children, function (item) {
                    this.setAnimation(item, translate),
                    translate += this.carouselItemWidth
                });
                if (children.length > 1) {
                    this.clear();
                    this.setInterval();
                }
            },
            // 移动图片
            itemMove(val, type) {
                var children = this.$refs.panel.children,
                    direction = t > 0 ? -1 : 1;

                if (this.largeCurrentIndex + direction > this.totalLength - 1) {
                    this.largeCurrentIndex = 0;
                } else if (this.largeCurrentIndex + direction < 0) {
                    this.largeCurrentIndex = this.totalLength - 1;
                }　else {
                    this.largeCurrentIndex += direction;
                }

                Array.prototype.forEach.call(children, function (item, index) {
                    var transform = item.style.transform,
                        translate = "" === transform ? val : parseInt(transform.split("translateX(")[1], 10) + val,
                        className = type ? item.className : item.className.replace(/\s*(no-transition|is-active|animated|initial)/gi, "");
                    if (translate > this.endOffset) {
                        translate = this.startOffset;
                        className += " no-transition";
                    } else if (translate < this.startOffset) {
                        translate = this.endOffset;
                        className += " no-transition";
                    }
                    if (index === this.largeCurrentIndex) {
                        className += " is-active";
                    }

                    className += this.animated ? " animated" : "",
                    item.className = className,
                    this.setAnimation(item, translate, direction)
                });
            },
            iconMove(val) {
                if (0 === this.currentIndex && val < 0) {
                    this.currentIndex = this.totalLength / 2;
                } else if (this.currentIndex === this.totalLength / 2 - 1 && val > 0 ) {
                    this.currentIndex = -1;
                }
                this.currentIndex = this.currentIndex + val;
            },
            // 设置动画效果
            setAnimation(el, translate, direction) {
                var transform = "translateX(" + translate + "px)",
                    leftTranslate = this.sideWidth - this.carouselItemWidth,
                    rightTranslate = this.sideWidth + this.carouselItemWidth,
                    origin = "";
                if (this.animated) {
                    if (translate < this.sideWidth)　{
                        origin = "right";
                    } 
                    if (translate > this.sideWidth)　{
                        origin = "left";
                    } 
                    if ( translate === leftTranslate || translate === rightTranslate)　{
                        transform += " scale(0.9)";
                    } 
                    if (translate === this.sideWidth)　{
                        origin = direction > 0 ? "left" : "right"
                    } 
                } 
                el.style.transformOrigin = origin;
                el.style.transform = transform;
            },
            // 设置定时播放
            setInterval(t) {
                if (!this.stopInterval) {
                    this.intervalId = setInterval(function () {
                        t.slide(1)
                    }, this.interval)
                }
            },
            clear() {
                clearTimeout(this.timeoutId),
                clearInterval(this.intervalId)
            },
            // 小图标事件
            indicatorEvent(index) {
                var direction = index < this.currentIndex ? -1 : 1,
                    i = 0;
                for (i; i < Math.abs(index - this.currentIndex); i++)
                    this.itemMove(direction * this.carouselItemWidth * -1);
                this.currentIndex = index;
            },
            // 点击移动图片事件
            clickMoveItem(index) {
                if (index > this.largeCurrentIndex || 0 === index && this.largeCurrentIndex === this.totalLength - 1) {
                    if (index === this.totalLength - 1 && 0 === this.largeCurrentIndex) {
                        this.slide(-1);
                    } else {
                        this.slide(1);
                    }
                } else if (index < this.largeCurrentIndex) {
                    this.slide(-1);
                }
                
            }
        },
         mounted: function () {
            this.initData(),
                this.setOffset(),
                this.slide = throttle((val) => {
                    this.iconMove(val),
                    this.itemMove(val * this.carouselItemWidth * -1)
                }, 300),
                this.indicatorHover = throttle((index) => {
                    this.indicatorEvent(index)
                }, 200)
        },
        beforeDestroy: function () {
            this.clear()
        }
    }
</script>

<style lang="scss" scoped>
    .carousel {
        position: relative;
        overflow: hidden;
        padding: 1px;
        width: 100%;
        height: 257px
    }

    .carousel .arrow {
        position: absolute;
        z-index: 5;
        top: 33%;
        height: 71px;
        line-height: 71px;
        width: 26px;
        text-align: center;
        font-size: 12px;
        color: hsla(0, 0%, 100%, .6);
        background-color: rgba(0, 0, 0, .75);
        cursor: pointer
    }

    .carousel .arrow:hover {
        color: hsla(0, 0%, 100%, .84);
        background-color: rgba(0, 0, 0, .84)
    }

    .carousel .arrow-left {
        left: 0;
        border-bottom-right-radius: 3px;
        border-top-right-radius: 3px
    }

    .carousel .arrow-right {
        right: 0;
        border-bottom-left-radius: 3px;
        border-top-left-radius: 3px
    }

    .carousel .carousel-panel {
        position: absolute;
        z-index: 1
    }

    .carousel .carousel-panel .carousel-item {
        position: absolute;
        -webkit-transition: -webkit-transform .4s ease-in-out;
        transition: -webkit-transform .4s ease-in-out;
        transition: transform .4s ease-in-out;
        transition: transform .4s ease-in-out, -webkit-transform .4s ease-in-out;
        z-index: 1;
        cursor: pointer
    }

    .carousel .carousel-panel .animated {
        -webkit-transition: -webkit-transform .6s ease-in-out;
        transition: -webkit-transform .6s ease-in-out;
        transition: transform .6s ease-in-out;
        transition: transform .6s ease-in-out, -webkit-transform .6s ease-in-out
    }

    .carousel .carousel-panel .initial,
    .carousel .carousel-panel .no-transition {
        -webkit-transition: none;
        transition: none
    }

    .carousel .carousel-panel .is-active {
        z-index: 2
    }

    .carousel .carousel-indicators {
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
        z-index: 5;
        bottom: 0;
        width: 100%;
        height: 25px
    }

    .carousel .carousel-indicators .carousel-indicator {
        margin: 0 4px;
        border-radius: 1px;
        height: 6px;
        width: 16px;
        cursor: pointer;
        background-color: hsla(0, 0%, 100%, .13)
    }

    .carousel .carousel-indicators .indicator-active {
        background-color: #00a7ec
    }
</style>