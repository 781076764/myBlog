<template>
    <div class="container mt-3">
        <div id="accordion" v-if="blogList">
            <div class="card" v-for="d in blogList" :key="d.id">
                <div class="card-header">
                    <a class="btn w-100" data-bs-toggle="collapse" :href="'#id'+d.id">
                        {{d.title}}
                    </a>
                </div>
                <div :id="'id'+d.id" class="collapse" data-bs-parent="#accordion">
                    <div class="card-body">
                        <editBlogCommentList :id="d.id" />
                    </div>
                </div>
            </div>
        </div>
        <pagination v-if="blogDataLength" class="mt-5 pt-5 border-top" :url="apiUrl" :dataLength="blogDataLength"
            :showDataNum="pageShowNum" :showPageNum="maxPageItem" @resultData="resultData" />
    </div>
</template>
<script>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'
    import pagination from './pagination.vue'
    import editBlogCommentList from './editBlogCommentList.vue'
    export default {
        name: 'editBlogComment',
        components: { pagination, editBlogCommentList },
        setup() {
            const apiUrl = ref("/getBlogList.php")
            const pageShowNum = ref(5)
            const maxPageItem = ref(5)
            const blogDataLength = ref(null)
            const blogList = ref(null)

            onMounted(() => {
                axios.get("/getBlogListLength.php").then((res) => {
                    blogDataLength.value = res.data
                })
            })

            function resultData(data) {
                blogList.value = data
            }

            return {
                apiUrl,
                pageShowNum,
                maxPageItem,
                blogDataLength,
                blogList,
                resultData
            }
        }
    }
</script>
<style scoped>

</style>