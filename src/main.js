import { createApp } from 'vue'
import App from './App.vue'
//bootstrap5
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.min.js'
//深色模式
import '../src/assets/css/dark.css'
//bootstrap图标库
import 'bootstrap-icons/font/bootstrap-icons.css'
//阿里图标库
import '../src/assets/css/iconfont.css'
//路由
import router from './router/index'
//代码高亮
import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common';
import hljsVuePlugin from "@highlightjs/vue-plugin";
//ajax请求
import axios from 'axios'
import VueAxios from 'vue-axios'
//全局通信
import mitt from "mitt"

//cookie
import { VueCookieNext } from 'vue-cookie-next'

import store from './store'

const app = createApp(App).use(store)

// app.use(bootstrap)
app.use(VueCookieNext)
VueCookieNext.config({ expire: '24h' })

app.config.globalProperties.$bus = new mitt()
app.use(router)
app.use(hljsVuePlugin)
app.use(VueAxios, axios)
app.mount('#app')
axios.defaults.baseURL = 'https://lyz0613.top/mypageServer/blog';
axios.defaults.withCredentials = true;