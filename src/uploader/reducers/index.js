import { combineReducers } from 'redux'
import WarningDisplay from './WarningDisplay'
import StudiesSeries from './StudiesSeries'
import CheckPatient from './CheckPatient'

export default combineReducers({
  WarningDisplay,
  StudiesSeries,
  CheckPatient
})
