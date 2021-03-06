# react-ssr

Example of a universal React application with [react-router](https://github.com/ReactTraining/react-router) v4 and async code splitting

## How it works

* On the server, we want to preload all async chunks and render them through `renderToString()`. This has to be done synchronously, we can't wait for a loading callback inside `componentWillMount()`
* On the client, we usually want to lazy-load async chunks only when they are needed
* When the server renders a component from an async chunk, we want to have it loaded on the client before we start the client-side render, as otherwise the server-rendered content would disappear again until the chunk is loaded on the client. The rendering on the client has to be done synchronously again.
* We prefer to share the same application code between the client and the server
* We prefer not having to use a specific webpack configuration that magically replaces modules on the server

### Code splitting [(source)](./common/async/index.ts)

The code splitting itself can be done in several ways:

* Using the dynamic ES `import()` syntax
* webpack's `require.ensure()`
* webpack's [bundle-loader](https://github.com/webpack-contrib/bundle-loader)


```ts
() => import(/* webpackChunkName: "home" */ '../routes/home')
```

or alternatively

```ts
require('bundle-loader?lazy&name=home!../routes/home')
```

For more options around async code splitting see [the webpack docs for async code splitting](https://webpack.js.org/guides/code-splitting-async/).

### AsyncComponent [(source)](common/async/load.tsx)

The AsyncComponent has the following responsibilities:

* Load its chunk when instantiated

```ts
if (!AsyncComponent.triggeredLoading) {
    AsyncComponent.triggeredLoading = true
    AsyncComponent.loadedPromise = componentLoader()
        .then((componentModule) => {
            AsyncComponent.component = componentModule.default
        })
}
```
            
* Render *synchronously* if already loaded

```ts
render() {
    const Component = AsyncComponent.component
    if (Component) {
        return <Component {...this.props} />
    } else {
        return null
    }
}
```

* Refresh after the chunk was loaded otherwise

```ts
if (!AsyncComponent.component) {
    AsyncComponent.loadedPromise.then(() => {
        if (this.mounted) {
            this.forceUpdate()
        }
    })
}
```

* Notify its context that it has to be preloaded on the client to guarantee a flicker-free rendering

```ts
if (
    staticContext
    && staticContext.asyncComponents
    && staticContext.asyncComponents.indexOf(name) === -1
) {
    staticContext.asyncComponents.push(name)
}
```

To share the same code between all async chunks, we create `AsyncComponent`s through a `loadAsync()` factory function:

```ts
export const Home = loadAsync('home', () => import(/* webpackChunkName: "home" */ '../routes/home'))
```

### AsyncRoute [(source)](./common/async/route.tsx)

To make react-router's `staticContext` available for the `AsyncComponent`, we create an `AsyncRoute` that wraps a `Route` component:

```ts
const AsyncRoute: React.SFC<Props> = (props) => {

    const { component, ...rest } = props
    const Component = component

    return (
        <Route {...rest} render={({ staticContext }) => (
            <Component staticContext={staticContext} />
        )} />
    )
}
```

This allows us to define routes using `AsyncComponent`s like this:

```ts
<Switch>
    <AsyncRoute path="/" exact component={Home} />
    <AsyncRoute path="/feature" exact component={Feature} />
</Switch>
```


### Server-side [(source)](./server/index.tsx)

The server has to

* preload all async chunks by instantiating all `AsyncComponent`s

```ts
Promise.all(
    asyncComponents.map(Component => Component.preload())
)
```

* Collect information about which async chunk are rendered for the current route and pass it on to the client

```ts
const context: StaticContext = {
    asyncComponents: []
}

const content = renderToString(
    <StaticRouter location={req.url} context={context}>
        <App />
    </StaticRouter>
)

// ...

`<script>
 window.asyncComponents = ${JSON.stringify(context.asyncComponents)}
 </script>`
```


### Client-side [(source)](./client/index.tsx)

The client has to preload the `AsyncComponent`s that have been passed from the server before starting the client-side render:

```ts
await preloadAsyncComponents(window.asyncComponents || [])
```

## Resources & Further reading

* https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194#file-app-js-L21
* https://medium.com/@apostolos/server-side-rendering-code-splitting-and-hot-reloading-with-react-router-v4-87239cfc172c
