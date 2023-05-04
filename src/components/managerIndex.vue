<template>
    <managerIndexNav class="navStyle" />
    <router-view></router-view>
</template>
<script>
    import managerIndexNav from './managerIndexNav.vue'
    export default {
        name: 'managerIndex',
        components: { managerIndexNav },
        mounted() {
            this.axios.get("/blogadminLoginStatus.php?session=" +
                this.$cookie.getCookie('adminSession')).then((res) => {
                    if (res.data != 1) {
                        // this.$router.push('/')
                        this.$router.push({name: 'adminLogin'})
                    }
                })
        },
    }
</script>
<style scoped>
    .navStyle {
        margin-bottom: 5em;
    }
</style>