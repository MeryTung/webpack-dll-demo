const path = require('path')
const webpack = require('webpack')
const { srcPath,distPath } = require('./paths')

module.exports = {
    mode: 'development',
    resolve: {
		extensions: [".js", ".jsx"]
	},
    entry:{
        react:['react', 'react-dom']
    },
    output:{
        path:distPath,
        filename: "[name].dll.js",
        library:'_dll_[name]'
    },
    plugins:[
        new webpack.DllPlugin({
            name:'_dll_[name]',
            path: path.join(distPath,'[name].manifest.json')
        })
    ]
}