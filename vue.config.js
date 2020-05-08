module.exports = {
    // publicPath:'./' 解决项目打包后的静态资源404问题
    //publicPath:'./',
    configureWebpack: {
        resolve : {
            //路径别名配置
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views'
            }
        }
    }

};




