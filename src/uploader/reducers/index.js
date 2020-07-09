import { combineReducers } from 'redux'
import Model from './Model'
import DisplayTables from './DisplayTables'
import CheckPatient from './CheckPatient'

export default combineReducers({
  Model,
  DisplayTables,
  CheckPatient
})
