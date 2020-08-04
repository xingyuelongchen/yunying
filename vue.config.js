
module.exports = {
    productionSourceMap: false,
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].minify = false;
            return args;
        });
    },
    publicPath: process.env.NODE_ENV === 'development' ? '' : '/backend-web',
    devServer: {
        proxy: {
            '/backend': {
                target: 'http://www.congrong-inc.com/',
                ws: true,
                changeOrigin: true,
            }
        },
    }
}
