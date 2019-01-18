import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import DashboardPlugin from 'webpack-dashboard/plugin'
import BrowserSyncPlugin from 'browser-sync-webpack-plugin'

const config = {
  target: 'web',
  devtool: 'inline-source-map',
  mode: 'development',
  node: {
    fs: 'empty'
  },
  entry: {
    index: [
      './src/js/index.mjs'
    ]
  },
  output: {
    path: path.resolve(__dirname, './src/public/'),
    filename: `[name].bundle.js`,
    publicPath: '/'
  },
  performance: {
    hints: false
  },
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  externals: {
    jquery: 'jQuery'
  },
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2)/,
        loader: 'file-loader',
        options: {
          name: './src/static/fonts/[name].[ext]'
        }
      },
      {
        test: /\.(png|svg|gif)$/,
        loader:
        'file-loader',
        options: {
          name: './src/static/images/[name].[ext]'
        }
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          'css-hot-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              includePaths: [
                path.resolve(__dirname, 'node_modules/')
              ]
            }
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-transform-modules-amd',
              '@babel/plugin-transform-regenerator',
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      }
    ]
  },
  // Needed for Materialize to properly add its funcitons to jQuery global
  plugins: [
    new DashboardPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/html/template.html'),
      inject: 'body'
    }),
    new BrowserSyncPlugin({
      host: '0.0.0.0',
      port: 3001,
      proxy: 'http://localhost:3000/',
      reload: false
    })
  ],
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.js', '.mjs']
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    contentBase: './src/public',
    compress: true,
    port: '3000',
    bonjour: true,
    hot: true
  }
}

export default config;