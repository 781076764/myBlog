<template>
    <!-- toasts -->
    <div class="toast fixed-bottom" :class="{'show': poptoast}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong class="me-auto">系统提示</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            {{toastmsg}}
        </div>
    </div>
    <!-- toasts End -->
    <div class="card-body m-2 m-lg-5">
        <div class="form-floating mb-3">
            <input type="text" class="form-control" placeholder="文章标题" v-model="tempData.title"
                :class="{'is-invalid': errorTips.title}">
            <label for="floatingInput">文章标题</label>
        </div>
        <div class="form-floating my-3">
            <input type="text" class="form-control" placeholder="作者" v-model="tempData.createUser">
            <label for="floatingInput">作者</label>
        </div>
        <div class="textMain row my-2 mt-3 mt-lg-0">
            <div class="form-floating col-lg-9">
                <textarea type="text" class="form-control editText" placeholder="正文内容" v-model="tempData.text"
                    :class="{'is-invalid': errorTips.text}"></textarea>
                <label for="floatingInput">正文内容(发布后自动处理代码高亮)</label>
            </div>
            <div class="image align-self-center col-lg-3 my-3">
                <img :src="tempData.imageSrc == null || tempData.imageSrc == ''? 'https://lyz0613.top/server/image/null2.png': tempData.imageSrc"
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
</template>
<script>
    import COS from 'cos-js-sdk-v5'
    import Qs from 'qs'
    export default {
        name: 'addBlog',
        data() {
            return {
                tempData: {
                    title: '',
                    text: '',
                    imageSrc: '',
                    downloadName: '',
                    downloadDesc: '',
                    downloadSrc: '',
                    createUser: '',
                    session: this.$cookie.getCookie('adminSession')
                },
                uploadSuccess: false,
                errorTips: {
                    title: false,
                    text: false,
                    imageSrc: false,
                    downloadName: false,
                    downloadDesc: false,
                    downloadSrc: false,
                    createUser: false
                },
                toastmsg: '',
                poptoast: false
            }
        },
        methods: {
            upLoadImg() {
                let that = this
                var file = this.$refs.upImgInput.files[0];
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
                            // console.log(data.Location)
                            // that.$refs.showBlogImgSrc[n].value = "https://" + data.Location
                            // that.$refs.showBlogImg[n].src = "https://" + data.Location
                            that.tempData.imageSrc = "https://" + data.Location
                            //给地址输入框添加成功的样式
                            that.uploadSuccess = true
                        } else {
                            console.log(err)
                        }
                    });
                }
            },
            handleAddBlog() {
                if (this.tempData.title == '' || this.tempData.title == null) this.errorTips.title = true
                if (this.tempData.text == '' || this.tempData.text == null) this.errorTips.text = true
                if (this.tempData.title != '' && this.tempData.title != null && this.tempData.text != '' && this.tempData.text != null) {
                    this.axios({
                        method: 'post',
                        url: '/blogAdd.php',
                        data: Qs.stringify(this.tempData)
                    }).then((res) => {
                        if (res.data == 1) {
                            this.toastmsg = '添加成功'
                            this.poptoast = true
                            this.uploadSuccess = false
                            this.tempData = {
                                title: '',
                                text: '',
                                imageSrc: '',
                                downloadName: '',
                                downloadDesc: '',
                                downloadSrc: '',
                                createUser: '',
                                session: this.$cookie.getCookie('adminSession')
                            }
                            this.errorTips = {
                                title: false,
                                text: false,
                                imageSrc: false,
                                downloadName: false,
                                downloadDesc: false,
                                downloadSrc: false,
                                createUser: false
                            }
                            setTimeout(() => {
                                this.poptoast = false
                            }, 3000);
                        } else {
                            // alert(res.data)
                            this.toastmsg = res.data
                            this.poptoast = true
                            setTimeout(() => {
                                this.poptoast = false
                            }, 3000);
                        }
                    })
                }
            }
        },
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