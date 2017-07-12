import loadAsync, { AsyncComponentWrapper } from './load'
import preloadAsyncComponents from './preload'
import AsyncRoute from './route'

export { preloadAsyncComponents, AsyncRoute }

export const Home = loadAsync('home', () => import(/* webpackChunkName: "home" */ '../routes/home'))
export const Feature = loadAsync('feature', () => import(/* webpackChunkName: "feature" */ '../routes/feature'))

export const asyncComponents: AsyncComponentWrapper[] = [
    Home,
    Feature,
]
