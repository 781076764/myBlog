<template>
  <div class="myNav">
    <nav class="d-flex flex-wrap justify-content-center py-4 navbar-transparent fixed-top px-lg-4"
      :class="{ 'navBackground': outHome || (!outHome && !scrollInTop), 'navBackgroundNone': !outHome && scrollInTop }">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <span class="fs-4 text-light ms-md-5 blogTitle" :class="{ 'nav-link-dark': darkMode }">个人分享站</span>
      </a>
      <ul class="nav nav-pills justify-content-center">
        <li class="nav-item">
          <router-link to="/" class="nav-link" :class="{ 'nav-link-dark': darkMode }" active-class="active"
            aria-current="page">首页
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/myBlog" class="nav-link" :class="{ 'nav-link-dark': darkMode }" active-class="active">文章
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/myTools" class="nav-link" :class="{ 'nav-link-dark': darkMode }" active-class="active">工具
          </router-link>
        </li>
        <li class="nav-item dropdown" :class="{ 'select': managerPage, 'nav-link-dark': darkMode }">
          <a href="#" class="nav-link dropdown-toggle" :class="{ 'nav-link-dark': darkMode }" id="navbardrop"
            data-bs-toggle="dropdown">
            后台
          </a>
          <div class="dropdown-menu" :class="{ 'bg-secondary': darkMode }">
            <a class="dropdown-item" :class="{ 'text-dark': darkMode, 'text-body': !darkMode }"
              href="https://lyz0613.top/wxadminlogin.html">不离谱菜谱后台</a>
            <router-link to="/blogmanager" class="dropdown-item"
              :class="{ 'active': managerPage, 'text-dark': darkMode, 'text-body': !darkMode }">网站后台</router-link>
          </div>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ 'nav-link-dark': darkMode }" @click="goToAbout">关于</button>
        </li>
        <li class="nav-item" v-if="darkMode">
          <button class="nav-link" :class="{ 'nav-link-dark': darkMode }" @click="changeDarkMode(false)"><i
              class="bi bi-moon-fill"></i></button>
        </li>
        <li class="nav-item" v-else>
          <button class="nav-link" :class="{ 'nav-link-dark': darkMode }" @click="changeDarkMode(true)"><i
              class="bi bi-moon"></i></button>
        </li>
        <!-- 个人信息按钮 -->
        <div class="nav-item loginIcon">
          <button class="nav-link nav-avatar-button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
            aria-controls="#offcanvasRight" :class="{ 'nav-link-dark': darkMode }">
            <img v-if="isLogin"
              :src="userInfo.userAvatar ? userInfo.userAvatar : 'https://lyz0613.top/server/image/guest.png'"
              class="nav-avatar" />
            <i v-else class="iconfont icon-weidenglutouxiang"></i>
          </button>
        </div>
        <div class="nav-item nav-submit-button dropdown" v-if="isLogin">
          <button class="nav-link" :class="{ 'nav-link-dark': darkMode }" data-bs-toggle="dropdown" aria-expanded="false"
            data-bs-auto-close="outside" data-bs-auto-open="true"><i class="bi bi-arrow-bar-up"
              style="margin: 0 5px;"></i>投稿</button>
          <div class="dropdown-menu p-3 rounded-3 shadow-lg" style="">
            <nav class="d-flex gap-2 col-8">
              <router-link :to="'/createPage?createType=' + 'article'" class="dropdown-item">
                <div class="align-items-center text-center">
                  <i class="bi bi-file-earmark-richtext"></i>
                  <strong class="d-block">投稿文章</strong>
                </div>
              </router-link>
              <router-link :to="'/createPage?createType=' + 'tool'"  class="dropdown-item">
                <div class="align-items-center text-center">
                  <i class="bi bi-wrench-adjustable"></i>
                  <strong class="d-block">投稿工具</strong>
                </div>
              </router-link>
            </nav>
          </div>
        </div>
      </ul>

    </nav>

    <!-- 登录弹出窗口 -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel"
      data-bs-scroll="false" :class="{ 'bg-dark': darkMode, 'bg-body': !darkMode }">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRightLabel" :class="{ 'text-dark': darkMode, 'text-body': !darkMode }">
          登录信息
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <!-- 弹出窗口内容 -->
      <div class="offcanvas-body">
        <!-- 未登录内容 -->
        <div class="guest text-center" v-if="!isLogin && !openRegister">
          <!-- <div class="userAvatar">
            <img src="../assets/image/guest.png" class="img-fluid" alt="">
          </div> -->
          <div class="userName" :class="{ 'text-dark': darkMode, 'text-body': !darkMode }">
            未登录
          </div>
          <div class="loginInputer d-grid col-9 mx-auto">
            <div class="my-2">
              <label for="userAccountInputer" class="form-label"
                :class="{ 'text-dark': darkMode, 'text-body': !darkMode }">账号</label>
              <input type="text" class="form-control" id="userAccountInputer" placeholder="账号"
                :class="{ 'is-invalid': loginError, 'bg-dark': darkMode, 'bg-body': !darkMode, 'text-dark': darkMode, 'text-body': !darkMode }"
                v-model="userAccount">
              <div class="invalid-feedback" v-if="loginError">
                检查用户名是否正确
              </div>
            </div>
            <div class="my-2">
              <label for="userPasswordInputer" class="form-label"
                :class="{ 'text-dark': darkMode, 'text-body': !darkMode }">密码</label>
              <input type="password" class="form-control" id="userPasswordInputer" placeholder="密码"
                :class="{ 'is-invalid': loginError, 'bg-dark': darkMode, 'bg-body': !darkMode, 'text-dark': darkMode, 'text-body': !darkMode }"
                v-model="userPassword">
              <div class="invalid-feedback" v-if="loginError">
                检查密码是否正确
              </div>
            </div>
            <div class="my-4 d-grid">
              <button type="button" class="btn btn-outline-primary" :class="{ 'disabled': logining }" @click="login"><span
                  class="spinner-border spinner-border-sm" v-if="logining"></span>登录</button>
              <button type="button" class="btn my-3" @click="register"
                :class="{ 'btn-outline-light': darkMode, 'btn-outline-dark': !darkMode }">注册</button>
            </div>
          </div>
        </div>

        <!-- 已登录内容 -->
        <div class="user text-center" v-else-if="isLogin && !openRegister">
          <div class="userBackGround"
            :style="userInfo.userBackground ? `background-image: url('${userInfo.userBackground ? userInfo.userBackground : ''}');` : ''">
          </div>
          <button class="userBackGroundChange btn btn-sm" href="javascript:void(0)" @click="handleUpload('background')"
            :class="{ 'btn-outline-light': darkMode, 'btn-outline-dark': !darkMode }"><i
              class="bi bi-box-arrow-in-up"></i>更改背景</button>
          <div class="userAvatar">
            <a href="javascript:void(0)" @click="handleUpload('avatar')">
              <img :src="userInfo.userAvatar ? userInfo.userAvatar : 'https://lyz0613.top/server/image/guest.png'"
                class="img-fluid userAvatarImg" alt="">
              <span class="avatarOverlay" :class="{ 'text-dark': darkMode, 'text-body': !darkMode }">
                上传头像
              </span>
            </a>
          </div>
          <input type="file" style="display: none;" ref="avatarInput" accept="image/*" @change="handleUploadFile" />
          <div class="userName my-2" v-if="!openChangeUserName"
            :class="{ 'text-dark': darkMode, 'text-body': !darkMode }">
            {{ userInfo.userName }}
            <a class="openChangeName" href="javascript:void(0)" @click="handleOpenChangeUserName"><i
                class="bi bi-pencil-square"></i></a>
          </div>
          <div class="userName d-flex my-2 justify-content-center" v-else>
            <input type="text" class="form-control w-50" id="newUserName" placeholder="新的用户名"
              v-model="changeUserNameInput"
              :class="{ 'is-invalid': changeUserNameInputError, 'bg-dark': darkMode, 'bg-body': !darkMode, 'text-dark': darkMode, 'text-body': !darkMode }">
            <a class="saveChangeName" href="javascript:void(0)" @click="saveChangeUserName"><i
                class="bi bi-box-arrow-in-up-right"></i></a>
          </div>
          <div class="logout">
            <button type="button" class="btn btn-outline-danger" @click="loginout"><i
                class="iconfont icon-tuichu"></i>退出登录</button>
          </div>

          <div class="text-black-50 text-center" :class="{ 'text-dark': darkMode, 'text-body': !darkMode }">暂无发表文章</div>
        </div>



        <register v-else @backLogin="backLogin" />
      </div>
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import register from './register.vue'
import COS from 'cos-js-sdk-v5'
import axios from 'axios'
// import { useStore } from "vuex";
// const store = useStore();

