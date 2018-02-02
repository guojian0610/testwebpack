// Requiring dependencies
// ================================================================================
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import fs from 'fs';
import webpack, {
    DefinePlugin,
    NoEmitOnErrorsPlugin ,
    ProvidePlugin,
    HashedModuleIdsPlugin
} from 'webpack'
// Defining config variables
// ================================================================================
const BUILD_PATH = path.join(__dirname, 'build');
const ENV = process.env.NODE_ENV || 'development'
const entry = {
    vendor: ['react','react-dom'],
    app: './index.jsx'
}
const output = {
    path: BUILD_PATH,
    pathinfo: ENV === 'development' ? true : false,//告诉 webpack 在 bundle 中引入「所包含模块信息」的相关注释。此选项默认值是 false，并且不应该用于生产环境(production)，但是对阅读开发环境(development)中的生成代码(generated code)极其有用。
    filename: ENV === 'development' ? "js/debug/[name]-debug.js" : 'js/prod/[name].[chunkhash:8].js',//取8位的hash，默认是16位
};

let rules = [
    {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
    }
];

let plugins = [
    new DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(ENV)
        }
    }),
];

if(ENV === 'development'){
    plugins.push(
        new UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    sequences: true,
                    dead_code: true,
                    unused: true
                },
                compressor: {
                    warnings: false
                },
                output: {
                    comments: false
                }
            }
        )
    );
    plugins.push(new ExtractTextPlugin({
        filename: 'public/css/[name].[chunkhash:8].css',
        allChunks: true
    }));

    rules.push({
        test: /\.(scss|sass|css)$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: 'css-loader'
        })
    })
}
// Export
// ===============================================================================
export default {
    context: path.join(__dirname, 'app'),
    entry,
    output,
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.scss', '.css'], //后缀名自动补全
    },
    module: {
        rules
    },
    plugins:[
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(ENV)
            }
        }),
    ],
    externals: {
        'zepto':'$'
    },
    devtool: ENV === 'development' ? 'cheap-module-eval-source-map':'cheap-module-source-map'
};