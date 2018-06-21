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
        data: function() {
            return {
                items: [],
                activeIndex: 0,
                timer: null 
            }
        },
        methods: {
            setActiveItem: function(t) {
                this.clear();
                var e = t;
                e < 0 ? e = this.items.length - 1 : t > this.items.length - 1 && (e = 0),
                this.items[e].active = !0,
                this.setSideActive(e),
                this.activeIndex = e
            },
            setSideActive: function(t) {
                0 === t ? this.setValue(this.items.length - 1, 1) : t === this.items.length - 1 ? this.setValue(t - 1, 0) : this.setValue(t - 1, t + 1)
            },
            setValue: function(t, e) {
                this.items[e].activeRight = !0,
                this.items[t].activeLeft = !0
            },
            clear: function() {
                this.items.forEach(function(t) {
                    t.active = !1,
                    t.activeLeft = !1,
                    t.activeRight = !1
                })
            },
            autoPlay: function() {
                var t = this;
                clearInterval(this.timer),
                this.timer = setInterval(function() {
                    t.setActiveItem(t.activeIndex + 1)
                }, 5e3)
            },
            onMouseEnter: function() {
                clearInterval(this.timer)
            }
        },
        mounted: function() {
            var t = this;
            this.$nextTick(function() {
                t.items = t.$children,
                t.items[0].active = !0,
                t.setValue(t.items.length - 1, 1),
                t.autoPlay()
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