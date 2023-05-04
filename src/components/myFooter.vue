<template lang="">
    <div class="footer" id="footer" :class="{'strongBackground':showAbout && !darkMode,'strongBackground-dark':showAbout && darkMode}">
        <div class="about">
            <footer class="py-3">
                <!-- <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                    <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">首页</a></li>
                    <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">文章</a></li>
                    <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">工具</a></li>
                    <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">关于</a></li>
                </ul> -->
                <div class="d-flex justify-content-center about py-3">
                    <div class="px-lg-5 px-sm-4 px-2">
                        <a href="https://space.bilibili.com/6169450" target="_blank" :class="{'text-dark': darkMode}">
                            <i class="iconfont icon-bilibili-line" style="font-size: 3rem;"></i>
                            <p class="aboutText" :class="{'aboutText-dark':darkMode}">Bilibili</p>
                        </a>
                    </div>
                    <div class="px-lg-5 px-sm-4 px-2">
                        <a href="mailto:a781076764@gmail.com" target="_blank" :class="{'text-dark': darkMode}">
                            <i class="iconfont icon-email" style="font-size: 3rem;"></i>
                            <p class="aboutText" :class="{'aboutText-dark':darkMode}">E-mail</p>
                        </a>
                    </div>
                    <div class="px-lg-5 px-sm-4 px-2">
                        <a href="https://github.com/781076764" target="_blank" :class="{'text-dark': darkMode}">
                            <i class="iconfont icon-github" style="font-size: 3rem;"></i>
                            <p class="aboutText" :class="{'aboutText-dark':darkMode}">Github</p>
                        </a>
                    </div>
                    <div class="px-lg-5 px-sm-4 px-2">
                        <a href="https://gitee.com/lu-yuze" target="_blank" :class="{'text-dark': darkMode}">
                            <i class="iconfont icon-gitee" style="font-size: 3rem;"></i>
                            <p class="aboutText" :class="{'aboutText-dark':darkMode}">Gitee</p>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
        <div class="footText">
            <div class="d-flex justify-content-center">
                <a target="_blank" href="https://beian.miit.gov.cn">
                    粤ICP备2021151052号
                </a>
            </div>
            <div class="d-flex justify-content-center">
                <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44120302000081">
                    <img src="../../public/image/beian.png" />
                    粤公网安备44120302000081号
                </a>
            </div>
            <div class="text-center text-muted">&copy; 2023 lyz</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'myFooter',
        data() {
            return {
                showAbout: false
            }
        },
        computed: {
            darkMode() {
                return this.$store.state.darkMode
            }
        },
        mounted() {
            this.$bus.on('showAbout', (params) => {
                this.showAbout = params
                setTimeout(() => {
                    this.showAbout = false
                }, 2000);
            })
        },
    }
</script>
<style scoped>
    a {
        color: #3e64ff;
        text-decoration: none;
    }

    .aboutText {
        color: rgb(90, 90, 90);
        text-align: center;
    }

    .about a {
        color: #333333;
        text-decoration: none;
    }

    .nav-item {
        margin: 0 5%;
    }

    .footText {
        line-height: 3em;
    }

    .footer {
        line-height: 2em;
    }

    .strongBackground {
        animation: flash 2s ease-in-out;
        transition: .7s ease;
    }

    @keyframes flash {
        0% {
            background: #ffffff;
        }

        25% {
            background: #ffbe31;
        }

        50% {
            background: #ffffff;
        }

        75% {
            background: #ffbe31;
        }

        100% {
            background: #ffffff;
        }
    }

    .strongBackground-dark{
        animation: flash-dark 2s ease-in-out;
        transition: .7s ease;
    }

    @keyframes flash-dark {
        0% {
            background: #212529;
        }

        25% {
            background: #414141;
        }

        50% {
            background: #212529;
        }

        75% {
            background: #414141;
        }

        100% {
            background: #212529;
        }
    }
</style>