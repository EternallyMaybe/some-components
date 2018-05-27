<template>
    <div class="index">
        这是{{page}}页面
        <label>label</label>
        <img src="../static/image/左.png"/>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                page: 'index'
            }
        },
        methods: {

        },
        created() {
            // 加点注释 
            let params = ['123', '123'];
        }
    }
</script>
<style lang="scss" scoped>
    @import '../assets/css/index.scss';
    
    .index {
        background-color: red;
        label {
            color: #000;
        }
    }
</style>