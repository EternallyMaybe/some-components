<template>
    <div class="image-operation">
        <div class="operations">
            <div class="operation-item pick-up" @click.stop="pickup">
                <i class="icon-pickup"></i>收起
            </div>
            <div class="operation-item view-original" @click.stop="viewOriginal">
                <i class="icon-view"></i>查看大图
            </div>
            <div class="operation-item turn-left" @click.stop="turn(-90)">
                <i class="icon-turn-left"></i>向左转
            </div>
            <div class="operation-item turn-right" @click.stop="turn(90)">
                <i class="icon-turn-right"></i>向右转
            </div>
        </div>
        <div class="big-img" :style="{height: areaHeight}">
            <img :src="formatImages[currentIndex]" 
                class="operation-img"
                :class="{'limit-height': isLimit}"
                :style="{transform: `rotate(${rotate}deg)`, marginTop: `${marginTop}px`}"
                ref="image">
        </div>
        <div class="small-images" v-if="formatImages.length > 1">
            <div v-for="(img, index) in formatImages" 
                :key="index"
                class="img-box"
                :class="{'img-selected': index === currentIndex}"
                @click.stop="changeImg(index)">
                <img :src="img" @load="loadImage">
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            images: Array,
            selected: Number
        },
        data: function () {
            return {
                rotate: 0,
                formatImages: this.dealData(this.images),
                currentIndex: this.selected,
                isLimit: false,
                areaHeight: "auto",
                marginTop: "0"
            }
        },
        methods: {
            dealData: function (data) {
                return data.map((item) => data.replace(/(https?:)?\/\//, "http://"));
            },
            pickup: function () {
                this.$emit("pickup")
            },
            viewOriginal: function () {

            },
            turn: function (deg) {
                var direction = deg > 0 ? 1 : -1,
                    rotate = this.rotate + deg === 360 * direction ? 0 : this.rotate + deg;
                this.isLimit = rotate % 180 != 0,
                    this.rotate = rotate,
                    this.setImageStyle(this.isLimit)
            },
            setImageStyle: function (t) {
                let image = this.$refs.image,
                    height = image.clientHeight,
                    width = image.clientWidth,
                    radio = height / width;
                if (limit && height > this.maxWidth) {
                    height = this.maxWidth;
                    width = height / radio;
                }
                this.areaHeight = limit ? width + "px" : "auto",
                    this.marginTop = limit ? (width - height) / 2 : 0
            },
            loadImage: function (event) {
                let target = event.target;
                target.className = target.naturalHeight / target.naturalWidth > 1 ? "fixed-width" : "fixed-height"
            },
            changeImg: function (index) {
                this.rotate = 0,
                    this.isLimit = false,
                    this.marginTop = 0,
                    this.areaHeight = "auto",
                    this.currentIndex = index
            }
        }
    }
</script>
<style lang="scss" scoped>
    .image-operation {
        margin-top: 16px;
        box-sizing: border-box;
        padding: 18px 24px;
        width: 544px;
        background: #f0f0f0
    }

    .image-operation .operations {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex
    }

    .image-operation .operations .operation-item {
        margin-right: 28px;
        cursor: pointer
    }

    .image-operation .operations .operation-item i {
        display: inline-block;
        vertical-align: top;
        margin-right: 5px
    }

    .image-operation .operations .operation-item i.icon-pickup {
        margin-top: -2px
    }

    .image-operation .operations .operation-item:hover {
        color: #4fb3f4
    }

    .image-operation .operations .operation-item:active {
        color: #2f97db
    }

    .image-operation .big-img {
        overflow: hidden;
        position: relative;
        margin-top: 22px;
        width: 496px;
        height: auto;
        text-align: center
    }

    .image-operation .big-img img {
        max-width: 496px
    }

    .image-operation .big-img .limit-height {
        max-height: 496px
    }

    .image-operation .small-images {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        margin-top: 10px;
        width: 100%
    }

    .image-operation .small-images .img-box {
        overflow: hidden;
        position: relative;
        margin-right: 7px;
        border: 1px solid rgba(0, 0, 0, .1);
        width: 50px;
        height: 50px
    }

    .image-operation .small-images .img-box img {
        position: absolute
    }

    .image-operation .small-images .img-selected {
        border: 2px solid #00a7ec
    }

    .image-operation .small-images .fixed-width {
        top: 50%;
        width: 50px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%)
    }

    .image-operation .small-images .fixed-height {
        left: 50%;
        height: 50px;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%)
    }
</style>