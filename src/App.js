import 'regenerator-runtime/runtime'

import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { ToastContainer } from 'react-toastify'

// Boostrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Boostrap Table CSS
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
// Toastify CSS
import 'react-toastify/dist/ReactToastify.css'
// Custom GaelO Uploader CSS
import './assets/style/dicomupload.css'

import Uploader from './uploader/Uploader'
import reducers from './reducers'
import seriesWarningMiddelware from './middelware/SeriesWarningMiddelware'

function App (props) {

  const createStoreWithMiddleware = applyMiddleware(thunk, seriesWarningMiddelware)(createStore)

  return (
    <Provider store={createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
      />
      <Uploader {...props} />
    </Provider>
  )
}

export default App
