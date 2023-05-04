<template>
    <div class="mx-auto my-5 commentList" @click="hideAllUserInfoCard()">
        <div class="commentItem shadow py-3 ps-4 pe-2 pe-lg-0 my-5 rounded" v-for="(i, index) in commentList"
            :key="i.id" :class="{'bg-dark':darkMode,'bg-body':!darkMode}">
            <div class="col-8 col-lg-3">
                <div class="userInfo d-flex my-4" @mouseenter="showUserInfoCard(index)"
                    @mouseleave="hideUserInfoCard(index)" @click.stop="showUserInfoCard(index)">
                    <div class="userAvatar">
                        <img :src="i.userAvatar ? i.userAvatar:'https://lyz0613.top/server/image/guest.png'"
                            class="img-fluid" alt="">
                    </div>
                    <userInfoCard :showCard="userCard[index]==true?true:false" :userId="commentList[index].userid"
                        v-if="userCard[index]" />
                    <div class="userName align-self-center px-3" :class="{'text-dark':darkMode,'text-body':!darkMode}">
                        {{i.userName}}
                    </div>

                </div>
            </div>

            <div class="commentInfo row">
                <div class="commentText col-10 col-lg-11" :class="{'text-dark':darkMode,'text-body':!darkMode}">
                    {{i.text}}
                </div>
                <div class="commentOptions like col-2 col-lg-1 align-self-center">
                    <a href="javascript:void(0)" class="likeText"><i class="bi bi-balloon-heart"></i>{{i.agreenum}}</a>
                </div>
            </div>
            <div class="commnetTime my-3 text-muted">
                {{i.time}}
            </div>
        </div>
    </div>
    <div class="commentItem shadow py-3 ps-4 pe-2 pe-lg-0 my-5 rounded" :class="{'bg-dark':darkMode,'bg-body':!darkMode}">
        <div class="py-3 px-2">
            <h5 :class="{'placeholder-glow': loading}" v-if="!dataOver">
                <span class="placeholder col-3" :class="{'bg-secondary': darkMode}"></span>
            </h5>
            <p :class="{'placeholder-glow': loading}" v-if="!dataOver">
                <span class="placeholder col-7" :class="{'bg-secondary': darkMode}"></span>
                <span class="placeholder col-7" :class="{'bg-secondary': darkMode}"></span>
                <span class="placeholder col-7" :class="{'bg-secondary': darkMode}"></span>
            </p>
            <p :class="{'placeholder-glow': loading}" v-if="!dataOver">
                <span class="placeholder w-25" :class="{'bg-secondary': darkMode}"></span>
            </p>
            <h5 class="text-center" v-if="!dataOver" :class="{'text-dark':darkMode,'text-body':!darkMode}">
                {{loading?'加载中':'下拉继续加载'}}
            </h5>
            <h5 class="text-center" v-else :class="{'text-dark':darkMode,'text-body':!darkMode}">
                已加载完全部评论
            </h5>
        </div>
    </div>
</template>
<script>
    import { ref, onMounted, getCurrentInstance, computed } from "vue";
    import axios from 'axios';
    import userInfoCard from './userInfoCard.vue';
    import { useStore } from 'vuex'

    export default {
        name: 'commentList',
        props: {
            id: null,
            type: null
        },
        components: { userInfoCard },
        setup(props) {
            const store = useStore()
            const ins = getCurrentInstance()
            const bus = ins.appContext.config.globalProperties.$bus

            const commentList = ref([])
            let dataindex = 0 //加载到第几条
            const num = 5 //一次加载几条
            const dataOver = ref(false) //判断是否已加载全部数据
            const loading = ref(false) //加载动画
            let url = ''
            const loadingCommentList = () => {
                axios(url + '?for=' + props.id + '&index=' + dataindex + '&num=' + num).then((res) => {
                    if (res.data.length < num) {
                        dataOver.value = true
                        for (let index = 0; index < res.data.length; index++) {
                            commentList.value.push(res.data[index])
                        }
                    } else {
                        for (let index = 0; index < res.data.length; index++) {
                            commentList.value.push(res.data[index])
                        }
                        dataindex += num
                    }

                })
            }
            let jl = true //节流函数，防止滚动触发多次请求
            onMounted(() => {
                if (props.type == "blog") {
                    url = "https://lyz0613.top/mypageServer/blog/getBlogCommentData.php"
                } else if (props.type == "tools") {
                    url = "https://lyz0613.top/mypageServer/blog/getToolsCommentData.php"
                } else {
                    return
                }
                let timeout = null
                loadingCommentList()
                //触底加载数据模块
                bus.on("loadingCommentList", () => {
                    // if (!dataOver.value) {
                    //     loadingCommentList()
                    // }
                    dataindex = 0
                    dataOver.value = false
                    commentList.value = []
                    loadingCommentList()


                })
                bus.on("inBottom", () => {
                    clearTimeout(timeout)
                    if (dataOver.value) {
                        bus.off("inBottom")
                        dataindex = 0
                        return;
                    }
                    if (jl && !dataOver.value) {
                        loading.value = true
                        setTimeout(() => {
                            loadingCommentList()
                            loading.value = false
                        }, 1500);
                    }
                    jl = false
                    timeout = setTimeout(() => {
                        jl = true
                    }, 1000);
                })
            })

            const userCard = ref([])

            function showUserInfoCard(index) {
                userCard.value[index] = true
            }
            function hideUserInfoCard(index) {
                userCard.value[index] = false
            }
            function hideAllUserInfoCard() {
                userCard.value = []
            }

            let darkMode = computed(() => {
                return store.state.darkMode
            })

            return {
                commentList,
                loading,
                dataOver,
                userCard,
                showUserInfoCard,
                hideUserInfoCard,
                hideAllUserInfoCard,
                darkMode
            }
        }
    }
</script>
<style scoped>
    .userInfo {
        position: relative;
    }

    .userInfo img {
        border-radius: 5rem;
        height: 4rem;
        width: 4rem;
    }

    .likeText {
        color: cornflowerblue;
        font-size: 1.2rem;
        text-decoration: none;
    }

    .like :hover {
        color: rgb(255, 135, 245);
    }
</style>