import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import storage from 'redux-persist/lib/storage'
import immutableTransform from 'redux-persist-transform-immutable'
import createLogger from './logger'
import rootReducer from './reducer'

const persistConfig = {
  key: 'primary',
  version: 1,
  storage,
  transforms: [ immutableTransform() ]
}

const reducer = persistReducer(persistConfig, rootReducer)
const middleware = [
  thunkMiddleware,
  createLogger(window)
]

export default () => new Promise((resolve) => {
  const store = createStore(
    reducer,
    undefined,
    compose(
      applyMiddleware(...middleware),
      f => f
    )
  )
  const persistor = persistStore(store, null, () => (
    resolve({ store, reducer, persistor })
  ))
})
