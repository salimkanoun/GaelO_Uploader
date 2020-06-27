import React from 'react';
import Uploader from "./uploader/Uploader"

//Uppy CSS
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
//Boostrap Table CSS
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
//Custom CSS
import './style/dicomupload.css'

function App() {
  return (
    <Uploader />
  );
}

export default App;
