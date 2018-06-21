<template>
    <div class="gallery" @mouseenter="onMouseEnter" @mouseleave="autoPlay">
        <div class="gallery-container">
            <slot></slot>
        </div>
        <div class="slide-btn left-slide-btn" @click.stop="setActiveItem(activeIndex - 1)" v-show="this.items.length > 2">
            <div class="icon-font icon-angle-left"></div>
        </div>
        <div class="slide-btn right-slide-btn"  @click.stop="setActiveItem(activeIndex + 1)" v-show="this.items.length > 2">
            <div class="icon-font icon-angle-right"></div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                items: [],
                activeIndex: 0,
                timer: null 
            }
        },
        methods: {
            setActiveItem(activeIndex) {
                this.clear();
                let realIndex = activeIndex;
                if (realIndex < 0) {
                    realIndex = this.items.length - 1; 
                } else if (activeIndex > this.items.length - 1) {
                    realIndex = 0;
                }
                this.items[realIndex].active = false;
                this.setSideActive(realIndex);
                this.activeIndex = realIndex;
            },
            setSideActive(activeIndex) {
                if (0 === activeIndex) {
                    this.setValue(this.items.length - 1, 1);
                } else if (activeIndex === this.items.length - 1) {
                    this.setValue(activeIndex - 1, 0);
                } else {
                    this.setValue(activeIndex - 1, activeIndex + 1);
                }
            },
            setValue(activeLeftIndex, activeRightIndex) {
                this.items[activeLeftIndex].activeRight = true;
                this.items[activeRightIndex].activeLeft = true;
            },
            clear() {
                this.items.forEach(function(item) {
                    item.active = false;
                    item.activeLeft = false;
                    item.activeRight = false;
                })
            },
            autoPlay() {
                clearInterval(this.timer),
                this.timer = setInterval(function() {
                    this.setActiveItem(t.activeIndex + 1)
                }, 5000)
            },
            onMouseEnter() {
                clearInterval(this.timer)
            }
        },
        mounted: function() {
            this.$nextTick(function() {
                this.items = this.$children,
                this.items[0].active = !0,
                this.setValue(this.items.length - 1, 1),
                this.autoPlay()
            })
        }
    }
</script>

<style lang="scss" scoped>
.gallery {
    width: 100%;
    position: relative;
    overflow: hidden
}

.gallery .gallery-container {
    -webkit-perspective: 590px;
    perspective: 590px;
    display: block;
    overflow: hidden;
    margin: 0 auto;
    width: 100%;
    height: 100%
}

.gallery .slide-btn {
    position: absolute;
    top: 0;
    text-align: center;
    width: 30px;
    height: 100%;
    color: #fff;
    cursor: pointer
}

.gallery .slide-btn.left-slide-btn {
    left: 0
}

.gallery .slide-btn.right-slide-btn {
    right: 0
}

.gallery .slide-btn:hover {
    color: #00a7ec
}

.gallery .slide-btn:active {
    color: #2f97db
}

.gallery .slide-btn .icon-font {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    font-size: 25px
}
</style>