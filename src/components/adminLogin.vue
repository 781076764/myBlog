<template lang="">
    <div class="login">
        <main class="form-signin text-center">
            <div>
                <!-- <img class="mb-4" src="https://lyz0613.top/server/image/manager.png" alt="" width="70" height="70"> -->
                <h1 class="h3 mb-3 fw-normal" :class="{'text-dark':darkMode,'text-body':!darkMode}">管理员登录</h1>

                <div class="form-floating my-3">
                    <input type="text" class="form-control" id="floatingInput" placeholder="用户名" v-model="username"
                        :class="{'is-invalid': loginError,'bg-dark':darkMode,'bg-light': !darkMode,'text-dark':darkMode,'text-body':!darkMode}">
                    <label for="floatingInput" :class="{'text-secondary':darkMode,'text-body':!darkMode}">用户名</label>
                    <div class="invalid-feedback" v-if="loginError">
                        检查用户名是否正确
                    </div>
                </div>
                <div class="form-floating my-3">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="密码"
                        v-model="password" :class="{'is-invalid': loginError,'bg-dark':darkMode,'bg-light': !darkMode,'text-dark':darkMode,'text-body':!darkMode}">
                    <label for="floatingPassword" :class="{'text-secondary':darkMode,'text-body':!darkMode}">密码</label>
                    <div class="invalid-feedback" v-if="loginError">
                        检查密码是否正确
                    </div>
                </div>

                <button class="w-100 btn btn-lg btn-success" :class="{'disabled': logining}" @click="handleLogin">
                    <span class="spinner-border spinner-border-sm" v-if="logining"></span>
                    登录</button>
            </div>
        </main>
    </div>
</template>
<script>
    //由于后端不接收json格式的参数，故需要引入qs库转化参数格式
    import Qs from 'qs'

    export default {
        name: 'adminLogin',
        data() {
            return {
                username: '',
                password: '',
                logining: false,
                loginError: false,
            }
        },
        mounted() {
            //如果已登录，自动跳转
            this.axios.get("/blogadminLoginStatus.php?session=" +
                this.$cookie.getCookie('adminSession')).then((res) => {
                    if (res.data == 1) {
                        this.$router.push({ name: 'managerIndex' })
                    }
                })
        },
        computed: {
            darkMode() {
                return this.$store.state.darkMode
            }
        },
        methods: {
            // backIndex() {
            //     window.location.href = 'https://lyz0613.top'
            // },
            handleLogin() {
                this.loginError = false
                this.logining = true
                setTimeout(() => {
                    let data = { username: this.username, password: this.password }
                    this.axios({
                        method: 'post',
                        url: '/blogadminLogin.php',
                        // data: { username: this.username, password: this.password },
                        data: Qs.stringify(data)
                    }).then((res) => {
                        if (res.data.statusCode === 1) {
                            this.$cookie.setCookie('adminSession', res.data.session)
                            this.loginError = false
                            this.$router.push({ name: 'managerIndex' })
                        }
                        else {
                            this.loginError = true
                        }
                    })
                    this.logining = false
                }, 1000);
            }
        },
    }
</script>
<style scoped>
    .login {
        display: flex;
        align-items: center;
        padding-top: 40px;
        padding-bottom: 40px;
        /* background-color: #f5f5f5; */
        height: 100vh;
    }

    .back {
        position: absolute;
        top: 5%;
        left: 5%;
    }

    .form-signin {
        width: 100%;
        max-width: 330px;
        padding: 15px;
        margin: auto;
    }

    .form-signin .checkbox {
        font-weight: 400;
    }

    .form-signin .form-floating:focus-within {
        z-index: 2;
    }

    .form-signin input[type="email"] {
        margin-bottom: -1px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .form-signin input[type="password"] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
</style>