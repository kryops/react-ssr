import * as merge from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import clientConfig from './webpack.client'

const config = merge(clientConfig, {
    plugins: [
        new BundleAnalyzerPlugin()
    ]
})

export default config
