import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'

import './App.scss'
import {StoreProvider} from 'Stores'
import Routes from 'Routes'

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes />
      </Router>
    </StoreProvider>
  )
}

export default App
