<template>
  <div class="myBody" :class="{'bg-dark': darkMode, 'bg-light': !darkMode,'img-dark': darkMode}">
    <myNav :outHome="outHome" :managerPage="managerPage" :scrollInTop="scrollInTop" v-if="!inManager" />

    <!-- 推送信息组件 -->
    <toasts />
    <!-- <myMain /> -->
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'">
        <component :is="Component" />
      </transition>
    </router-view>

    <myFooter v-if="!inManager" />
  </div>
</template>

<script>
  import myNav from './components/myNav.vue'
  import myFooter from './components/myFooter.vue'
  import toasts from './components/toasts.vue'
  // import myMain from './components/myMain.vue'

  export default {
    name: 'App',
    components: { myNav, myFooter, toasts },
    data() {
      return {
        outHome: false,
        managerPage: false, //在后台登录页面
        inManager: true,
        scrollInTop: true
      }
    },
    computed: {
      darkMode() {
        return this.$store.state.darkMode
      }
    },
    mounted() {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.$store.commit("changeDarkMode", true)
      }
      let listeners = {
        dark: (mediaQueryList) => {
          if (mediaQueryList.matches) {
            this.$store.commit("changeDarkMode", true)
          }
        },
        light: (mediaQueryList) => {
          if (mediaQueryList.matches) {
            this.$store.commit("changeDarkMode", false)
          }
        }
      }

      window.matchMedia('(prefers-color-scheme: dark)').addListener(listeners.dark)
      window.matchMedia('(prefers-color-scheme: light)').addListener(listeners.light)

      //判断是否处于后台管理页面，用于隐藏原本的nav
      setTimeout(() => {
        if (this.$route.matched.length > 0) {
          if (this.$route.matched[0].name == "managerIndex") {
            this.inManager = true
          } else {
            this.inManager = false
          }
        } else {
          this.inManager = false
        }
      }, 100);

      let timeout = null
      let timeout2 = null
      // let that = this
      window.addEventListener('scroll', (e) => {
        //当前滑动高度
        // console.log(e.target.documentElement.scrollTop)
        //页面最大高度
        // console.log(e.target.documentElement.scrollHeight)
        //1067
        // console.log(e.target.documentElement.scrollHeight - e.target.documentElement.scrollTop)

        if (e.target.documentElement.scrollHeight - e.target.documentElement.scrollTop <= 1080) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            this.$bus.emit("inBottom");
          }, 100);
        }

        if (e.target.documentElement.scrollTop > 20) {

          clearTimeout(timeout2)
          timeout2 = setTimeout(() => {
            this.scrollInTop = false
          }, 10);
        } else {

          clearTimeout(timeout2)
          timeout2 = setTimeout(() => {
            this.scrollInTop = true
          }, 10);
        }
      })
    },
    watch: {
      darkMode(v) {
        this.$bus.emit("showMessage", v ? '已切换到深色模式' : '已切换到浅色模式')
      },

      $route(to) {
        if (to.path == '/') {
          this.outHome = false
        } else {
          this.outHome = true
        }

        if (to.path == '/blogmanager') {
          this.managerPage = true
        } else {
          this.managerPage = false
        }

        if (to.name == 'editBlog') {
          this.inManager = true
        } else if (to.name == 'adminLogin') {
          this.inManager = false
        }
      }
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .content {
        margin: 5% 10%;
    }

  .img-dark img {
    filter: brightness(80%);
  }

  .myBody img {
    transition: .7s ease;
  }

  .myBody {
    min-height: 100vh;
  }

  @media screen and (min-width:576px) and (max-width: 768px) {
    .myBody {
      padding-top: 70px;
    }
  }

  @media screen and (max-width: 576px) {
    .myBody {
      padding-top: 130px;
    }
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }

  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }

  .bounce-leave-active {
    animation: bounce-in 0.3s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }
</style>