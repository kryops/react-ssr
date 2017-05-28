import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from '../common/app'
import { preloadAsyncComponents } from '../common/async'

declare const window: Window & {
    asyncComponents?: string[]
}

const bootstrap = async () => {

    // preload only the async components on the client that the server rendered for the page
    await preloadAsyncComponents(window.asyncComponents || [])

    render(
        (
            <BrowserRouter>
                <App />
            </BrowserRouter>
        ),
        document.getElementById('root'),
    )
}

bootstrap()
