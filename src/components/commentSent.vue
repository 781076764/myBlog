<template>
    <div class="shadow-lg py-3 px-lg-5 px-3 my-5 rounded" :class="{'bg-dark':darkMode,'bg-body': !darkMode}"
        v-if="isLogin">
        <div class="userInfo d-flex justify-content-center m-4">
            <div class="userAvatar" v-if="userInfo">
                <img :src="userInfo.userAvatar ? userInfo.userAvatar:'https://lyz0613.top/server/image/guest.png'"
                    class="img-fluid" alt="">
            </div>
            <div class="userName align-self-center px-3" :class="{'text-dark':darkMode}">
                {{userInfo.userName}}
            </div>
        </div>
        <div class="commentInput form-floating w-lg-50 text-center m-auto">
            <textarea class="form-control" placeholder="评论内容" id="floatingTextarea" v-model="commentText"
                :class="{'is-invalid': textError,'text-dark bg-dark border-dark': darkMode,'bg-body': !darkMode}"
                style="height: 10rem;"></textarea>
            <label for="floatingTextarea"
                :class="{'errorColor':commentText.length > 500,'text-dark': darkMode}">评论内容({{commentText.length}}/500)</label>
            <div class="invalid-feedback">
                {{textErrorMessage}}
            </div>
        </div>
        <div class="commentSent d-flex justify-content-center my-3">
            <button type="button" class="btn px-5" @click="sentComment"
                :class="{'disabled': loading,'btn-outline-light': darkMode,'btn-outline-primary': !darkMode}"><span
                    class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"
                    v-if="loading"></span>提交评论</button>
        </div>
    </div>

</template>
<script>
    import { useStore } from "vuex";
    import { toRefs, ref, getCurrentInstance, computed } from "vue";
    import { useCookie } from 'vue-cookie-next';
    import axios from 'axios';
    import Qs from 'qs';

    export default {
        props: {
            id: null,
            type: null
        },
        setup(props) {
            const store = useStore()
            const { setCookie, getCookie } = useCookie()
            const ins = getCurrentInstance()
            const bus = ins.appContext.config.globalProperties.$bus

            const commentText = ref('')
            const loading = ref(false)
            const textError = ref(false)
            const textErrorMessage = ref('')
            function sentComment() {
                loading.value = true
                textError.value = false
                let url = ""
                if (props.type == "blog") {
                    url = "/sentBlogComment.php"
                } else if (props.type == "tools") {
                    url = "/sentToolsComment.php"
                } else {
                    return
                }
                setTimeout(() => {
                    if (commentText.value.trim() != '' && commentText.value.length <= 500) {
                        let session = getCookie('session')
                        let data = { session, text: commentText.value, for: props.id }
                        axios({
                            method: 'post',
                            url,
                            data: Qs.stringify(data)
                        }).then((res) => {
                            if (res.data == 1) {
                                setCookie('session', session)
                                bus.emit("showMessage", "评论成功")
                                commentText.value = ''
                                bus.emit("loadingCommentList")
                            }
                        })
                    } else if (commentText.value.length > 500) {
                        textError.value = true
                        textErrorMessage.value = '字数不能大于500'
                    } else {
                        textError.value = true
                        textErrorMessage.value = '评论内容不合法'
                    }
                    loading.value = false
                }, 1500);
            }

            let darkMode = computed(() => {
                return store.state.darkMode
            })

            return {
                ...toRefs(store.state),
                commentText,
                loading,
                textError,
                textErrorMessage,
                sentComment,
                darkMode
            }
        }
    }
</script>
<style>
    .userInfo img {
        border-radius: 5rem;
        height: 4rem;
        width: 4rem;
    }

    .errorColor {
        color: red;
    }
</style>