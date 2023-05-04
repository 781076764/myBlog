<template lang="">
    <div>
        <ul class="nav nav-tabs px-2">
            <li class="nav-item">
                <router-link :to="{name: 'editTools'}" class="nav-link" active-class="active">编辑工具</router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{name: 'addTools'}" class="nav-link" active-class="active">新增工具</router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{name: 'editToolsComment'}" class="nav-link" active-class="active">管理评论</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        name: 'managerTools'
    }
</script>
<style scoped>

</style>