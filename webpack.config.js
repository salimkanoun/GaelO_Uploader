module.exports = {
    entry: './src/index_umd.js',
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js',
      library: 'Gaelo_Uploader',
      libraryTarget: 'umd'
    },
    devServer: {
      contentBase: './dist',
    },
    module: {
      rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
      ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
      },
  };