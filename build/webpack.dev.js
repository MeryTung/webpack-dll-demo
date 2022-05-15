const webpack = require('webpack')
const path = require('path')
const webpackCommonConf = require('./webpack.config.js')
const { merge } = require('webpack-merge')
const { srcPath, distPath } = require('./paths')


module.exports = merge(webpackCommonConf,{
    mode:'development',
    entry:{
        index:path.join(srcPath,'index.js')
    },
    module:{
        rules:[
            {
                test:/\.m?js$/,
                include: srcPath,
                exclude:/node_modules/,
                use:{
                    loader: 'babel-loader',
                    options: {
                    presets: ['@babel/preset-env','@babel/preset-react']
                    }
                }
            },
              {
                 test:/\.(png|jpg|jpeg|gif)$/,
                 loader: 'file-loader'
                 //type: 'asset/resource'
              }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            //window.ENV = 'production';
            ENV: JSON.stringify('development')
        }),
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.DllReferencePlugin({
            manifest:require(path.join(distPath, 'react.manifest.json'))
        })
    ],
    devServer:{
        port:8008,
        client: {progress: true},  //打包显示进度条
        static: {
            directory: srcPath, //根目录
            // publicPath: '/serve-public-path-url',
          },
        open:true, //自动打开
        compress:true //开启压缩
    },
    optimization: {
        runtimeChunk: 'single'
    },
})