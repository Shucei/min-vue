
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/',
    clear: true
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        // css-loader只负责将css文件进行加载
        // style-loader负责将样式添加到DOM中
        // 使用多个loader时，是从右向左
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        // css-loader只负责将css文件进行加载
        // style-loader负责将样式添加到DOM中
        // 使用多个loader时，是从右向左/
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top'
            }
          },
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        // use: 'file-loader'
        // 当加载的图片，小于limit时，会将图片编译成base64字符串形式
        // 当加载的图片，大于limit时，需要使用file-loader模块进行加载
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 13000,
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        // exclude: 排除
        // include: 包含
        // enforce: 'pre' 优先执行
        // enforce: 'post' 延后执行
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            // plugins: [
            //   '@babel/plugin-proposal-class-properties',
            //   '@babel/plugin-transform-runtime'
            // ]
          }
        },
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        enforce: 'pre'
      },
      // {
      //   test: /\.vue$/,
      //   use: {
      //     loader: 'vue-loader'
      //   }
      // }
    ]
  },
  resolve: {
    // alias: 别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    // extensions: 扩展名
    extensions: ['.js', '.css', '.vue']
  },
  plugins: [
    new webpack.BannerPlugin('最终版权归aaa所有'),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin()
  ],
  devServer: {
    contentBase: './dist',
    inline: true
  }
}
