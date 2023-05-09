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
    <div class="container mt-3">
        <div id="accordion">
            <div class="card" v-for="(d, index) in blogList" :key="d.id">
                <div class="card-header">
                    <a class="btn w-100" data-bs-toggle="collapse" :href="'#id'+d.id">
                        {{d.title}}
                    </a>
                </div>
                <div :id="'id'+d.id" class="collapse" data-bs-parent="#accordion">
                    <div class="card-body">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" placeholder="文章标题" v-model="d.title">
                            <label for="floatingInput">文章标题</label>
                        </div>
                        <div class="createInfo row my-2">
                            <div class="form-floating col-lg me-lg-2 mb-2 mt-lg-0">
                                <input type="text" class="form-control" placeholder="发布时间" v-model="d.createTime">
                                <label for="floatingInput">发布时间</label>
                            </div>
                            <div class="form-floating col-lg ms-lg-2 mt-2 mt-lg-0">
                                <input type="text" class="form-control" placeholder="作者" v-model="d.username">
                                <label for="floatingInput">作者</label>
                            </div>
                        </div>
                        <div class="textMain row my-2 mt-3 mt-lg-0">
                            <div class="form-floating col-lg-9">
                                <textarea type="text" class="form-control editText" placeholder="正文内容"
                                    v-model="d.text"></textarea>
                                <label for="floatingInput">正文内容(发布后自动处理代码高亮)</label>
                            </div>
                            <div class="image align-self-center col-lg-3 my-3 text-center">
                                <img :src="d.imageSrc == null || d.imageSrc == ''? '../../public/image/暂无图片.png': d.imageSrc"
                                    class="image" ref="showBlogImg">
                                <div class="m-3">
                                    <input class="form-control form-control-sm" id="formFileSm" type="file"
                                        @change="upLoadImg($event, index)" ref="upImgInput">
                                    <label for="formFileSm" class="form-label">上传图片</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-floating mt-lg-3">
                            <input type="text" class="form-control" placeholder="图片地址" :value="d.imageSrc"
                                ref="showBlogImgSrc" @change="refreshImageSrc(index)"
                                :class="{'is-valid': uploadSuccess[index]}">
                            <label for="floatingInput">图片地址</label>
                        </div>
                        <div class="row mt-lg-3">
                            <div class="form-floating mt-3 col-lg me-lg-2 mb-2 mt-lg-0">
                                <input type="text" class="form-control" placeholder="附件标题" v-model="d.downloadName">
                                <label for="floatingInput">附件标题</label>
                            </div>
                            <div class="form-floating mt-2 col-lg ms-lg-2 mb-2 mt-lg-0">
                                <input type="text" class="form-control" placeholder="附件简介" v-model="d.downloadDesc">
                                <label for="floatingInput">附件简介</label>
                            </div>
                        </div>
                        <div class="form-floating my-2">
                            <input type="text" class="form-control" placeholder="附件地址" v-model="d.downloadSrc">
                            <label for="floatingInput">附件地址</label>
                        </div>
                        <div class="formfloating mt-3 d-flex justify-content-center">
                            <button type="button" class="btn btn-outline-danger me-3"
                                @click="handleDeleteBlog(index)">删除</button>
                            <button type="button" class="btn btn-primary ms-3"
                                @click="handleUpdateBlog(index)">提交更改</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <pagination v-if="blogDataLength" class="mt-4" :url="apiUrl" :dataLength="blogDataLength" :showDataNum="pageShowNum" :showPageNum="maxPageItem" @resultData="resultData" />
    </div>
</template>
<script>
    import pagination from './pagination.vue'
    import COS from 'cos-js-sdk-v5'
    import Qs from 'qs'
    export default {
        name: 'editBlog',
        components: { pagination },
        data() {
            return {
                apiUrl: "/getBlogList.php",
                pageShowNum: 5,//设置一页显示的个数
                maxPageItem: 5,//最大显示分页数
                blogDataLength: null,
                blogList: null,
                // blogList: [{}],
                uploadSuccess: [],
                toastmsg: '',
                poptoast: false
            }
        },
        mounted() {
            // this.axios.get("/getBlogList.php").then((res) => {
            //     this.blogList = res.data
            // })
            this.axios.get("/getBlogListLength.php").then((res) => {
                this.blogDataLength = res.data
            })
        },
        methods: {
            //获取分页组件返回的数据
            resultData(data){
                this.blogList = data
            }, 
            //上传图片并返回地址填入input
            upLoadImg(e, index) {
                let that = this
                let file = e.target.files[0]
                //refs中第一个指向v-for中的最后一个，详见笔记
                // let n = this.blogList.length - (1 + index)
                // console.log(this.$refs.upImgInput[n].files[0])
                // var file = this.$refs.upImgInput[n].files[0];
                // // 存储桶名称
                // var Bucket = 'wxp-1258161576';
                // // 存储桶Region
                // var Region = 'ap-guangzhou';
                // 初始化实例
                var cos = new COS({
                    getAuthorization: function (options, callback) {
                        var url = 'https://lyz0613.top/mypageServer/blog/sts.php'; // 这里替换成您的服务接口地址
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
                            that.blogList[index].imageSrc = "https://" + data.Location
                            //给地址输入框添加成功的样式
                            that.uploadSuccess[index] = true
                        } else {
                            console.log(err)
                        }
                    });
                }
            },
            refreshImageSrc(index) {
                //refs中第一个指向v-for中的最后一个，详见笔记
                // let n = this.blogList.length - (1 + index)
                let n = index
                // //预览图片
                // this.$refs.showBlogImg[n].src = this.$refs.showBlogImgSrc[n].value
                this.blogList[index].imageSrc = this.$refs.showBlogImgSrc[n].value
            },
            handleDeleteBlog(index) {
                this.axios({
                    method: 'post',
                    url: '/blogDelete.php',
                    data: Qs.stringify({ id: this.blogList[index].id, session: this.$cookie.getCookie('adminSession') })
                }).then((res) => {
                    if (res.data == 1) {
                        this.toastmsg = '删除成功'
                        this.poptoast = true
                        this.blogDataLength = null
                        this.axios.get("/getBlogListLength.php").then((res) => {
                            this.blogDataLength = res.data
                        })
                        // this.axios.get("/getBlogList.php").then((res) => {
                        //     this.blogList = res.data
                        // })
                        setTimeout(() => {
                            this.poptoast = false
                        }, 3000);
                        // this.$router.go(0)
                    } else {
                        // alert(res.data)
                        this.toastmsg = res.data
                        this.poptoast = true
                        setTimeout(() => {
                            this.poptoast = false
                        }, 3000);
                    }
                })
            },
            handleUpdateBlog(index) {
                let data = {
                    id: this.blogList[index].id,
                    title: this.blogList[index].title,
                    text: this.blogList[index].text,
                    imageSrc: this.blogList[index].imageSrc,
                    createUser: this.blogList[index].createUser,
                    createTime: this.blogList[index].createTime,
                    downloadDesc: this.blogList[index].downloadDesc,
                    downloadName: this.blogList[index].downloadName,
                    downloadSrc: this.blogList[index].downloadSrc,
                    session: this.$cookie.getCookie('adminSession')
                }
                this.axios({
                    method: 'post',
                    url: '/blogUpdate.php',
                    data: Qs.stringify(data)
                }).then((res) => {
                    if (res.data == 1) {
                        this.toastmsg = '修改成功'
                        this.poptoast = true
                        setTimeout(() => {
                            this.poptoast = false
                        }, 3000);
                        // this.$router.go(0)
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