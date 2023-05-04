<template>
    <div class="d-flex justify-content-center">
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled': pageShowIndex == 1}">
                    <a class="page-link" :class="{'page-link-dark': darkMode}" aria-label="Previous" href="#" @click="handlePreviousIndex">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" v-for="i in pagination" :key="i" :class="{'active': pageShowIndex == i}">
                    <span v-if="i == pageShowIndex" class="page-link">{{i}}</span>
                    <a v-else class="page-link" :class="{'page-link-dark': darkMode}"  href="#" @click="handleChangePageItem(i)">{{i}}</a>
                </li>
                <li class="page-item" :class="{'disabled': pageShowIndex == maxShowIndex}">
                    <a class="page-link" :class="{'page-link-dark': darkMode}" aria-label="Next" href="#" @click="handleNextIndex">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script>
    import { ref, onMounted,computed } from 'vue'
    import axios from 'axios'
    import {useStore} from 'vuex'
    export default {
        name: 'pagination',
        props: {
            url: String,
            dataLength: null,
            showDataNum: {
                type: null,
                default: 3
            },
            showPageNum: {
                type: null,
                default: 3
            }
        },
        setup(props, { emit }) {
            const store = useStore()

            const pageShowNum = ref(props.showDataNum) //设置一页显示多少条数据
            const maxPageItem = ref(props.showPageNum) //设置最大显示分页数
            const dataLength = ref(0) //数据总长度
            const maxShowIndex = ref(0) //数据总共需要显示多少页
            const pageShowIndex = ref(1) //当前显示的页码
            const dataShowIndex = ref(0) //当前显示到第几条数据
            const minPage = ref(1) //当前最小页码
            const maxPage = ref(1) //当前最大页码
            const pagination = ref([]) //页码渲染数组
            const resultData = ref(null) //返回数据

            onMounted(() => {
                dataLength.value = props.dataLength
                maxShowIndex.value = Math.ceil(dataLength.value / pageShowNum.value)
                axios.get(props.url, {
                    params: {
                        index: dataShowIndex.value,
                        num: pageShowNum.value
                    }
                }).then((res) => {
                    resultData.value = res.data
                    if (maxShowIndex.value < maxPageItem.value) {
                        maxPageItem.value = maxShowIndex.value
                    }
                    for (let index = 0; index < maxPageItem.value; index++) {
                        pagination.value.push(minPage.value + index)
                    }
                    minPage.value = 1
                    maxPage.value = maxPageItem.value
                    emit("resultData", resultData.value)
                })
            })
            let darkMode = computed(()=>{
                return store.state.darkMode
            })

            //上一页
            function handlePreviousIndex() {
                if (pageShowIndex.value - 1 >= 1) {
                    pageShowIndex.value -= 1
                    dataShowIndex.value -= pageShowNum.value
                    axios.get(props.url, {
                        params: {
                            index: dataShowIndex.value,
                            num: pageShowNum.value
                        }
                    }).then((res) => {
                        resultData.value = res.data
                        if (pageShowIndex.value == minPage.value && minPage.value - 1 >= 1) {
                            minPage.value -= 1
                            maxPage.value -= 1
                            pagination.value = []
                            for (let index = 0; index < maxPageItem.value; index++) {
                                pagination.value.push(minPage.value + index)
                            }
                        }
                        emit("resultData", resultData.value)
                    })
                }
            }

            //下一页
            function handleNextIndex() {
                if (pageShowIndex.value + 1 <= maxShowIndex.value) {
                    pageShowIndex.value += 1
                    dataShowIndex.value += pageShowNum.value
                    axios.get(props.url, {
                        params: {
                            index: dataShowIndex.value,
                            num: pageShowNum.value
                        }
                    }).then((res) => {
                        resultData.value = res.data
                        if (pageShowIndex.value == maxPage.value && maxPage.value + 1 <= maxShowIndex.value) {
                            minPage.value += 1
                            maxPage.value += 1
                            pagination.value = []
                            for (let index = 0; index < maxPageItem.value; index++) {
                                pagination.value.push(minPage.value + index)
                            }
                        }
                        emit("resultData", resultData.value)
                    })
                }
            }

            //页码点击事件
            function handleChangePageItem(page) {
                pageShowIndex.value = page
                dataShowIndex.value = (pageShowIndex.value - 1) * pageShowNum.value
                axios.get(props.url, {
                    params: {
                        index: dataShowIndex.value,
                        num: pageShowNum.value
                    }
                }).then((res) => {
                    resultData.value = res.data
                    if (pageShowIndex.value == maxPage.value && maxPage.value + 1 <= maxShowIndex.value) {
                        minPage.value += 1
                        maxPage.value += 1
                        pagination.value = []
                        for (let index = 0; index < maxPageItem.value; index++) {
                            pagination.value.push(minPage.value + index)
                        }
                    } else if (pageShowIndex.value == minPage.value && minPage.value - 1 >= 1) {
                        minPage.value -= 1
                        maxPage.value -= 1
                        pagination.value = []
                        for (let index = 0; index < maxPageItem.value; index++) {
                            pagination.value.push(minPage.value + index)
                        }
                    }
                    emit("resultData", resultData.value)
                })
            }

            return {
                pageShowNum,
                maxPageItem,
                maxShowIndex,
                pageShowIndex,
                dataShowIndex,
                minPage,
                maxPage,
                pagination,
                resultData,
                handleNextIndex,
                handlePreviousIndex,
                handleChangePageItem,
                darkMode
            }
        }
    }
</script>
<style scoped>

</style>