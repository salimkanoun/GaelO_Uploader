import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import * as serviceWorker from './serviceWorker'

const config = {
  // Declare default config
  minNbOfInstances: 30,
  availableVisits : [
    {"patientCode":"17017101051001",
    "patientFirstname":"F",
    "patientLastname":"V",
    "patientSex":"M",
    "patientDOB":"02-00-1941",
    "visitModality":"PT",
    "visitDate":"11-10-2020",
    "visitType":"PET0",
    "visitID": 1 }
  ],
  onStudyUploaded : (visitID, sucessIDsUploaded, numberOfFiles, originalStudyOrthancID) => {console.log(visitID)},
  onStartUsing : () => {console.log('use started')},
  onUploadComplete: () => {console.log('upload finished')}
}

const container = document.getElementById('root')
ReactDOM.render(<App config={config} />, container)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
