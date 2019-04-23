import React, { Component } from 'react'
import { Provider } from 'react-redux'
import createStore from '../../store'
import Websocket from '../../lib/websocket'

import SiteLayout from './SiteLayout'

class Site extends Component {
  constructor(props) {
    super(props)
    this.state = {
      store: null,
      websocket: null
    }
    const ws = new Websocket()
    ws.once('open', () => {
      this.setState({ websocket: ws })
    })
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
        {this.state.websocket
          && <SiteLayout {...this.props} websocket={this.state.websocket} />
        }
      </Provider>
    )
  }
}

export default Site
