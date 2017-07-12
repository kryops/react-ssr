import * as path from 'path'
import * as webpack from 'webpack'
import * as AssetsPlugin from 'assets-webpack-plugin'

const root = process.cwd()

const config: webpack.Configuration = {
    devtool: 'source-map',
    entry: {
        main: './client/index.tsx'
    },
    output: {
        path: path.resolve(root, 'dist/client'),
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            async: true,
            minChunks: 2,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: (module: any) => (
                module.context && module.context.indexOf('node_modules') !== -1
            ),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
        }),
        new AssetsPlugin()
    ],
}

export default config
