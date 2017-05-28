import * as path from 'path'
import * as webpack from 'webpack'

const root = process.cwd()

const config: webpack.Configuration = {
    target: 'node',
    devtool: 'source-map',
    entry: {
        main: './server/index.tsx'
    },
    output: {
        path: path.resolve(root, 'dist/server'),
        filename: 'server.js',
        chunkFilename: '[name].js',
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
    externals: [
        (context, request, callback: any) => {
            if(request[0] === '.' || request.indexOf('!') !== -1) {
                return callback()
            } else {
                return callback(null, 'commonjs ' + request)
            }
        }
    ],
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin()
    ],
}

export default config
