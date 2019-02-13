import React, { Component } from 'react'
import { Provider } from 'react-redux'
import createStore from '../../store'
import Websocket from '../../lib/websocket'

import SiteLayout from './SiteLayout'

class Site extends Component {
  constructor(props) {
    super(props)
    this.state = {
      store: null
    }
  }

  async componentDidMount() {
    const { store } = await createStore()

    this.setState({ store })
  }

  render() {
    if (!this.state.store) return null

    // TODO: WebsocketProvider
    return (
      <Provider store={this.state.store}>
        <SiteLayout {...this.props} websocket={new Websocket()} />
      </Provider>
    )
  }
}

export default Site
