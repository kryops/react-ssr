import * as React from 'react'
import { Route, RouteProps, RouteComponentProps } from 'react-router-dom'

export interface Props extends RouteProps {
    component: React.SFC<RouteComponentProps<any> | undefined> | React.ComponentClass<RouteComponentProps<any> | undefined>
}

const AsyncRoute: React.SFC<Props> = (props) => {

    const { component, render, ...rest } = props

    if (!component) {
        return <noscript />
    }

    return (
        <Route {...rest} render={({ staticContext }: any) => {
            return React.createElement(component as any, { staticContext })
        }} />
    )
}

export default AsyncRoute
