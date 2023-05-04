<template>
    <div class="m-3">
        <div class="mt-3">
            <label for="exampleFormControlInput1" class="form-label" :class="{'text-dark':darkMode,'text-body':!darkMode}">用户名</label>
            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="用于在公共平台上显示的名字"
                v-model="userName"
                :class="{'is-invalid': userNameError,'bg-dark': darkMode,'bg-body':!darkMode,'text-dark':darkMode,'text-body': !darkMode}">
            <div class="invalid-feedback" v-if="userNameError">
                检查用户名
            </div>
        </div>
        <div class="mt-3">
            <label for="exampleFormControlInput2" class="form-label" :class="{'text-dark':darkMode,'text-body':!darkMode}">账号</label>
            <input type="text" class="form-control" id="exampleFormControlInput2" placeholder="用于登录" v-model="account"
                :class="{'is-invalid': accountError,'bg-dark': darkMode,'bg-body':!darkMode,'text-dark':darkMode,'text-body': !darkMode}">
            <div class="invalid-feedback" v-if="accountError">
                检查账号
            </div>
        </div>
        <div class="mt-3">
            <label for="exampleFormControlInput3" class="form-label" :class="{'text-dark':darkMode,'text-body':!darkMode}">密码</label>
            <input type="password" class="form-control" id="exampleFormControlInput3" placeholder="长度最少6位"
                v-model="password1"
                :class="{'is-invalid': passwordError,'bg-dark': darkMode,'bg-body':!darkMode,'text-dark':darkMode,'text-body': !darkMode}">
            <div class="invalid-feedback" v-if="passwordError">
                {{passwordErrorText}}
            </div>
        </div>
        <div class="mt-3">
            <label for="exampleFormControlInput4" class="form-label" :class="{'text-dark':darkMode,'text-body':!darkMode}">确认密码</label>
            <input type="password" class="form-control" id="exampleFormControlInput4" placeholder="再次输入密码"
                v-model="password2"
                :class="{'is-invalid': passwordError,'bg-dark': darkMode,'bg-body':!darkMode,'text-dark':darkMode,'text-body': !darkMode}">
            <div class="invalid-feedback" v-if="passwordError">
                {{passwordErrorText}}
            </div>
        </div>
        <div class="mt-3">
            <label for="exampleFormControlInput5" class="form-label" :class="{'text-dark':darkMode,'text-body':!darkMode}">邮箱地址</label>
            <div class="input-group">
                <input type="email" class="form-control" id="exampleFormControlInput5" placeholder="用于绑定和找回密码"
                    v-model="address"
                    :class="{'is-valid': emailRight, 'is-invalid': emailError,'bg-dark': darkMode,'bg-body':!darkMode,'text-dark':darkMode,'text-body': !darkMode}"
                    :disabled="isSentCode">
                <button class="btn" id="button-addon2" :disabled="address.length < 5 || isSentCode" type="button"
                    @click="sentCode"
                    :class="{'btn-secondary':darkMode,'btn-dark':!darkMode}">{{isSentCode?'已发送':'发送'}}</button>
            </div>
            <div style="color:#dc3545;font-size: 0.875em;margin-top: .25rem;" v-if="emailError">
                {{emailErrorText}}
            </div>
        </div>
        <div class="mt-3">
            <label for="exampleFormControlInput6" class="form-label" :class="{'text-dark':darkMode,'text-body':!darkMode}">邮箱验证码</label>
            <input type="text" class="form-control" id="exampleFormControlInput6" placeholder="5位验证码" v-model="code"
                :class="{'is-invalid': codeError,'bg-dark': darkMode,'bg-body':!darkMode,'text-dark':darkMode,'text-body': !darkMode}"
                :disabled="!isSentCode">
            <div class="invalid-feedback" v-if="codeError">
                验证码错误
            </div>
        </div>

        <div class="d-grid mt-4">
            <button type="button" class="btn btn-outline-primary" :class="{'disabled': waiting}" @click="register"><span
                    class="spinner-border spinner-border-sm" v-if="waiting"></span>注册</button>
            <button type="button" class="btn btn-outline-danger my-4" @click="backLogin">返回登录</button>
        </div>
    </div>
