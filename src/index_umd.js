import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

const config = {
  // Declare default config
      multiUpload: false,
      minNbOfInstances: 30,
      idVisit: null,
      /*callbackOnComplete: null,
      callbackOnBeforeUnload: function (event) {
        event.preventDefault();
        event.returnValue = ''; // Needed for Chrome
      },
      callbackOnAbort: function(){
        refreshInvestigatorDiv()
      }*/
      }

function installUploader (config = config, containerId = 'root') {
  const container = document.getElementById(containerId)

  if (!container) {
    throw new Error(
      "No root element found to install viewer. Please add a <div> with the id 'root', or pass a DOM element into the installViewer function."
    )
  }

  return ReactDOM.render(<App config={config} />, container)
}

export { App, installUploader }
