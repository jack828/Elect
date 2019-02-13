import { createLogger } from 'redux-logger'
import Immutable from 'immutable'

const noopMiddleware = () => next => action => next(action)

// https://github.com/evgenyrodionov/redux-logger#transform-immutable-with-combinereducers
const stateTransformer = (state) => {
  const newState = {}

  // eslint-disable-next-line
  Object.keys(state).map((key) => {
    newState[key] = Immutable.Iterable.isIterable(state[key])
      ? state[key].toJS()
      : state[key]
  })

  return newState
}

export default ({ devToolsExtension }) => {
  const logger = createLogger({ stateTransformer, collapsed: true, diff: true })
  return devToolsExtension ? noopMiddleware : logger
}
