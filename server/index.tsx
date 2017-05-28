import * as express from 'express'

import * as React from 'react'
import { renderToString } from 'react-dom/server'

import { StaticRouter } from 'react-router-dom'

import { preloadAsyncComponents } from '../common/async'
import App from '../common/app'

// preload all async components on the server
preloadAsyncComponents()

const assets: any = require('../webpack-assets.json')


const app = express()

app.use(express.static('./dist/client'))

interface StaticContext {
    asyncComponents: string[]
}

app.get('*', (req, res) => {

    const context: StaticContext = {
        asyncComponents: []
    }

    const content = renderToString(
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    )

    const doc = `<!DOCTYPE html>
<html>
<head>
    <title>SSR test</title>
</head>
<body>
<div id="root">${content}</div>
<script>
window.asyncComponents = ${JSON.stringify(context.asyncComponents)}
</script>
<script src="${assets.manifest.js}"></script>
<script src="${assets.vendor.js}"></script>
<script src="${assets.main.js}" async></script>
</body>
</html>`

    res.status(200).send(doc)
})

app.listen(3000)
