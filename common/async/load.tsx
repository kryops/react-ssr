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
}

const loadAsync = (name: string, componentLoader: DynamicImport): AsyncComponentWrapper => (
    class AsyncComponent extends React.Component<Props,{}> {

        static componentName = name;
        static component: React.ComponentType<{}> | undefined
        static triggeredLoading = false
        static loadedPromise: Promise<any>

        mounted: boolean

        constructor(props: Props) {
            super(props)

            if (
                this.props.staticContext
                && this.props.staticContext.asyncComponents
                && this.props.staticContext.asyncComponents.indexOf(name) === -1
            ) {
                this.props.staticContext.asyncComponents.push(name)
            }

            if (!AsyncComponent.triggeredLoading) {
                AsyncComponent.triggeredLoading = true

                console.log('loading:', name)

                AsyncComponent.loadedPromise = componentLoader()
                    .then((componentModule) => {
                        AsyncComponent.component = componentModule.default
                        console.log('loading complete:', name)
                    })
            }

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
