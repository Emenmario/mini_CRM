import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Signup from './Signup'
import Signin from './signin'
import Dashboard from './Dashboard'
import Analytics from './Analytics'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/analytics' element={<Analytics/>}/>
      </Routes>
    </div>
  )
}

export default App
