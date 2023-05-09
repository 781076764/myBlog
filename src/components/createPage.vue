<template lang="">
    <div class="content">
        <div class="card-body m-2 m-lg-5" v-if="createType == 'article'">
            <div class="text-center mb-4 mt-3 fs-4 fw-bold">
                投稿文章
            </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control" placeholder="文章标题" v-model="tempData.title"
                :class="{'is-invalid': errorTips.title}">
            <label for="floatingInput">文章标题</label>
        </div>
        <div class="form-floating my-3">
            <input type="text" class="form-control" placeholder="作者" :value="tempData.createUser" disabled>
            <label for="floatingInput">作者</label>
        </div>
        <div class="textMain row my-2 mt-3 mt-lg-0">
            <div class="form-floating col-lg-9">
                <textarea type="text" class="form-control editText" placeholder="正文内容" v-model="tempData.text"
                    :class="{'is-invalid': errorTips.text}"></textarea>
                <label for="floatingInput">正文内容(发布后自动处理代码高亮)</label>
            </div>
            <div class="image align-self-center col-lg-3 my-3 text-center">
                <img :src="tempData.imageSrc == null || tempData.imageSrc == ''? '../../public/image/暂无图片.png': tempData.imageSrc"
                    class="image">
                <div class="m-3">
                    <input class="form-control form-control-sm" id="formFileSm" type="file" ref="upImgInput"
                        @change="upLoadImg">
                    <label for="formFileSm" class="form-label">上传图片</label>
                </div>
            </div>
        </div>
        <div class="form-floating mt-lg-3">
            <input type="text" class="form-control" placeholder="图片地址" v-model="tempData.imageSrc"
                :class="{'is-valid': uploadSuccess}">
            <label for="floatingInput">图片地址</label>
        </div>
        <div class="row mt-lg-3">
            <div class="form-floating mt-3 col-lg me-lg-2 mb-2 mt-lg-0">
                <input type="text" class="form-control" placeholder="附件标题" v-model="tempData.downloadName">
                <label for="floatingInput">附件标题</label>
            </div>
            <div class="form-floating mt-2 col-lg ms-lg-2 mb-2 mt-lg-0">
                <input type="text" class="form-control" placeholder="附件简介" v-model="tempData.downloadDesc">
                <label for="floatingInput">附件简介</label>
            </div>
        </div>
        <div class="form-floating my-2">
            <input type="text" class="form-control" placeholder="附件地址" v-model="tempData.downloadSrc">
            <label for="floatingInput">附件地址</label>
        </div>
        <div class="formfloating mt-3 col-lg-2 mx-auto gap-2 d-grid">
            <button type="button" class="btn btn-primary" @click="handleAddBlog">提交更改</button>
        </div>
    </div>
    </div>
</template>
<script setup>
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { useRoute } from "vue-router"
import { VueCookieNext } from 'vue-cookie-next'
import { useStore } from 'vuex'
import COS from 'cos-js-sdk-v5'
import Qs from 'qs'
import axios from 'axios'
const { $bus } = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const store = useStore()
const createType = ref(route.query.createType)
watch(
    () => route.query.createType,
    newCreateType => {
        createType.value = newCreateType
    })
const tempData = ref({
    title: '',
    text: '',
    imageSrc: '',
    downloadName: '',
    downloadDesc: '',
    downloadSrc: '',
    createUser: computed(()=> store.state.userInfo.userName),
    session: VueCookieNext.getCookie('session')
})
const uploadSuccess = ref(false)
const errorTips = ref({
    title: false,
    text: false,
    imageSrc: false,
    downloadName: false,
    downloadDesc: false,
    downloadSrc: false,
    createUser: false
})
const upImgInput = ref()
function upLoadImg() {
    var file = upImgInput.value.files[0];
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
    if (file.size > 1024 * 1024 * 5) {
        alert("上传的图片不能大于5M");
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
                tempData.value.imageSrc = "https://" + data.Location
                //给地址输入框添加成功的样式
                uploadSuccess.value = true
                $bus.emit("showMessage", {
                    msg: '图片上传成功',
                    type: 'success'
                })
            } else {
                console.log(err)
            }
        });
    }
}
function handleAddBlog() {
    if (tempData.value.title == '' || tempData.value.title == null) errorTips.value.title = true
    if (tempData.value.text == '' || tempData.value.text == null) errorTips.value.text = true
    if (tempData.value.title != '' && tempData.value.title != null && tempData.value.text != '' && tempData.value.text != null) {
        axios({
            method: 'post',
            url: '/createBlog.php',
            data: Qs.stringify(tempData.value)
        }).then((res) => {
            if (res.data == 1) {
                $bus.emit("showMessage", {
                    msg: '提交成功，等待审核',
                    type: 'success'
                })
                uploadSuccess.value = false
                tempData.value = {
                    title: '',
                    text: '',
                    imageSrc: '',
                    downloadName: '',
                    downloadDesc: '',
                    downloadSrc: '',
                    createUser: '',
                    session: VueCookieNext.getCookie('session')
                }
                errorTips.value = {
                    title: false,
                    text: false,
                    imageSrc: false,
                    downloadName: false,
                    downloadDesc: false,
                    downloadSrc: false,
                    createUser: false
                }
            } else {
                $bus.emit("showMessage", {
                    msg: res.data,
                    type: "error"
                })
            }
        })
    }
}
</script>
<style scoped>
.toast {
    margin-left: auto;
    margin-bottom: 2em;
    margin-right: 2em;
}

.row {
    --bs-gutter-x: 0
}

.editText {
    height: 25em;
}

.textMain img {
    height: 250px;
    max-width: 100%;
}
</style>