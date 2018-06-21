<template>
    <div class="gallery-item" 
        :class="{
            'active': active,
            'gallery-right': galleryRight,
            'gallery-left': galleryLeft
        }"
        @click.stop="clickItem">
            <slot></slot>
            <div class="gallery-mask"></div>
        </div>
</template>
<script>
    export default {
        data() {
            return {
                active: false,
                activeRight: false,
                activeLeft: false
            }
        },
        methods: {
            clickItem: function() {
                var currentIndex = this.$parent.$children.indexOf(this);
                this.$emit("clickItem", currentIndex === this.$parent.activeIndex),
                this.$parent.setActiveItem(currentIndex)
            }
        }
    }
</script>

<style lang="scss" scoped>
.gallery-item {
    position: absolute;
    top: 0;
    left: 45px;
    z-index: 1;
    outline: 1px solid transparent;
    width: 495px;
    height: 100%;
    -webkit-transition: all .4s ease-out;
    transition: all .4s ease-out;
    -webkit-transform: translateZ(-1000px) rotateY(0);
    transform: translateZ(-1000px) rotateY(0);
    cursor: pointer
}

.gallery-mask {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,.5)
}

.gallery-left,.gallery-right {
    z-index: 3
}

.gallery-right {
    -webkit-transform: translate3d(135px,0,-210px) rotateY(-45deg);
    transform: translate3d(135px,0,-210px) rotateY(-45deg)
}

.gallery-left {
    -webkit-transform: translate3d(-135px,0,-210px) rotateY(45deg);
    transform: translate3d(-135px,0,-210px) rotateY(45deg)
}

.active {
    z-index: 4;
    -webkit-transform: translateZ(0) rotateY(0);
    transform: translateZ(0) rotateY(0)
}

.active .gallery-mask {
    display: none
}
</style>