import { asyncComponents } from './index'

const preloadAsyncComponents = (components?: string[]) => {
    console.log('preloading:', components)
    return Promise.all(
        asyncComponents
            .filter(Component => components === undefined || components.indexOf(Component.componentName) !== -1)
            .map(Component => Component.preload())
    )
}

export default preloadAsyncComponents
