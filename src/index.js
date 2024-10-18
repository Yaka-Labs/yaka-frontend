import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { BrowserRouter } from 'react-router-dom'
import { Web3ReactProvider } from '@web3-react/core'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Web3ReactManager } from './utils/Web3ReactManager'
import { getLibrary } from './utils'
import './index.scss'
import store from './state'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactManager>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </Web3ReactManager>
    </Web3ReactProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
