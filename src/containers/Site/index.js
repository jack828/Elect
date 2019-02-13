import React, { Component } from 'react'
import { Provider } from 'react-redux'
import createStore from '../../store'

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

    return (
      <Provider store={this.state.store}>
        <SiteLayout {...this.props} />
      </Provider>
    )
  }
}

export default Site
