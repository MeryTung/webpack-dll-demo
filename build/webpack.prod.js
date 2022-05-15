
const path = require('path');
const webpack = require('webpack')
const webpackCommonConf = require('./webpack.config.js')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const HappyPack = require('happypack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const {srcPath,distPath} = require('./paths')


module.exports = merge(webpackCommonConf,{
    mode: 'production',
    output:{
        path: distPath,
        filename:'[name]-[contenthash:8].js',
        clean:true
    },
    module:{
        rules: [
            {
                test:/.js$/,
                use:'HappyPack/loader?id=babel'//这个id=js就代表这是打包babel的

            },
            {

                test:/\.(css|scss)$/,
                include: srcPath,
                use:[
                    MiniCssExtractPlugin.loader, //这里不再用style-loader
                {
                  loader: 'css-loader',
                  options: {
                  //  modules: true,
                    // importloaders: 1
                  }
                },
                {
                 loader: 'postcss-loader',
                  options: {
                      postcssOptions: {
                        plugins:[
                          ['autoprefixer']
                        ]
                      }
                  }
                },
                'sass-loader'
              ]
              },
            {
                test:/.(png|jpg|jpeg|gif)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        //小于5KB的图片用base64格式产出
                        //否则，依然沿用file-loader的形式，产出
                      //  limits:5 * 1024,
                        //打包到 img1目录下
                        outputPath: '/img1/',
                        //设置图片的 cdn 地址（也可以统一在外面output）
                       // publicPath: 'http://cdn.abc.com'
                    }
                }
            }
        ]
    },
    plugins: [
        new HappyPack({  //这个id:babel就代表这是打包js的
            id:'babel',//
            use:[{//use是一个数组，这里写原先在rules的use里的loader配置
                loader:'babel-loader',
                options:{
                    presets:[
                        '@babel/preset-env',
                    ]
                }
            }]
        }),
        new webpack.DefinePlugin({
            ENV: JSON.stringify('production')
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        //抽离css文件
        new MiniCssExtractPlugin({
            filename: 'css/main.[contenthash:8].css'
        }),
          //多进程js打包
       new  ParallelUglifyPlugin({
        uglifyJS: {
            output: {
                beautify: false,
                comments: false
            }
        },
        warnings: false,
        compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true 
        }
    })
    ],
    optimization: {
        //压缩
        // minimizer: [new TerserPlugin({}), new CssMinimizerPlugin()]
    }
})