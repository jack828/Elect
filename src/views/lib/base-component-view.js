import { Component } from 'react'
import EventEmitter from 'events'

/*
 * This file only exists to allow all Views to have
 * the EventEmitter, and the React Component API
 */

class BaseComponentView extends Component {
  constructor(props) {
    super(props)
    EventEmitter.call(this)
  }
}

Object.assign(BaseComponentView.prototype, EventEmitter.prototype)

export default BaseComponentView
