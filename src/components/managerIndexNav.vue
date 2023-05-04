<template>
    <div>
        <nav
            class="d-flex flex-wrap justify-content-center py-3 navbar-transparent fixed-top border-bottom bg-dark bg-opacity-75">
            <ul class="nav nav-pills">
                <li class="nav-item mx-lg-5">
                    <router-link :to="{name: 'managerBlog'}" class="nav-link" active-class="active">文章管理</router-link>
                </li>
                <li class="nav-item mx-lg-5">
                    <router-link :to="{name: 'managerTools'}" class="nav-link" active-class="active">工具管理</router-link>
                </li>
                <li class="nav-item mx-lg-5">
                    <button class="nav-link dangerbtn" @click="loginout">退出登录</button>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script>
    export default {
        name: 'managerIndexNav',
        methods: {
            loginout(){
                this.axios.get("/blogadminLoginout.php?session=" +
                    this.$cookie.getCookie('adminSession')).then((res) => {
                        if (res.data == 1) {
                            // this.$router.push('/')
                            this.$cookie.removeCookie("adminSession")
                            this.$router.push({ name: 'adminLogin' })
                        } else {
                            // this.$router.push('/')
                            this.$cookie.removeCookie("adminSession")
                            this.$router.push({ name: 'adminLogin' })
                        }
                    })
            }
        },
    }
</script>
<style scoped>
    .nav-item:hover {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 5px;
    }

    .nav-pills .nav-link.active,
    .nav-pills .show>.nav-link {
        background: rgb(255, 130, 180);
    }

    .nav-link {
        color: white;
    }

    .nav-link:hover {
        color: rgb(240, 178, 203, 0.9);
    }

    .nav-link:focus {
        color: white;
    }
    .dangerbtn:hover{
        background: rgba(255, 24, 24, 0.815);
        border-radius: 5px;
        color: rgba(255, 255, 255, 0.9);
    }
</style>