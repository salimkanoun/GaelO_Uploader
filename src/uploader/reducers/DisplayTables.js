// Gérer les IDs, selected study, warnings
import { SELECT_STUDY, SELECT_SERIES } from '../actions/actions-types'

const initialState = {
  selectedStudy: null,
  selectedSeries: []
}

export default function DisplayTablesReducer (state = initialState, action) {
  switch (action.type) {
    case SELECT_STUDY:
      return {
        ...state,
        selectedStudy: action.payload
      }

    case SELECT_SERIES:
      if (action.payload.isSelect) {
        return {
          ...state,
          selectedSeries: [...state.selectedSeries, action.payload.row.seriesInstanceUID]
        }
      } else {
        return {
          ...state,
          selectedSeries: state.selectedSeries.filter(thisRow => thisRow !== action.payload.row.seriesInstanceUID)
        }
      }

    default:
      return state
  }
}