export default {
  name: 'myNav',
  props: { "outHome": Boolean, "managerPage": Boolean, "scrollInTop": Boolean },
  components: { register },
  data() {
    return {
      userAccount: '',
      userPassword: '',
      userInfo: [],
      isLogin: false,
      loginError: false,
      logining: false,
      openRegister: false,
      openChangeUserName: false,
      changeUserNameInputError: false,
      changeUserNameInput: '',
      uploadType: '', //当前上传文件的所属
      // darkMode: false //深色模式
    }
  },
  mounted() {
    if (this.$cookie.getCookie('session') != null) {
      this.axios.get("https://lyz0613.top/mypageServer/blog/blogLoginStatus.php?session=" +
        this.$cookie.getCookie('session')).then((res) => {
          // console.log(res);
          if (res.data.statusCode === 1) {
            this.$cookie.setCookie('session', this.$cookie.getCookie('session'))
            this.userInfo = res.data.userInfo
            this.isLogin = true
            this.$store.commit('login', res.data.userInfo)
          }
        })
    } else {
      this.$cookie.removeCookie('session')
      this.$cookie.removeCookie('PHPSESSID')
      // console.log('removeCookie')
    }
  },
  computed: {
    darkMode() {
      return this.$store.state.darkMode
    }
  },
  methods: {
    goToAbout() {
      document.getElementById("footer").scrollIntoView();
      this.$bus.emit("showAbout", true);
    },

    changeDarkMode(b) {
      // this.darkMode = b
      this.$store.commit('changeDarkMode', b)
    },

    login() {
      this.loginError = false
      this.logining = true
      setTimeout(() => {
        let data = { account: this.userAccount, password: this.userPassword };
        this.axios({
          method: 'post',
          url: '/blogLogin.php',
          data: Qs.stringify(data)
        }).then((res) => {
          if (res.data.statusCode === 1) {
            this.$cookie.setCookie('session', res.data.session)
            this.loginError = false
            this.userInfo = res.data.userInfo
            this.isLogin = true
            this.userAccount = ''
            this.userPassword = ''
            this.$store.commit('login', res.data.userInfo)
            this.$bus.emit("showMessage", '登录成功')
          } else {
            this.loginError = true
          }
        })
        this.logining = false
      }, 1000)
    },

    loginout() {
      this.axios.get("/blogLoginout.php?session=" + this.$cookie.getCookie('session')).then((res) => {
        if (res.data === 1) {
          this.isLogin = false
          this.userInfo = []
          this.$cookie.removeCookie("session")
          this.$cookie.removeCookie('PHPSESSID')
          this.$store.commit('loginout')
          this.$bus.emit("showMessage", '已退出登录');
        }
      })
    },

    register() {
      this.openRegister = true
    },

    backLogin(login) {
      this.openRegister = false
      this.userInfo = this.$store.state.userInfo
      this.isLogin = login
    },

    handleUpload(type) {
      this.uploadType = type
      this.$refs.avatarInput.click()
    },
    handleUploadFile(e) {
      let that = this
      var file = e.target.files[0];
      // 初始化实例
      var cos = new COS({
        getAuthorization: function (options, callback) {
          var url = 'https://lyz0613.top/mypageServer/blog/sts.php'; //服务接口地址
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onload = function (e) {
            try {
              var data = JSON.parse(e.target.responseText);
              var credentials = data.credentials;
            } catch (e) {
              console.log(e)
            }
            if (!data || !credentials) return console.error('credentials invalid');
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              StartTime: data.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
            });
          };
          xhr.send();
        }
      });
      if (file.size > 1024 * 1024 * 2) {
        alert("上传的图片不能大于2M");
      } else {
        cos.putObject({
          Bucket: 'wxp-1258161576', /* 必须 */
          Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
          Key: file.name,              /* 必须 */
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function () {
            // console.log(JSON.stringify(progressData));
          }
        }, function (err, data) {
          if (data.statusCode == '200') {
            let url = ""
            let rData = {}
            if (that.uploadType == "avatar") {
              url = "/userAvatarUpdate.php"
              rData = {
                session: that.$cookie.getCookie('session'),
                userAvatar: "https://" + data.Location
              }
            } else if (that.uploadType == "background") {
              url = "/userBackgroundUpdate.php"
              rData = {
                session: that.$cookie.getCookie('session'),
                userBackground: "https://" + data.Location
              }
            }
            axios({
              method: 'post',
              url,
              data: Qs.stringify(rData)
            }).then((res) => {
              if (res.data == 1) {
                if (that.uploadType == "avatar") {
                  that.userInfo.userAvatar = "https://" + data.Location
                  that.$bus.emit("showMessage", "更改头像成功")
                } else if (that.uploadType == "background") {
                  that.userInfo.userBackground = "https://" + data.Location
                  that.$bus.emit("showMessage", "更改背景成功")
                }
              } else if (res.data == 501) {
                that.$bus.emit("showMessage", "登录失效，请重新登录")
              } else {
                that.$bus.emit("showMessage", res.data)
              }
            })
          } else {
            that.$bus.emit("showMessage", err)
            // console.log(err)
          }
        });
      }
    },

    handleOpenChangeUserName() {
      this.openChangeUserName = true
      this.changeUserNameInput = this.userInfo.userName
    },
    saveChangeUserName() {
      if (this.changeUserNameInput == this.userInfo.userName) {
        this.openChangeUserName = false
        return;
      }
      this.changeUserNameInputError = false
      let data = {
        session: this.$cookie.getCookie('session'),
        userName: this.changeUserNameInput
      }
      axios({
        method: 'post',
        url: '/userNameUpdate.php',
        data: Qs.stringify(data)
      }).then((res) => {
        if (res.data == 1) {
          this.userInfo.userName = this.changeUserNameInput
          this.$bus.emit("showMessage", "更改用户名成功")
          this.openChangeUserName = false
        } else if (res.data == 2) {
          this.$bus.emit("showMessage", "该用户名已存在")
          this.changeUserNameInputError = true
        } else {
          this.$bus.emit("showMessage", res.data)
        }
      })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* @media screen and (max-width: 768px) {
    .bigNav {
      margin-bottom: 130px;
    }
  } */

@media screen and (max-width: 390px) {
  li {
    margin: 0 1px !important;
  }
}
@media screen and (max-width: 520px) {
  .nav-item {
    margin: 10px 0 0 !important;
  }
}

.myNav {
  /* 解决bootstrap的fixed-top属性bug */
  padding-top: 1px;
}


li {
  margin: 0 5px;
}

.blogTitle {
  transition: .7s ease;
}

.navBackground {
  border-radius: 5px;
  background: rgba(100, 100, 100, 0.93);
  transition: .7s ease;
}

.navBackground::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  filter: blur(20px);
  z-index: -1;
  margin: -30px;
}

