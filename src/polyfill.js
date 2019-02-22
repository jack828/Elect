import 'react-app-polyfill/ie9' // For IE 9-11 support
import 'react-app-polyfill/ie11' // For IE 11 support
import 'core-js/es6/array'
import 'core-js/es6/map'
import 'core-js/es6/set'
import 'core-js/es7/object'

// CustomEvent() constructor functionality in IE9, IE10, IE11
// eslint-disable-next-line
(function () {
  if (typeof window.CustomEvent === 'function') return false

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    const evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})()
