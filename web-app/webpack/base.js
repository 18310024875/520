var time = require('./time');
var timeStr = '构建时间为 ===>  '+time(new Date(),'YYYY-MM-DD HH:mm');
console.log('$$$$$$$$$$$$$$$$$$$$$$   '+timeStr+'   $$$$$$$$$$$$$$$$$$$$$$');


const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const CopyWebpackPlugin = require('copy-webpack-plugin');


const ENV = process.env.NODE_ENV ;
const src = path.resolve(__dirname,'..','src');
const enterPath  = path.join(src,'main.js');
const outputPath = path.resolve(__dirname,'..','dist');

module.exports = {
    devtool:'eval-source-map',
    entry: {
        app: ["babel-polyfill", enterPath ] 
    },
    output:{
        path: outputPath ,
        filename:'[name]-[hash:7].js',
        chunkFilename:'[id].index-[chunkhash:7].js'
    },
    resolveLoader:{
        modules: [path.resolve(__dirname,'..','com_modules'),"node_modules"],
    },
    resolve: {
        alias: {
            com    :  path.resolve(__dirname,'..','com_modules','com') ,
            src    :  src ,
            assets :  path.join(src,'assets') ,
            components: path.join(src,'components')
        },
        extensions: ['.js', '.com', '.less', '.css']
    },
    module: {
        rules: [
            {
                test:/\.com$/,
                use:[{loader: 'babel-loader'},{loader:'com-loader'}],
                exclude: /^node_modules$/,
            },
            {
                test: /\.js$/,
                use: [{loader: 'babel-loader'}],
                exclude: /^node_modules$/,
            },
            {
                test: /\.com$/,
                use: [{loader: 'com-loader'}],
                exclude: /^node_modules$/,
            },
            {
                test: /\.css$/,
                use: [{loader: 'style-loader'},{loader: 'css-loader', options: {minimize: false}},{loader: 'postcss-loader'}],
                exclude: /^node_modules$/,          
            },
            {
                test: /\.less$/,
                use: [{loader: 'style-loader'},{loader: 'css-loader', options: {minimize: false}},{loader: 'postcss-loader'},{loader: 'less-loader'}],
                exclude: /^node_modules$/,
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [{loader: 'url-loader',options: {limit: 20480000,name: 'fonts/[name].[hash:7].[ext]'}}],//大于20k打包进fonts文件夹
                exclude: /^node_modules$/,
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{loader: 'url-loader',options: {limit: 20480,name: 'img/[name].[hash:7].[ext]'}}],//大于20k打包进img文件夹
                exclude: /^node_modules$/,
            }
        ]
    },
    plugins: [       
        // 直接通过服务器引入需要考培文件夹 --- 不会经过编译 ;
        new CopyWebpackPlugin([{
            from: path.join(src,'assets'),// 空页面 echarts 移动dist文件夹
            to:   path.join(outputPath,'assets')
        }]),
        new webpack.DefinePlugin({
            "timeStr":JSON.stringify(timeStr) ,
            "ENV": JSON.stringify(ENV)
        }),
        new HtmlWebpackPlugin({
            hash: true,
            title: "",
            favicon:  path.join(src,'assets','images','favicon_dt.ico'),
            template: path.join(src,'assets','html','index.html'),
            filename: 'index.html',
        })
    ]
}