.navBackgroundNone {
  background: rgba(255, 255, 255, 0);
  transition: .7s ease;
}

.nav-link {
  color: white;
  background: 0 0;
  border: 0;
  border-radius: .25rem;
  transition: .7s ease;
}

.nav-link:hover {
  color: rgb(255, 255, 255, 0.9);
}

.nav-link:focus {
  color: white;
}

.nav-pills .nav-link.active,
.nav-pills .show>.nav-link {
  /* background-color: rgba(255, 25, 167, 0.8) !important; */
  transition: .7s ease;
}

.nav-avatar {
  height: 2rem;
  width: 2rem;
  border-radius: 100px;
}

.nav-avatar-button {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  /* padding-left: 0 !important; */
  /* padding-right: 0 !important; */
  /* border-radius: 50% !important; */
}

.nav-submit-button {
  background-color: rgb(255, 67, 99);
  border-radius: 5px;
}

.nav-submit-button:hover {
  background-color: rgb(255, 99, 125) !important;
}

a:focus {
  color: white;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
}

.select {
  color: #fff;
  text-decoration: none;
  /* background-color: #0d6efd; */
  background-color: rgba(255, 25, 167, 0.8);
  border-radius: 5px;
  transition: .7s ease;
}

.select:hover {
  /* background-color: #0d6efd; */
  background-color: rgba(255, 25, 167, 0.8);
}

