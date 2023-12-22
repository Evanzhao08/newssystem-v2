import { legacy_createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { CollApsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['isLoading'],
}

const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = legacy_createStore(persistedReducer, composeWithDevTools())
let persistor = persistStore(store)
export { store, persistor }

/* 
  store.dispatch()
  store.subsribe()
*/
