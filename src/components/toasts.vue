<template>
    <div class="toast-container position-fixed top-0 start-0 end-0 mx-auto my-3">
        <div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true"
            data-bs-animation="true" v-for="i in messageList" :key="i" id="liveToast">
            <div class="d-flex">
                <div class="toast-body">
                    {{i}}
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>
<script>
    import { Toast } from 'bootstrap'
    export default {
        name: 'toasts',
        data() {
            return {
                messageList: [],
            }
        },
        mounted() {
            this.$bus.on('showMessage', (params) => {
                this.messageList.push(params)
                //不加延时会在设置数据前初始化，导致无法显示
                setTimeout(() => {
                    let toastElList = [].slice.call(document.querySelectorAll('.toast'))
                    let toastList = toastElList.map(function (toastEl) {
                        return new Toast(toastEl)
                    })
                    toastList.forEach((toast,index) => {
                        toast.show()
                        setTimeout(() => {
                            this.messageList.splice(index, 1)
                        }, 6000);
                    })
                }, 10);
                
            })
        }
    }
</script>
<style scoped>
    .toast {
        z-index: 9999;
    }

    .toast-container {
        z-index: 9999;
    }
</style>