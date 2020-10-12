const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');

const smp = new SpeedMeasurePlugin();
const webpack = require('webpack');

const workingDirectory = process.cwd();
const PATHS = {
  src: path.join(workingDirectory, './src'),
};
// 多页面打包
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(workingDirectory, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];

    entry[pageName] = entryFile;
    return htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(workingDirectory, `./src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      }),
    );
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = smp.wrap({
  stats: 'errors-only',
  entry,
  // 构建时，减少文件搜索范围
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../node_modules/react/umd/react.production.min.js'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom/umd/react-dom.production.min.js'),
    },
    modules: [path.resolve(__dirname, '../node_modules')],
    extensions: ['.js'],
    mainFields: ['main'],
  },
  // 资源解析
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                cssnano(),
                autoprefixer({}),
              ],
            },
          },
          'sass-loader'],
      },
      {
        test: /\.js/,
        exclude: /node-modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              // the number of spawned workers, defaults to (number of cpus - 1) or
              // fallback to 1 when require('os').cpus() is undefined
              workers: 3,
            },
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
              plugins: ['transform-class-properties'],
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name]_[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    function catchException() { //  错误捕获
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length) {
          console.error(stats.compilation.error); // eslint-disable-line
          process.exit(1); // 0成功 、非0失败
        }
      });
    },
    new HardSourceWebpackPlugin(),
    new webpack.DllReferencePlugin({
      // eslint-disable-next-line global-require
      manifest: require('../build/library/library.json'),
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
  ].concat(htmlWebpackPlugins),
});
