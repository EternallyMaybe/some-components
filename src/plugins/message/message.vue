<template>
    <div class="dialogs" v-show="show">
        <div class="dialog message">
            <div class="title">
                <span class="tips">{{title}}</span>
                <i class="icon-small-close close" @click="hideMessage"></i>
            </div>
            <div class="main-body">
                <div class="wrapper">
                    <span>{{content}}</span>
                </div>
                <div class="pull-right op">
                    <button class="blue-full-button" @click="handle('confirm')" v-if="confirmText">{{confirmText}}</button>
                    <button class="blue-full-button" @click="handle('cancel')" v-if="cancelText">{{cancelText}}</button>
                </div>
            </div>
        </div>
        <div class="model"></div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                show: false,
                title: "提示",
                content: "",
                type: "success",
                confirmText: "",
                cancelText: "",
                resolve: void 0,
                reject: void 0
            }
        },
        methods: {
            handle: function (type) {
                this.hideMessage();
                "confirm" === type ? this.resolve() : this.reject()
            },
            showMessage: function () {
                this.show = true;
            },
            hideMessage: function () {
                this.show = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/css/button.scss';
    .dialogs .dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        box-sizing: border-box;
        padding-top: 35px;
        width: 503px;
        font-size: 13px;
        z-index: 10;
        transform: translate3d(-50%, -50%, 0)
    }

    .dialogs .dialog.small {
        width: 409px;
        height: 200px
    }

    .dialogs .dialog.small>.main-body {
        text-align: center
    }

    .dialogs .dialog>.title {
        position: absolute;
        top: 0;
        width: 100%;
        height: 35px;
        line-height: 35px;
        color: #ccc;
        background-color: #3c3c3e
    }

    .dialogs .dialog>.title .tips {
        margin: 0 14px
    }

    .dialogs .dialog>.title .close {
        margin: 6px;
        float: right;
        color: gray;
        cursor: pointer
    }

    .dialogs .dialog>.title .close:hover {
        color: #c1c2c4
    }

    .dialogs .dialog>.main-body {
        overflow: hidden;
        box-shadow: 0 1px 12px 0 rgba(51, 51, 51, .2);
        box-sizing: border-box;
        border: 1px solid #e7e7e7;
        height: 100%;
        background-color: #fff
    }

    .dialogs .dialog>.main-body>.wrapper {
        overflow: hidden;
        padding: 22px;
        line-height: 23px;
        color: #333
    }

    .dialogs .dialog>.main-body>.wrapper .tips i {
        float: left;
        margin: 6px 14px
    }

    .dialogs .dialog>.main-body>.wrapper .code {
        height: 95px;
        margin: 40px 0 0 55px
    }

    .dialogs .dialog>.main-body>.wrapper .code img {
        width: 76px;
        height: 76px;
        vertical-align: middle;
        float: left
    }

    .dialogs .dialog>.main-body>.wrapper .code .tips {
        float: left;
        width: 205px;
        padding: 15px 20px
    }

    .dialogs .dialog>.main-body>.op {
        margin-bottom: 18px
    }

    .dialogs .dialog button {
        float: left;
        width: 88px;
        height: 32px;
        margin-right: 13px
    }

    .dialogs div.model {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: .4;
        background: #000;
        z-index: 8
    }

    .dialogs .message {
        left: 50%;
        width: 400px;
        transform: translate(-50%, -50%);
    }

    .dialogs .message .wrapper {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center
    }

    .dialogs .message .wrapper i {
        margin-right: 14px
    }
</style>