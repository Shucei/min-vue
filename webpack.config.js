const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 生成html文件
const { CleanWebpackPlugin } = require("clean-webpack-plugin") // 清除dist文件夹 
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将css文件单独打包成一个文件
const isDev = process.env.NODE_ENV === 'development' // 判断是否是开发环境

module.exports = {
  mode: 'development', // 开发环境
  // mode: 'production', // 生产环境
  entry: './src/vue.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Vue', // 将Vue打包成一个库
    libraryTarget: 'umd', // 将Vue打包成UMD模块
  },
  // devtool: 'cheap-module-eval-source-map', // 开发环境下使用
  devtool: 'source-map', // 按照正确的顺序配置 devtool
  // devtool: 'cheap-module-source-map', // 生产环境下使用
  devServer: {
    //配置一：
    host: '127.0.0.1', // 配置启动ip地址 
    port: 5002, // 配置端口 
    open: true,// 配置是否自动打开浏览器
    static: {
      // 实现监听
      watch: true,
    },
    hot: true,//开启热更新//可以更改服务器打开的文件（需要是上面提到插件打开的路径）
  },

  resolve: {
    // 路径别名
    alias: {
      '@': path.resolve('./src'),
      '@co': path.resolve(__dirname, 'src/components')
    },
    // 引入文件时省略后缀
    extensions: ['.js', '.ts', '.less', '.vue'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 8, // 8kb以下的图片会被base64处理
              outputPath: 'images', // 图片打包后存放的目录
              name: '[name].[ext]' // 图片打包后的名称
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|svg|woff)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'font',
              name: '[name].[ext]'
            }
          }
        ]
      },
      /*
        js兼容性处理：babel-loader @babel/core 
          1. 基本js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，如promise高级语法不能转换
          2. 全部js兼容性处理 --> @babel/polyfill  
            问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
          3. 需要做兼容性处理的就做：按需加载  --> core-js
      */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 1预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              '@babel/preset-env', //1默认情况兼容的处理
            ]
          ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 指定模板文件
      filename: 'index.html', // 指定生成的文件名称
      minify: {
        removeAttributeQuotes: true, // 删除html文件中的双引号
        collapseWhitespace: true // 折叠空行变成一行
      },
      hash: true // 给引入的文件加上hash戳
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }), // 将css文件单独打包成一个文件
  ],

}
