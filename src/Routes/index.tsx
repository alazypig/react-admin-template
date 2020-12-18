import React, {useEffect} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import {observer} from 'mobx-react'
import useStores from 'Stores'
import Home from 'Pages/Home'
import Login from 'Pages/Login'

function Routes() {
  const {root} = useStores()

  useEffect(() => {
    root.init()
  }, [root])

  if (!root.isLoading) {
    return null
  }

  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/home" component={Home} />
      <Redirect to="/" />
    </Switch>
  )
}

export default observer(Routes)
