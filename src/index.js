import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter
} from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

import './index.css'
import AuthContainer from './app/AuthContainer'
import reportWebVitals from './reportWebVitals'

Sentry.init({
  dsn: 'https://f8b04c9dc5574d58b99591006f3647fe@o1282705.ingest.sentry.io/6490591',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContainer />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
