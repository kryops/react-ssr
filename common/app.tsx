import * as React from 'react'
import { Switch, Link } from 'react-router-dom'
import { Home, Feature, AsyncRoute } from './async'

const App: React.SFC<{}> = () => (
    <div>
        <h1>APP</h1>
        <p>
            <Link to="/">Home</Link>
            <Link to="/feature">Feature</Link>
        </p>
        <Switch>
            <AsyncRoute path="/" exact component={Home} />
            <AsyncRoute path="/feature" exact component={Feature} />
        </Switch>
    </div>
)

export default App
