const { defineConfig } = require('@vue/cli-service')


module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',
    hot: true,
    client: {
      overlay: true,
    },
    watchFiles: {
      paths: ['src/**/*'],
      options: {
        usePolling: true,
        interval: 500
      }
    }
  }
})

