<template lang="">
    <div class="m-2 m-lg-5 table-responsive-xl">
        <table class="table align-middle text-center">
  <thead>
    <tr>
      <th scope="col" class="col-2">序号</th>
      <th scope="col" class="col-2">用户</th>
      <th scope="col" class="col-2">标题</th>
      <th scope="col" class="col-4">内容</th>
      <th scope="col" class="col-1">时间</th>
      <th scope="col" class="col-1">操作</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in listData" :key="index">
      <th scope="row"><div class="table-items">{{item.id}}</div></th>
      <td><div class="table-items">{{item.username}}</div></td>
      <td><div class="table-items">{{item.title}}</div></td>
      <td>
        <div class="table-text">
            {{item.text}}
        </div>
        </td>
      <td><div class="table-items">{{item.createTime}}</div></td>
      <td><div style="width: 150px;">
        <button type="button" class="btn btn-success mx-3" @click="handlePass(item.id)">通过</button>
        <button type="button" class="btn btn-danger" @click="handleReject(item.id)">驳回</button>
    </div></td>
    </tr>
  </tbody>
</table>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { VueCookieNext } from 'vue-cookie-next'
import Qs from 'qs'
import axios from 'axios'
const { $bus } = getCurrentInstance().appContext.config.globalProperties
const listData = ref()
const session = VueCookieNext.getCookie('adminSession')
function getData() {
    axios({
        method: 'post',
        url: '/getCreateBlogList.php',
        data: Qs.stringify({
            session
        })
    }).then((res) => {
        listData.value = res.data
    })
}
onMounted(() => getData())
function handlePass(id) {
    axios({
        method: 'post',
        url: '/createUpdateStatus.php',
        data: Qs.stringify({
            session,
            id,
            status: "pass"
        })
    }).then((res) => {
        if (res.data == 1) {
            $bus.emit("showMessage", {
                msg: '已通过',
                type: 'success'
            })
            getData()
        } else {
            $bus.emit("showMessage", {
                msg: res.data,
                type: 'error'
            })
        }
    })
}
function handleReject(id) {
    axios({
        method: 'post',
        url: '/createUpdateStatus.php',
        data: Qs.stringify({
            session,
            id,
            status: "reject"
        })
    }).then((res) => {
        if (res.data == 1) {
            $bus.emit("showMessage", {
                msg: '已驳回',
                type: 'success'
            })
            getData()
        } else {
            $bus.emit("showMessage", {
                msg: res.data,
                type: 'error'
            })
        }
    })
}
</script>

<style scoped>
@media screen and (max-width: 768px) {}

.table-text {
    /* 多行文本溢出 */
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    min-width: 300px;
    word-wrap: break-word;
    word-break: break-word;
    text-align: start
}

.table-items {
    min-width: 70px
}
</style>