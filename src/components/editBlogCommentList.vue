<template>
    <div v-if="commentList">
        <div class="row border-bottom py-2" v-for="d in commentList" :key="d.id">
            <div class="userInfo col-lg-3">
                <img :src="d.userAvatar" class="img-fluid rounded-circle" alt="" height="50" width="50">
                <span class="mx-3 text-black-50">{{d.userName}}</span>
            </div>
            <div class="col-lg-8 commentText align-self-center">
                {{d.text}}
            </div>
            <div class="col-lg-1 align-self-center text-center">
                <i class="bi bi-balloon-heart"></i>{{d.agreenum}}
                <button type="button" class="btn btn-danger btn-sm" @click="handleDelete(d.id)">删除</button>
            </div>
        </div>
    </div>
    <div class="text-center text-danger" v-else>
        暂无评论
    </div>
    <pagination v-if="commentListLength" class="mt-3" :url="apiUrl" :dataLength="commentListLength"
        :showDataNum="pageShowNum" :showPageNum="maxPageItem" @resultData="resultData" />
</template>
<script>
    import pagination from './pagination.vue'
    import { ref, onMounted, getCurrentInstance } from 'vue'
    import axios from 'axios'
    import { useCookie } from 'vue-cookie-next'
    export default {
        name: "editBlogCommentList",
        components: { pagination },
        props: {
            id: null
        },
        setup(props) {
            const ins = getCurrentInstance()
            const bus = ins.appContext.config.globalProperties.$bus
            const { getCookie } = useCookie()

            const apiUrl = ref("/getBlogCommentData.php?for=" + props.id)
            const pageShowNum = ref(5)
            const maxPageItem = ref(5)
            const commentListLength = ref(null)
            const commentList = ref(null)

            onMounted(() => {
                getDataLength()
            })
            function getDataLength() {
                axios.get("/getBlogCommentDataLength.php", {
                    params: {
                        id: props.id
                    }
                }).then((res) => {
                    if (res.data == 0) {
                        commentListLength.value = null
                        commentList.value = null
                    } else {
                        commentListLength.value = res.data
                    }
                })
            }

            function resultData(data) {
                if (data.length > 0) commentList.value = data
                else commentList.value = null
            }

            function handleDelete(id) {
                axios.get("/deleteBlogComment.php", {
                    params: {
                        session: getCookie("adminSession"),
                        id
                    }
                }).then((res) => {
                    if (res.data == 1) {
                        bus.emit("showMessage", "删除成功")
                        // commentList.value = []
                        commentListLength.value = null
                        getDataLength()
                    }
                })
            }

            return {
                apiUrl,
                pageShowNum,
                maxPageItem,
                commentListLength,
                commentList,
                resultData,
                handleDelete
            }
        }
    }
</script>
<style scoped>
    .commentText {
        /* 多行文本溢出 */
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
</style>