import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Admin from './Admin'
import Site from './Site'

import './App.scss'

const App = () => (
  <HashRouter>
    <Switch>
      <Route path="/" component={Site} />
      <Route path="/admin" component={Admin} />
    </Switch>
  </HashRouter>
)

export default App
