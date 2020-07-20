import { combineReducers } from 'redux'
import Series from './Series'
import Studies from './Studies'
import DisplayTables from './DisplayTables'
import Warnings from './Warnings'

export default combineReducers({
  Series,
  Studies,
  DisplayTables,
  Warnings
})
