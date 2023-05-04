<template>
    <div class="container-fluid indexBk d-flex">
        <video autoplay loop muted="true" webkit-playsinline playsinline x5-video-player-type="h5-page"
            ref="videoPlayer" style="z-index:1;">
            <source src="../assets/video/background.mp4" type="video/mp4" />
        </video>
        <div class="align-self-center flex-fill text-center titleContainer" style="z-index: 2;">
            <div class="titleText">
                <p>工具与开发历程分享</p>
            </div>
            <div class="py-2">
                <button type="button" class="px-3 py-2 mx-2 myGotoBtn" :class="{'myGotoBtn-dark': darkMode}"
                    @click="goToBlog">去文章页看看</button>
                <!-- <button type="button" class="btn btn-lg btn-outline-light px-3 py-2 mx-2 myInfoBtn"
                    @click="goToAbout">关于</button> -->
            </div>
        </div>
    </div>
</template>
<script>
    import wx from 'weixin-js-sdk'
    export default {
        name: 'myMain',
        mounted() {
            wx.config({
                debug: false,
                appId: '111',
                timestamp: '111',
                nonceStr: '111',
                signature: '111',
                jsApiList: []
            })
            wx.ready(() => {
                let video = this.$refs.videoPlayer;
                video.play();
            });
        },
        computed:{
            darkMode(){
                return this.$store.state.darkMode
            }
        },
        methods: {
            goToBlog() {
                this.$router.push('/myBlog')
            },
            goToAbout() {
                document.getElementById("footer").scrollIntoView();
                this.$bus.emit("showAbout", true);
            }
        },
    }
</script>
<style scoped>
    video {
        position: absolute;
        right: 0px;
        bottom: 0px;
        min-width: 100%;
        min-height: 100%;
        height: auto;
        width: auto;
        z-index: -11;
    }

    .indexBk {
        /* background-image: url("https://api.kdcc.cn/img/bingimg/2020/12/10.jpg"); */
        /* background-image: url("https://api.kdcc.cn"); */
        /* background-image: url("https://api.kdcc.cn/img/bingimg/2022/02/02.jpg"); */
        background-image: url('../assets/image/background.jpg');
        background-size: cover;
        height: 100%;
        /* width: 100%; */
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
        height: 100vh;
    }

    .titleContainer {
        padding-bottom: 15%;
    }

    .titleText {
        color: rgba(255, 255, 255);
        font-size: 80px;
        font-weight: bolder;
        /* background: linear-gradient(to left, #ffebed,#ff6473, #ff1333); */
        background-color: #4158D0;
        background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        color: transparent;
        animation: titleAnimation 5s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-timing-function: linear;
    }

    @keyframes titleAnimation {
        0% {
            background-position: 0 0
        }

        100% {
            background-position: 100% 0
        }
    }

    @media screen and (max-width: 768px) {
        .titleText {
            font-size: 30px;
        }

        .titleContainer {
            padding-top: 50%;
        }
    }

    @media screen and (min-width:769px) and (max-width: 1200px) {
        .titleText {
            font-size: 60px;
        }
    }

    .myGotoBtn {
        /* color: rgba(0, 0, 0, 0.8); */
        color: white;
        font-size: 1.25rem;
        vertical-align: middle;
        border-radius: .3rem;
        border: 0;
        background-color: #21D4FD;
        background-image: linear-gradient(90deg,#B721FF 0%,#21D4FD 100% );
        background-size: 200% 100%;
        transition: .5s ease;
    }
    .myGotoBtn-dark{
        color: black;
    }

    .myGotoBtn:hover {
        /* color: black; */
        background-position: 100% 0;
        color: rgba(0, 0, 0, 0.8);
        /* color: white; */
        transition: .3s linear;
    }
    .myGotoBtn-dark:hover{
        color: rgb(41, 41, 41) !important;
    }

    /* .myInfoBtn:hover {
        color: black;
        transition: .3s linear;
    } */
</style>