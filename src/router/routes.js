const routes = [
    {
        name: 'home',
        path: '/',
        component: () => import('../components/myMain.vue'),
        meta: { transition: 'bounce' }
    },
    {
        name: 'myBlog',
        path: '/myBlog',
        component: () => import('../components/myBlog.vue'),
        meta: { transition: 'bounce' }
    },
    {
        name: 'myTools',
        path: '/myTools',
        component: () => import('../components/myTools.vue'),
        meta: { transition: 'bounce' }
    },
    {
        name: 'myBlogInfo',
        path: '/myBlogInfo',
        component: () => import('../components/myBlogInfo.vue'),
        meta: { transition: 'bounce' },
        // props: true
    },
    {
        name: 'myToolsInfo',
        path: '/myToolsInfo',
        component: () => import('../components/myToolsInfo.vue'),
        meta: { transition: 'bounce' },
        // props: true
    },
    {
        name: 'adminLogin',
        path: '/blogmanager',
        component: () => import('../components/adminLogin.vue'),
        meta: { transition: 'bounce' },
    },
    {
        name: 'createPage',
        path: '/createPage',
        component: () => import('../components/createPage.vue'),
        meta: { transition: 'bounce' },
    },
    //后台管理页面
    {
        name: 'managerIndex',
        path: '/managerIndex',
        component: () => import('../components/managerIndex.vue'),
        redirect: '/managerIndex/managerBlog',
        children: [{
            name: 'managerBlog',
            path: 'managerBlog',
            component: () => import('../components/managerBlog.vue'),
            redirect: '/managerIndex/managerBlog/editBlog',
            children: [{
                name: 'editBlog',
                path: 'editBlog',
                component: () => import('../components/editBlog.vue')
            },
            {
                name: 'addBlog',
                path: 'addBlog',
                component: () => import('../components/addBlog.vue')
            },
            {
                name: 'editBlogComment',
                path: 'editBlogComment',
                component: () => import('../components/editBlogComment.vue')
            },
            {
                name: 'managerBlogCreate',
                path: 'managerBlogCreate',
                component: () => import('../components/managerBlogCreate.vue')
            }
            ]
        },
        {
            name: 'managerTools',
            path: 'managerTools',
            component: () => import('../components/managerTools.vue'),
            redirect: '/managerIndex/managerTools/editTools',
            children: [{
                name: 'editTools',
                path: 'editTools',
                component: () => import('../components/editTools.vue')
            },
            {
                name: 'addTools',
                path: 'addTools',
                component: () => import('../components/addTools.vue')
            },
            {
                name: 'editToolsComment',
                path: 'editToolsComment',
                component: () => import('../components/editToolsComment.vue')
            }]
        }]
    },
    // {
    //     path: '/:pathMatch(.*)',
    //     redirect: '/'
    // }
]

export default routes