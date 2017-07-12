import * as React from 'react'
import { Route, RouteProps } from 'react-router-dom'
import {AsyncComponentWrapper} from './load'

interface Props extends RouteProps {
    component: AsyncComponentWrapper
}

const AsyncRoute: React.SFC<Props> = (props) => {

    const { component, ...rest } = props
    const Component = component

    if (!Component) {
        return null
    }

    return (
        <Route {...rest} render={({ staticContext }: any) => (
            <Component staticContext={staticContext} />
        )} />
    )
}

export default AsyncRoute
