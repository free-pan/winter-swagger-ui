const path = require('path');

const extraBabelPlugins = []

if (process.env.NODE_ENV === 'production') {
    // 如果是生产环境，则使用`transform-remove-console`插件删除向控制台中输出log的语句
    extraBabelPlugins.push(['transform-remove-console', {"exclude": ["error", "warn"]}])
}

export default {
    // 指定静态资源目录,作用是: 可以通过url直接访问这些静态资源,而不是被react-router进行路由跳转
    history: {type: 'hash'},
    hash: true,
    extraBabelPlugins,
    define: {
        // 设置自定义环境变量
        // 是否将IntlProvider的错误提示信息打印到控制台
        'process.env.ENABLE_INTL_PROVIDER_ERROR': false,
    },

    chainWebpack(memo, { env, webpack, createCSSRule }) {
        // 设置 alias
        memo.resolve.alias.set('@', path.resolve(__dirname, 'src/'));
    },

    // 解决ie兼容问题, 此处表示支持ie11+版本
    targets: {
        ie: 11,
    },

    dva: {
        immer: true,
        hmr: false,
    },
    routes: [
        {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
                {
                    path: '/',
                    redirect: '/index',
                },
                {
                    path: '/index',
                    component: './index',
                },
                {
                    path: '/detail',
                    component: './left/index',
                }
            ],
        },
    ],
};
