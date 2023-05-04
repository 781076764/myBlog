<template>
    <div class="myBlog">
        <div class="navs py-5 px-3">
            <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
                aria-label="breadcrumb" class="snav">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <router-link to="/">首页</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        文章列表
                    </li>
                </ol>
            </nav>
        </div>
        <div class="item p-3 my-4" v-for="d in blogList" :key="d.id">
            <router-link :to="'myBlogInfo?id='+d.id" class="listLink" :class="{'listLink-hover-dark': darkMode}">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row">
                            <h2 class="pb-3" style="margin:0">{{d.title}}</h2>
                        </div>
                        <div class="row my-2 myText">
                            <p>{{d.text}}
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4 d-flex justify-content-center">
                        <img :src="d.imageSrc" class="cardImg rounded-3" alt=""
                            v-if="d.imageSrc != null && d.imageSrc != '' && d.imageSrc != undefined">
                        <img src="https://lyz0613.top/server/image/null2.png" class="cardImg rounded-3" alt="" v-else>
                    </div>
                </div>
                <div class="mt-3 d-flex justify-content-between"
                    :class="{'createInfo':!darkMode,'createInfo-dark': darkMode}">
                    <span>{{d.createTime}}</span>
                    <span><i class="bi bi-person-circle"></i>{{d.createUser}}</span>
                </div>
            </router-link>
        </div>
        <div class="item p-3 my-4" v-if="!blogList">
            <div class="row">
                <div class="col-md-8">
                    <div class="row">
                        <h5 class="placeholder-glow">
                            <span class="placeholder col-5"></span>
                        </h5>
                    </div>
                    <div class="row my-2 myText">
                        <p class="placeholder-glow">
                            <span class="placeholder col-7"></span>
                            <span class="placeholder col-8"></span>
                            <span class="placeholder col-6"></span>
                            <span class="placeholder col-9"></span>
                            <span class="placeholder col-7"></span>
                        </p>
                    </div>
                </div>
                <div class="col-md-4 d-flex justify-content-center">
                    <img src="https://lyz0613.top/server/image/null2.png" class="cardImg rounded-3" alt="">
                </div>
            </div>
            <p class="placeholder-glow justify-content-between d-flex mt-3">
                <span class="placeholder bg-secondary" style="width: 10rem;"></span>
                <span class="placeholder bg-secondary" style="width: 3rem;"></span>
            </p>
        </div>
        <!-- 分页组件 -->
        <!-- <div class="d-flex justify-content-center">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item" :class="{'disabled': pageShowIndex == 0}">
                        <a class="page-link" aria-label="Previous" href="#" @click="handlePreviousIndex">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item" v-for="i in Pagination" :key="i" :class="{'active': pageShowIndex+1 == i}"><a
                            class="page-link" href="#" @click="handleChangePageItem" :data-page="i">{{i}}</a></li>
                    <li class="page-item" :class="{'disabled': pageShowIndex+1 == maxShowIndex}">
                        <a class="page-link" aria-label="Next" href="#" @click="handleNextIndex">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div> -->
        <pagination v-if="blogDataLength" class="mt-4" :url="apiUrl" :dataLength="blogDataLength"
            :showDataNum="pageShowNum" :showPageNum="maxPageItem" @resultData="resultData" />
    </div>
