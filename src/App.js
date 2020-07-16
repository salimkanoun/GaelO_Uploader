import 'regenerator-runtime/runtime'

import React from 'react'
import Uploader from './uploader/Uploader'

// Boostrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Boostrap Table CSS
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
// Custom CSS
import './index.css'
import './style/dicomupload.css'


import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './uploader/reducers'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

function App () {
  
  return (
    <Provider store={createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
      <Uploader />
    </Provider>
  )
}

export default App
