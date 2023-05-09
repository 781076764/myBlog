<template>
    <div>
        <ul class="nav nav-tabs px-2">
            <li class="nav-item">
                <router-link :to="{ name: 'editBlog' }" class="nav-link" active-class="active">编辑文章</router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'addBlog' }" class="nav-link" active-class="active">新增文章</router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'editBlogComment' }" class="nav-link" active-class="active">管理评论</router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'managerBlogCreate' }" class="nav-link" active-class="active">投稿管理</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'managerBlog',
}
</script>
<style scoped></style>