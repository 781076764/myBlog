<template>
    <div class="card" :class="{ 'showCard': showCard, 'hideCard': !showCard, 'bg-secondary': darkMode, 'bg-light': !darkMode }">
        <div class="background"
            :style="userInfo.userBackground ? `background-image: url('${userInfo.userBackground ? userInfo.userBackground : ''}');` : ''">
        </div>
        <div class="d-flex m-3">
            <img :src="userInfo.userAvatar ? userInfo.userAvatar : '../../public/image/guest.png'" class='img-fluid'
                height='50' width='50' />
            <div>
                <div class="userName ms-3 my-1" :class="{ 'text-dark': darkMode, 'text-body': !darkMode }">{{
                    userInfo.userName }}</div>
                <div class="userType ms-3 text-success" v-if="userInfo.userType == 1"><i class="bi bi-shield-fill"></i>正式用户
                </div>
                <div class="userType ms-3 text-danger" v-else-if="userInfo.userType == 0"><i
                        class="bi bi-shield-slash-fill"></i>封禁用户</div>
            </div>

            <!-- <div class="userDesc">简介</div> -->
        </div>
        <div class="pub m-3 d-flex justify-content-center" :class="{ 'text-dark': darkMode, 'text-body': !darkMode }">
            <div class="mx-auto">文章<span class="mx-2 text-black-50">0</span></div>
            <div class="mx-auto">工具<span class="mx-2 text-black-50">0</span></div>
        </div>
    </div>
</template>
<script>
import { toRefs, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
export default {
    name: 'userInfoCard',
    props: {
        userId: null,
        showCard: Boolean,
    },
    setup(props) {
        const store = useStore()

        const userInfo = ref({})

        onMounted(() => {
            axios("https://lyz0613.top/mypageserver/blog/getUserInfo.php?id=" + props.userId).then((res) => {
                if (res.data != 3) {
                    userInfo.value = res.data
                }
            })
        })

        let darkMode = computed(() => {
            return store.state.darkMode
        })

        return {
            ...toRefs(props),
            userInfo,
            darkMode
        }
    }
}
</script>
<style scoped>
.userName {
    /* 单行文本溢出 */
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 10rem;
}

@media screen and (max-width: 576px) {
    .card {
        position: absolute;
        left: -1rem;
        top: -7rem;
        width: 20rem;
        border-radius: 8px 8px 0 0;
    }
}

@media screen and (min-width: 576px) {
    .card {
        position: absolute;
        left: 5rem;
        width: 20rem;
        border-radius: 8px 8px 0 0;
    }
}

.background {
    /* position: absolute; */
    width: 100%;
    height: 100px;
    top: 0;
    left: 0;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("../assets/image/userInfoCardBG.webp");
}

.hideCard {
    display: none;
    opacity: 0;
    animation: hide .5s;
}

@keyframes hide {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }

}

.showCard {
    display: inline;
    animation: show .5s;
}

@keyframes show {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>