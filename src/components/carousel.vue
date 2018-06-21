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
        data: function () {
            return {
                totalLength: 0,
                panelWidth: 0,
                arrowShow: !1,
                currentIndex: 0,
                largeCurrentIndex: 0,
                intervalId: 0,
                timeoutId: 0,
                indicator: !0,
                carouselItemWidth: 0,
                width: 0,
                startOffset: 0,
                endOffset: 0,
                sideWidth: 0,
                operations: []
            }
        },
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
                default: !1
            },
            interval: {
                type: String,
                default: "3000"
            },
            stopInterval: {
                type: Boolean,
                default: !1
            },
            showIndicator: {
                type: Boolean,
                default: !0
            }
        },
        mounted: function () {
            var t = this;
            this.initData(),
                this.setOffset(),
                this.slide = i.i(a.a)(function (e) {
                    t.iconMove(e),
                        t.itemMove(e * t.carouselItemWidth * -1)
                }, 300),
                this.indicatorHover = i.i(a.a)(function (e) {
                    t.indicatorEvent(e)
                }, 200)
        },
        beforeDestroy: function () {
            this.clear()
        },
        methods: {
            initData: function () {
                var t = getComputedStyle(this.$refs.carousel),
                    e = this.$refs.panel.children;
                this.indicator = this.showIndicator,
                    this.totalLength = "common" === this.type ? 2 * e.length : e.length,
                    this.largeCurrentIndex = this.totalLength / 2,
                    this.width = parseInt(t.width, 10),
                    this.carouselItemWidth = parseInt(this.move, 10),
                    this.sideWidth = parseInt((this.width - this.carouselItemWidth) / 2, 10),
                    this.panelWidth = e.length * this.carouselItemWidth,
                    this.startOffset = this.sideWidth
            },
            setOffset: function () {
                var t = this;
                this.totalLength / 2 > 1 ? "seamless" === this.type ? (this.startOffset = (this.totalLength / 2 - 1) *
                        this.carouselItemWidth * -1 - (this.carouselItemWidth - this.startOffset),
                        this.endOffset = this.carouselItemWidth * (this.totalLength - 1) - Math.abs(this.startOffset)
                    ) : "common" === this.type && (this.startOffset = -1 * this.carouselItemWidth,
                        this.endOffset = this.carouselItemWidth * (this.totalLength / 2 - 2)) : this.indicator = !1,
                    this.$nextTick(function () {
                        t.initTranslateX(),
                            "common" === t.type && t.itemMove(t.carouselItemWidth, "initial-offset")
                    })
            },
            handleButtonEnter: function () {
                this.totalLength <= 2 || (this.arrowShow = !0,
                    this.clear())
            },
            handleButtonLeave: function () {
                var t = this;
                this.arrowShow = !1,
                    this.clear(),
                    this.timeoutId = setTimeout(function () {
                        t.$refs.panel.children.length > 1 && t.setInterval()
                    }, 5e3)
            },
            initTranslateX: function () {
                var t = this,
                    e = this.$refs.panel.children,
                    i = this.startOffset;
                Array.prototype.forEach.call(e, function (e) {
                        t.setAnimation(e, i),
                            i += t.carouselItemWidth
                    }),
                    e.length > 1 && (this.clear(),
                        this.setInterval())
            },
            itemMove: function (t, e) {
                var i = this,
                    a = this.$refs.panel.children,
                    n = t > 0 ? -1 : 1;
                this.largeCurrentIndex + n > this.totalLength - 1 ? this.largeCurrentIndex = 0 : this.largeCurrentIndex +
                    n < 0 ? this.largeCurrentIndex = this.totalLength - 1 : this.largeCurrentIndex += n,
                    Array.prototype.forEach.call(a, function (a, s) {
                        var o = a.style.transform,
                            r = "" === o ? t : parseInt(o.split("translateX(")[1], 10) + t,
                            c = e ? a.className : a.className.replace(
                                /\s*(no-transition|is-active|animated|initial)/gi, "");
                        r > i.endOffset ? (r = i.startOffset,
                                c += " no-transition") : r < i.startOffset && (r = i.endOffset,
                                c += " no-transition"),
                            s === i.largeCurrentIndex && (c += " is-active"),
                            c += i.animated ? " animated" : "",
                            a.className = c,
                            i.setAnimation(a, r, n)
                    })
            },
            iconMove: function (t) {
                0 === this.currentIndex && t < 0 ? this.currentIndex = this.totalLength / 2 : this.currentIndex ===
                    this.totalLength / 2 - 1 && t > 0 && (this.currentIndex = -1),
                    this.currentIndex = this.currentIndex + t
            },
            setAnimation: function (t, e, i) {
                var a = "translateX(" + e + "px)",
                    n = this.sideWidth - this.carouselItemWidth,
                    s = this.sideWidth + this.carouselItemWidth,
                    o = "";
                this.animated && (e < this.sideWidth && (o = "right"),
                        e > this.sideWidth && (o = "left"),
                        e === n && (a += " scale(0.9)"),
                        e === s && (a += " scale(0.9)"),
                        e === this.sideWidth && (o = i > 0 ? "left" : "right")),
                    t.style.transformOrigin = o,
                    t.style.transform = a
            },
            setInterval: function (t) {
                function e() {
                    return t.apply(this, arguments)
                }
                return e.toString = function () {
                        return t.toString()
                    },
                    e
            }(function () {
                var t = this;
                this.stopInterval || (this.intervalId = setInterval(function () {
                    t.slide(1)
                }, this.interval))
            }),
            clear: function () {
                clearTimeout(this.timeoutId),
                    clearInterval(this.intervalId)
            },
            indicatorEvent: function (t) {
                var e = 1,
                    i = void 0;
                for (t < this.currentIndex && (e = -1),
                    i = 0; i < Math.abs(t - this.currentIndex); i++)
                    this.itemMove(e * this.carouselItemWidth * -1);
                this.currentIndex = t
            },
            clickMoveItem: function (t) {
                t > this.largeCurrentIndex || 0 === t && this.largeCurrentIndex === this.totalLength - 1 ? t ===
                    this.totalLength - 1 && 0 === this.largeCurrentIndex ? this.slide(-1) : this.slide(1) : t <
                    this.largeCurrentIndex && this.slide(-1)
            }
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