import React from 'react';
import './App.css';
import Uploader from "./uploader/uploader"

//Css for uppy
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/status-bar/dist/style.css'

function App() {
  return (
    <Uploader/>
  );
}

export default App;
