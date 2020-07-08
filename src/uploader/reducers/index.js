import { combineReducers } from 'redux'
import StudiesSeries from './StudiesSeries'
import DisplayTables from './DisplayTables'
import CheckPatient from './CheckPatient'

export default combineReducers({
  StudiesSeries,
  DisplayTables,
  CheckPatient
})
