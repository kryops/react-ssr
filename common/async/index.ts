import loadAsync, { AsyncComponentWrapper } from './load'

export { default as preloadAsyncComponents } from './preload'
export { default as AsyncRoute } from './route'

export const Home = loadAsync('home', require('bundle-loader?lazy&name=home!../routes/home'))
export const Feature = loadAsync('feature', require('bundle-loader?lazy&name=feature!../routes/feature'))

export const asyncComponents: AsyncComponentWrapper[] = [
    Home,
    Feature,
]
