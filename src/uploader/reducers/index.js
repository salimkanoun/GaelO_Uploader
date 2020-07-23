import { combineReducers } from 'redux'
import Series from './Series'
import Studies from './Studies'
import DisplayTables from './DisplayTables'
import Warnings from './Warnings'
import Visits from './Visits'

export default combineReducers({
  Series,
  Studies,
  DisplayTables,
  Warnings,
  Visits
})