.dropdown-item:hover {
  border-radius: 10px;
}

.dropdown-item.active,
.dropdown-item:active {
  /* background-color: rgba(255, 25, 167, 0.8); */
}

.iconfont {
  font-size: 16px;
}

.loginIcon {
  margin: 0px 10px;
  display: flex;
  align-items: center;
}

.offcanvas-body {
  padding: 0;
}

.offcanvas-body .userName {
  font-size: 1.5rem;
}

.user {
  position: relative;
}

.userBackGround {
  position: absolute;
  width: 100%;
  height: 150px;
  /* top: 0; */
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("../assets/image/userInfoCardBG.webp");
  z-index: -1;
}

.userBackGroundChange {
  position: absolute;
  border-radius: 0;
  border: 0;
  right: 0;
  top: 150px;
  z-index: 1;
}

.userAvatar {
  position: relative;
  padding-top: 100px;
}

.userAvatarImg {
  /* height: 50px;
    width: 50px; */
  transition: .3s ease;
  border-top: 1px solid rgb(100, 100, 100);
  border-left: 1px solid rgb(100, 100, 100);
  border-right: 1px solid rgb(100, 100, 100);
}

.avatarOverlay {
  position: absolute;
  top: calc(50% + 60px);
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: .5s ease;
  color: rgb(0, 0, 0);
  z-index: -1;
}

.userAvatarImg:hover+.avatarOverlay {
  opacity: 1;
}

.userAvatarImg:hover {
  opacity: 0.2;
}

.logout {
  position: fixed;
  bottom: 30px;
  right: 30px;
}

.dropdown-menu .logout {
  position: fixed;
  top: 10px;
  right: 10px;
}

.offcanvas-body img {
  border-radius: 50px;
  height: 100px;
  width: 100px;
}

.darkModeChangeBtn {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
}</style>