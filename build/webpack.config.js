const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { srcPath,distPath } = require('./paths')

module.exports = {
    entry:{
        index:path.join(srcPath, 'index.js')
    },
    output:{
        path:distPath,
        filename:'[name]-[contenthash:8].js', 
        clean:true
    },
    module:{
        rules:[
            {
                test:/\.m?j?js$/,
                include: srcPath,
                exclude:/node_module/,
                use:{
                    loader: 'babel-loader',
                    options: {
                    presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test:/\.css$/,
                include:srcPath,
                exclude:/node_modules/,
                use:['style-loader','css-loader','postcss-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:path.join(srcPath, 'index.html'),
            filename:'[name].html'
        }),
        new AddAssetHtmlPlugin({ filepath: path.join(distPath, 'react.dll.js') }),
    ]
}

