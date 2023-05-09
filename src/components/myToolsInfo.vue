<template>
    <div class="myToolsInfo py-5">
        <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
            aria-label="breadcrumb" class="snav">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <routerLink to="/">首页</routerLink>
                </li>
                <li class="breadcrumb-item" aria-current="page">
                    <routerLink to="/myTools">工具列表</routerLink>
                </li>
                <li class="breadcrumb-item active">
                    {{toolsData[0].title}}
                </li>
            </ol>
        </nav>

        <div class="blogTitle">
            <h1 :class="{'text-dark':darkMode,'text-body':!darkMode}">{{toolsData[0].title}}</h1>
            <div class="d-flex createText">
                <div class="createTime">
                    <span>{{toolsData[0].createTime}}</span>
                </div>
                <div class="createUser px-4">
                    <i class="bi bi-person-circle"></i><span>{{toolsData[0].createUser}}</span>
                </div>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-xl-7 text" :class="{'text-dark':darkMode,'text-body':!darkMode}">
                {{toolsData[0].text}}
            </div>
            <div class="img col-xl-5 align-self-center">
                <img :src="toolsData[0].imageSrc" class="img-fluid rounded-3" alt="" width="" height=""
                    v-if="toolsData[0].imageSrc != null">
                <img src='../../public/image/暂无图片.png' class="img-fluid rounded-3" alt="" width=""
                    height="" v-else>
            </div>
        </div>
        <div class="download d-flex justify-content-center my-5">
            <div class="card text-center downloadCard" :class="{'bg-dark border-dark':darkMode,'bg-body': !darkMode}">
                <div class="card-body">
                    <h5 class="card-title" :class="{'text-dark':darkMode,'text-body':!darkMode}">本文附件</h5>
                    <p class="card-text py-2" :class="{'text-dark':darkMode,'text-body':!darkMode}"
                        style="margin-bottom: 0;">
                        <i class="bi bi-file-earmark-arrow-down-fill"></i>
                        {{toolsData[0].downloadName != null?(toolsData[0].downloadName !=
                        ''?toolsData[0].downloadName:'无附件'): '无附件'}}
                    </p>
                    <p class="card-text"><small class="text-muted">
                            {{toolsData[0].downloadDesc != null?(toolsData[0].downloadDesc !=
                            ''?toolsData[0].downloadDesc:''): ''}}
                        </small></p>
                    <div class="d-grid gap-2 col-md-4 mx-auto">
                        <a class="btn btn-outline-primary"
                            :class="{'disabled': downloadBtnFlash || toolsData[0].downloadSrc == undefined || toolsData[0].downloadSrc == null || toolsData[0].downloadSrc == '', 'btn-outline-primary': !darkMode,'btn-outline-light': darkMode}"
                            @click="handleDownload">
                            <span
                                :class="{'spinner-border spinner-border-sm': downloadBtnFlash}"></span>{{downloadBtnText}}</a>
                    </div>
                </div>
            </div>
        </div>
        <commentSent :id="id" type="tools" />
        <commentList :id="id" type="tools" />
    </div>
</template>
<script>
    import commentSent from './commentSent.vue'
    import commentList from './commentList.vue'
    export default {
        name: 'myToolsInfo',
        components: { commentSent, commentList },
        data() {
            return {
                toolsData: [{}],
                downloadBtnFlash: false,
                downloadBtnText: '下载',
                id: this.$route.query.id
            }
        },
        computed: {
            darkMode() {
                return this.$store.state.darkMode
            }
        },
        mounted() {
            this.axios.get("https://lyz0613.top/mypageServer/blog/getToolsInfoData.php", {
                params: {
                    id: this.$route.query.id
                }
            }).then((res) => {
                this.toolsData = res.data
            })
        },
        methods: {
            handleDownload() {
                this.downloadBtnText = '获取中...'
                this.downloadBtnFlash = true
                setTimeout(() => {
                    this.downloadBtnFlash = false
                    this.downloadBtnText = '下载'
                    // window.location.href = this.toolsData[0].downloadSrc
                    window.open(this.toolsData[0].downloadSrc)
                }, 2000);
            }
        },
    }
</script>
<style scoped>
    .snav a {
        text-decoration: none;
        color: rgb(115, 91, 255);
    }

    .createText {
        color: rgb(150, 150, 150);
    }

    .myToolsInfo {
        margin: 5% 10%;
    }

    .blogTitle {
        margin: 2vh 0 1vh 0%;
    }

    .text {
        font-size: 1.5em;
    }

    .downloadCard {
        width: 40%;
    }

    @media screen and (max-width:768px) {
        .downloadCard {
            width: 100%;
        }
    }

    @media screen and (min-width:769px) and (max-width:1200px) {
        .downloadCard {
            width: 60%;
        }
    }
</style>