</template>
<script>
    import { ref, getCurrentInstance, computed } from "vue";
    import Qs from 'qs';
    import axios from 'axios';
    import { useCookie } from 'vue-cookie-next'
    import { useStore } from 'vuex'
    export default {
        setup(props, { emit }) {
            const ins = getCurrentInstance()
            const bus = ins.appContext.config.globalProperties.$bus
            const { setCookie } = useCookie()
            const store = useStore()

            const backLogin = () => {
                emit('backLogin', false)
            }

            const account = ref('');
            const userName = ref('');
            const password1 = ref('');
            const password2 = ref('');
            const address = ref('');
            const code = ref('');
            const isSentCode = ref(false);
            const waiting = ref(false);
            const accountError = ref(false);
            const userNameError = ref(false);
            const passwordError = ref(false);
            const passwordErrorText = ref('');
            const emailRight = ref(false);
            const emailError = ref(false);
            const emailErrorText = ref('');
            const codeError = ref(false);

            function checkEmail() {
                return String(address.value).toLowerCase().match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            }
            function sentCode() {
                if (checkEmail() != null) {
                    axios({
                        method: 'get',
                        url: '/blogSentEmailCode.php?address=' + address.value,
                        data: 'address=' + address.value
                    }).then((res) => {
                        if (res.data == 1) {
                            emailRight.value = true
                            emailError.value = false
                            isSentCode.value = true
                            bus.emit("showMessage", '已发送，请留意收件箱或垃圾箱')
                        } else {
                            emailErrorText.value = "该邮箱已被注册"
                            emailRight.value = false
                            emailError.value = true
                        }
                    })

                } else {
                    emailErrorText.value = "邮箱地址格式不正确"
                    emailRight.value = false
                    emailError.value = true
                }
            }
            function register() {
                waiting.value = true
                userNameError.value = false
                accountError.value = false
                passwordError.value = false
                emailError.value = false
                codeError.value = false
                setTimeout(() => {
                    let check = true
                    if (account.value.trim() == '') {
                        accountError.value = true
                        check = false
                    }
                    if (userName.value.trim() == '') {
                        userNameError.value = true
                        check = false
                    }
                    if (password1.value.trim() == '' || password2.value.trim() == '' || password1.value.length < 6) {
                        passwordError.value = true
                        passwordErrorText.value = '密码格式不正确'
                        check = false
                    } else if (password1.value != password2.value) {
                        passwordError.value = true
                        passwordErrorText.value = '两次密码输入不相同'
                        check = false
                    }
                    if (checkEmail() == null) {
                        emailError.value = true
                        emailErrorText.value = "邮箱地址格式不正确"
                        check = false
                    }
                    if (code.value == '' || code.value.length != 5) {
                        codeError.value = true
                        console.log(code.value.length)
                        check = false
                    }
                    if (check) {
                        let data = { account: account.value, userName: userName.value, password: password2.value, address: address.value, code: code.value }
                        axios({
                            method: 'post',
                            url: '/blogRegister.php',
                            data: Qs.stringify(data)
                        }).then((res) => {
                            console.log(res.data)
                            if (res.data.statusCode == 2 && res.data.errorMessage == 'account') {
                                bus.emit("showMessage", "该账号已注册")
                                accountError.value = true
                            } else if (res.data.statusCode == 2 && res.data.errorMessage == 'userName') {
                                bus.emit("showMessage", "该用户名已存在")
                                userNameError.value = true
                            } else if (res.data.statusCode == 2 && res.data.errorMessage == 'account and userName') {
                                bus.emit("showMessage", "该账号与用户名均已被使用")
                                userNameError.value = true
                                accountError.value = true
                            } else if (res.data.statusCode == 1) {
                                bus.emit("showMessage", "注册成功，已自动登录该账号")
                                setCookie('session', res.data.session)
                                store.commit('login', res.data.userInfo)
                                emit('backLogin', true)
                            } else {
                                bus.emit("showMessage", res.data)
                            }
                        })
                    }
                    waiting.value = false
                }, 1000);
            }

            let darkMode = computed(() => {
                return store.state.darkMode
            })

            return {
                backLogin,
                account,
                userName,
                password1,
                password2,
                address,
                code,
                isSentCode,
                waiting,
                userNameError,
                accountError,
                passwordError,
                passwordErrorText,
                emailErrorText,
                emailRight,
                emailError,
                codeError,
                sentCode,
                register,
                darkMode
            }
        }
    }
</script>
<style scoped>

</style>