import { combineReducers } from 'redux'
import Series from './Series'
import Studies from './Studies'
import DisplayTables from './DisplayTables'
import Warnings from './Warnings'
import Visits from './Visits'
import WarningsStudy from './WarningsStudy'

const appReducer =  combineReducers({
  Series,
  Studies,
  DisplayTables,
  Warnings,
  WarningsStudy,
  Visits
})

const rootReducer = (state, action) => {
  if (action.type === 'RESET_REDUX') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer