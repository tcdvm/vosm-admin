module.exports = {
  lintOnSave: true,
  configureWebpack: {
    output: {
      // publicPath: '/vosmadmin/'
      publicPath: process.env.NODE_ENV === 'production' ? '/vosmadmin/' : './'
    },
    // resolve: {
    //   alias: {
    //     vue: 'vue/dist/vue.js'
    //   }
    // }
  }
};