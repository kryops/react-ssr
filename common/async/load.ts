import * as React from 'react'

type BundleLoader = (fn: (component: { default: React.SFC<any> }) => void) => void

export type AsyncComponentWrapper = React.ComponentClass<any> & {
    componentName: string
    loadedPromise: Promise<any>
}

interface Props {
    staticContext?: {
        asyncComponents: string[]
    }
}

const loadAsync = (name: string, componentLoader: BundleLoader): AsyncComponentWrapper => (
    class AsyncComponent extends React.Component<Props,{}> {

        static componentName = name;
        static component: React.SFC<{}> | undefined
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

                AsyncComponent.loadedPromise = new Promise((resolve) => {
                    componentLoader((component) => {
                        AsyncComponent.component = component.default
                        console.log('loading complete:', name)
                        resolve()
                    })
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
            if (AsyncComponent.component) {
                return React.createElement(AsyncComponent.component, this.props)
            } else {
                return null
            }
        }
    }
)

export default loadAsync
