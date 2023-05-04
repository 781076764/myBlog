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
                        工具列表
                    </li>
                </ol>
            </nav>
        </div>
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="col" v-for="d in toolsList" :key="d.id">
                <router-link :to="'myToolsInfo?id='+d.id" class="listLink">
                    <div class="card h-100 pt-3 toolsCard" :class="{'bg-secondary': darkMode,'bg-light': !darkMode}">
                        <img :src="d.imageSrc" class="rounded-3 align-self-center cardImg" alt=""
                            v-if="d.imageSrc != null && d.imageSrc != '' && d.imageSrc != undefined">
                        <img src="https://lyz0613.top/server/image/null2.png"
                            class="cardImg rounded-3 align-self-center" alt="" width="" height="" v-else>

                        <div class="card-body">
                            <h4 class="card-title" :class="{'text-dark':darkMode,'text-body':!darkMode}">{{d.title}}
                            </h4>
                            <p class="card-text myText" :class="{'text-dark':darkMode,'text-body':!darkMode}">
                                {{d.text}}
                            </p>
                            <div class="card-foot">
                                <div class="d-flex justify-content-between">
                                    <div class="createtime">
                                        <p class="card-text">
                                            <small
                                                :class="{'text-light': darkMode,'text-muted': !darkMode}">{{d.createTime}}</small>
                                        </p>
                                    </div>
                                    <div class="createuser">
                                        <p class="card-text">
                                            <small
                                                :class="{'text-light': darkMode,'text-muted': !darkMode}">{{d.createUser}}</small>
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </router-link>
            </div>
        </div>
        <!-- 分页组件 -->
        <!-- <div class="d-flex justify-content-center pt-5">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item" :class="{'disabled': pageShowIndex == 0}">
                        <a class="page-link" aria-label="Previous" href="#"
                            @click="handlePreviousIndex">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item" v-for="i in Pagination" :key="i" :class="{'active': pageShowIndex+1 == i}"><a
                            class="page-link" href="#" @click="handleChangePageItem"
                            :data-page="i">{{i}}</a>
                    </li>
                    <li class="page-item" :class="{'disabled': pageShowIndex+1 == maxShowIndex}">
                        <a class="page-link" aria-label="Next" href="#" @click="handleNextIndex">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div> -->
        <pagination v-if="toolsDataLength" class="mt-4" :url="apiUrl" :dataLength="toolsDataLength"
            :showDataNum="pageShowNum" :showPageNum="maxPageItem" @resultData="resultData" />
    </div>
</template>
<script>
    import pagination from './pagination.vue'
    export default {
        name: 'myTools',
        components: { pagination },
        data() {
            return {
                toolsList: null,
                toolsDataLength: null,
                apiUrl: "/getToolsList.php",
                pageShowNum: 6,//设置一页显示的个数
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
            this.axios.get("https://lyz0613.top/mypageServer/blog/getToolsListLength.php").then((res) => {
                this.toolsDataLength = res.data
                // this.maxShowIndex = Math.ceil(this.toolsDataLength / this.pageShowNum)
                // if (this.maxPageItem > this.maxShowIndex) {
                //     this.maxPageItem = this.maxShowIndex
                // }
                // for (let index = 0; index < this.maxPageItem; index++) {
                //     this.Pagination.push(this.pageShowIndex + 1 + index)
                // }
            })
            // this.axios.get("https://lyz0613.top/mypageServer/blog/getToolsList.php", {
            //     params: {
            //         index: this.pageShowItemIndex,
            //         num: this.pageShowNum
            //     }
            // }).then((res) => {
            //     this.toolsList = res.data
            // })
        },
        methods: {
            resultData(data) {
                this.toolsList = data
            }
            //上一页
            // handlePreviousIndex() {
            //     if (this.pageShowIndex <= 0) {
            //         return;
            //     }
            //     this.axios.get("https://lyz0613.top/mypageServer/blog/getToolsList.php", {
            //         params: {
            //             index: this.pageShowItemIndex - this.pageShowNum,
            //             num: this.pageShowNum
            //         }
            //     }).then((res) => {
            //         this.toolsList = res.data
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
            //     this.axios.get("https://lyz0613.top/mypageServer/blog/getToolsList.php", {
            //         params: {
            //             index: this.pageShowItemIndex,
            //             num: this.pageShowNum
            //         }
            //     }).then((res) => {
            //         this.toolsList = res.data
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
            //     this.pageShowIndex = page - 1
            //     this.pageShowItemIndex = this.pageShowIndex * this.pageShowNum
            //     this.axios.get("https://lyz0613.top/mypageServer/blog/getToolsList.php", {
            //         params: {
            //             index: this.pageShowItemIndex,
            //             num: this.pageShowNum
            //         }
            //     }).then((res) => {
            //         this.toolsList = res.data
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

    .cardImg {
        height: 250px;
        max-width: 100%;
    }

    .myBlog {
        margin: 5% 10%;
    }

    .toolsCard{
        background-color: none;
    }

    .item {
        background-color: aliceblue;
        border-radius: 1em;
    }

    .listLink{
        text-decoration: none;
        color: black;
    }

    .listLink:hover .text-body{
        color: rgb(0, 140, 255) !important;
    }
    .listLink:hover .text-dark{
        color: rgb(101, 186, 255) !important;
    }

    .myText {
        /* 多行文本溢出 */
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-height: 2em;
        /* max-height: 20em; */
    }

    .card-foot {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 0 1rem;
    }

    .createTime {
        color: rgb(150, 150, 150);
    }

    .createUser {
        color: rgb(150, 150, 150);
    }
</style>