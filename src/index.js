import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import * as serviceWorker from './serviceWorker'

const dotenv = require('dotenv');
dotenv.config();
console.log(process.env)

const config = {
  // Declare default config
  developerMode: true,
  multiUpload: false,
  minNbOfInstances: 30,
  idVisit: process.env.GAELO_VISITID,
  callbackOnComplete: () => {}
}

const container = document.getElementById('root')
ReactDOM.render(<App config={config} />, container)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
