const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'source'),
  mode: 'development', // Режим сборки
  entry: {
    main: './js/main.js',
  }, // Точка входа приложения
  output: {// Настройка выходного файла
    filename: '[name].js',
    path: path.join(__dirname, 'build/js'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
