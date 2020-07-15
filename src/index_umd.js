import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

function installUploader(config = {}, containerId = 'root') {
  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error(
      "No root element found to install viewer. Please add a <div> with the id 'root', or pass a DOM element into the installViewer function."
    );
  }

  return ReactDOM.render(<App config={config} />, container);
}

export { App, installUploader };

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
