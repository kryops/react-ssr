import * as React from 'react'

type AsyncComponentModule = { default: React.ComponentType<{}> }
type DynamicImport = () => Promise<AsyncComponentModule>

interface Props {
    staticContext?: {
        asyncComponents: string[]
    }
}

export type AsyncComponentWrapper = React.ComponentClass<Props> & {
    componentName: string
    loadedPromise: Promise<any>
    preload: () => Promise<any>
}

const loadAsync = (name: string, componentLoader: DynamicImport): AsyncComponentWrapper => (
    class AsyncComponent extends React.Component<Props,{}> {

        static componentName = name;
        static component: React.ComponentType<{}> | undefined
        static triggeredLoading = false
        static loadedPromise: Promise<any>

        static preload() {
            AsyncComponent.load()
            return AsyncComponent.loadedPromise
        }

        static load() {
            if (!AsyncComponent.triggeredLoading) {
                AsyncComponent.triggeredLoading = true

                console.log('loading:', name)

                AsyncComponent.loadedPromise = componentLoader()
                    .then((componentModule) => {
                        AsyncComponent.component = componentModule.default
                        console.log('loading complete:', name)
                    })
            }
        }

        mounted: boolean

        constructor(props: Props) {
            super(props)

            const { staticContext } = props

            if (
                staticContext
                && staticContext.asyncComponents
                && staticContext.asyncComponents.indexOf(name) === -1
            ) {
                staticContext.asyncComponents.push(name)
            }

            AsyncComponent.load()

            if (!AsyncComponent.component) {
                AsyncComponent.loadedPromise.then(() => {
                    if (this.mounted) {
                        this.forceUpdate()
                    }
                })
            }
        }

        componentWillMount() {
            this.mounted = true
        }

        componentWillUnmount() {
            this.mounted = false
        }

        render() {
            const Component = AsyncComponent.component
            if (Component) {
                return <Component {...this.props} />
            } else {
                return null
            }
        }
    }
)

export default loadAsync
