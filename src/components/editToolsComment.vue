<template>
    <div class="container mt-3">
        <div id="accordion" v-if="toolsList">
            <div class="card" v-for="d in toolsList" :key="d.id">
                <div class="card-header">
                    <a class="btn w-100" data-bs-toggle="collapse" :href="'#id'+d.id">
                        {{d.title}}
                    </a>
                </div>
                <div :id="'id'+d.id" class="collapse" data-bs-parent="#accordion">
                    <div class="card-body">
                        <editToolsCommentList :id="d.id" />
                    </div>
                </div>
            </div>
        </div>
        <pagination v-if="toolsDataLength" class="mt-5 pt-5 border-top" :url="apiUrl" :dataLength="toolsDataLength"
            :showDataNum="pageShowNum" :showPageNum="maxPageItem" @resultData="resultData" />
    </div>
</template>
<script>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'
    import pagination from './pagination.vue'
    import editToolsCommentList from './editToolsCommentList.vue'
    export default {
        name: 'editToolsComment',
        components: { pagination, editToolsCommentList },
        setup() {
            const apiUrl = ref("/getToolsList.php")
            const pageShowNum = ref(5)
            const maxPageItem = ref(5)
            const toolsDataLength = ref(null)
            const toolsList = ref(null)

            onMounted(() => {
                axios.get("/getToolsListLength.php").then((res) => {
                    toolsDataLength.value = res.data
                })
            })

            function resultData(data) {
                toolsList.value = data
            }

            return {
                apiUrl,
                pageShowNum,
                maxPageItem,
                toolsDataLength,
                toolsList,
                resultData
            }
        }
    }
</script>
<style scoped>

</style>