</template>
<script>
    import pagination from './pagination.vue'
    export default {
        name: 'myBlog',
        components: { pagination },
        data() {
            return {
                blogList: null,
                blogDataLength: null,
                apiUrl: "/getBlogList.php",
                pageShowNum: 3,//设置一页显示的个数
                maxPageItem: 4,//最大显示分页数
                // pageShowIndex: 0,//当前的页数
                // pageShowItemIndex: 0,//当前数据的下标
                // maxShowIndex: 0,//数据最多填充多少页
                // Pagination: []//页码渲染数组
            }
        },
        computed: {
            darkMode() {
                return this.$store.state.darkMode
            }
        },
        mounted() {
            this.axios.get("https://lyz0613.top/mypageServer/blog/getBlogListLength.php").then((res) => {
                this.blogDataLength = res.data
                // this.maxShowIndex = Math.ceil(this.blogDataLength / this.pageShowNum)
                // if (this.maxPageItem > this.maxShowIndex) {
                //     this.maxPageItem = this.maxShowIndex
                // }
                // for (let index = 0; index < this.maxPageItem; index++) {
                //     this.Pagination.push(this.pageShowIndex + 1 + index)
                // }
            })
            // this.axios.get("https://lyz0613.top/mypageServer/blog/getBlogList.php", {
            //     params: {
            //         index: this.pageShowItemIndex,
            //         num: this.pageShowNum
            //     }
            // }).then((res) => {
            //     this.blogList = res.data
            // })
        },
        methods: {
            //获取分页组件返回的数据
            resultData(data) {
                this.blogList = data
            },
            // //上一页
            // handlePreviousIndex() {
            //     if (this.pageShowIndex <= 0) {
            //         return;
            //     }
            //     this.axios.get("https://lyz0613.top/mypageServer/blog/getBlogList.php", {
            //         params: {
            //             index: this.pageShowItemIndex - this.pageShowNum,
            //             num: this.pageShowNum
            //         }
            //     }).then((res) => {
            //         this.blogList = res.data
            //         this.pageShowIndex -= 1
            //         this.pageShowItemIndex = this.pageShowIndex * this.pageShowNum
            //         //如果数据填充页数大于最大显示页数
            //         if (this.maxShowIndex > this.maxPageItem) {
            //             if ((this.pageShowIndex + 1) == 1) {
            //                 this.Pagination = []
            //                 for (let index = 0; index < this.maxPageItem; index++) {
            //                     this.Pagination.push(index + 1)
            //                 }
            //             } else if ((this.pageShowIndex + 1) != 1 && (this.pageShowIndex + 1) != this.maxShowIndex) {
            //                 this.Pagination = []
            //                 for (let index = (this.pageShowIndex + 1) - 1; index <= (this.pageShowIndex + 1) + 1; index++) {
            //                     this.Pagination.push(index)
            //                 }
            //             } else {
            //                 this.Pagination = []
            //                 for (let index = (this.pageShowIndex + 1) - 2; index <= (this.pageShowIndex + 1); index++) {
            //                     this.Pagination.push(index)
            //                 }
            //             }
            //         }
            //     })
            // },
            // //下一页
            // handleNextIndex() {
            //     if (this.maxShowIndex <= (this.pageShowIndex + 1)) {
            //         return;
            //     }
            //     this.pageShowIndex += 1
            //     this.pageShowItemIndex = this.pageShowIndex * this.pageShowNum
            //     this.axios.get("https://lyz0613.top/mypageServer/blog/getBlogList.php", {
            //         params: {
            //             index: this.pageShowItemIndex,
            //             num: this.pageShowNum
            //         }
            //     }).then((res) => {
            //         this.blogList = res.data
            //         if (this.maxShowIndex > this.maxPageItem) {
            //             if ((this.pageShowIndex + 1) == 1) {
            //                 this.Pagination = []
            //                 for (let index = 0; index < this.maxPageItem; index++) {
            //                     this.Pagination.push(index + 1)
            //                 }
            //             } else if ((this.pageShowIndex + 1) != 1 && (this.pageShowIndex + 1) != this.maxShowIndex) {
            //                 this.Pagination = []
            //                 for (let index = (this.pageShowIndex + 1) - 1; index <= (this.pageShowIndex + 1) + 1; index++) {
            //                     this.Pagination.push(index)
            //                 }
            //             } else {
            //                 this.Pagination = []
            //                 for (let index = (this.pageShowIndex + 1) - 2; index <= (this.pageShowIndex + 1); index++) {
            //                     this.Pagination.push(index)
            //                 }
            //             }
            //         }
            //     })
            // },
            // //页码点击事件
            // handleChangePageItem(e) {
            //     let page = e.target.dataset.page
            //     if (page == this.pageShowIndex - 1) {
            //         this.handlePreviousIndex()
            //     } else if (page == this.pageShowIndex + 1) {
            //         this.handleNextIndex()
            //     } else {
            //         this.pageShowIndex = page - 1
            //     }
            //     this.pageShowItemIndex = this.pageShowIndex * this.pageShowNum
            //     this.axios.get("https://lyz0613.top/mypageServer/blog/getBlogList.php", {
            //         params: {
            //             index: this.pageShowItemIndex,
            //             num: this.pageShowNum
            //         }
            //     }).then((res) => {
            //         this.blogList = res.data
            //     })
            // }
        },
    }
</script>
<style scoped>
    .snav a {
        text-decoration: none;
        color: rgb(115, 91, 255);
    }

    .snav-dark a {
        text-decoration: none;
        color: aliceblue;
    }

    .cardImg {
        /* max-height: 250px; */
        height: 250px;
        max-width: 100%;
    }

    .myBlog {
        margin: 5% 10%;
        /* padding-top: 130px; */
    }

    .item {
        background-color: rgba(230, 230, 230, 0.5);
        border-radius: 1em;
        height: 20rem;
    }

    @media screen and (max-width: 768px) {
        .item {
            height: auto;
        }
    }

    .listLink {
        text-decoration: none;
        color: black;
        transition: .7s ease;
    }

    .listLink:hover {
        color: rgb(0, 140, 255);
        transition: .7s ease;
    }

    .listLink-hover-dark:hover {
        color: rgb(20, 99, 163) !important;
    }

    .myText {
        /* 多行文本溢出 */
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        line-height: 2em;
        /* max-height: 20em; */
    }

    .createInfo {
        color: rgb(150, 150, 150);
    }

    /* .createUser {
        color: rgb(150, 150, 150);
    } */
</style>