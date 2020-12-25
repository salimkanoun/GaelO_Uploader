// Gérer les IDs, selected study, warnings
import { SELECT_STUDY, ADD_SERIES_READY, REMOVE_SERIES_READY, SELECT_SERIES, STUDIES_READY } from '../actions/actions-types'

const initialState = {
  selectedStudy: undefined,
  selectedSeries: undefined,
  seriesReady: [],
  studiesReady: []
}

export default function DisplayTablesReducer (state = initialState, action) {
  switch (action.type) {
    
    case SELECT_STUDY:
      return {
        ...state,
        selectedStudy: action.payload,
        selectedSeries: undefined
      }

    case SELECT_SERIES:
      return {
        ...state,
        selectedSeries: action.payload
      }

    case STUDIES_READY:
      let studiesReady
      if (action.payload.isSelect) {
        // If select add SeriesInstanceUID to selectedSeries
        // Distinct cases for uniqueUpload mode purpose
        if (state.studiesReady === undefined) studiesReady = [action.payload.studiesInstanceUID]
        else if (!state.studiesReady.includes(action.payload.studiesInstanceUID)) studiesReady = [...state.studiesReady, action.payload.studiesInstanceUID]
        else studiesReady = [...state.studiesReady]
      } else if (!action.payload.isSelect) {
        // If not remove SeriesInstanceUID from selected Series Array
        if (state.studiesReady !== undefined) studiesReady = state.studiesReady.filter(thisRowID => thisRowID !== action.payload.studiesInstanceUID)
        else studiesReady = [...state.studiesReady]
      }
      return {
        ...state,
        studiesReady: studiesReady
      }

    case ADD_SERIES_READY:
      let seriesReady = state.seriesReady

      if (!seriesReady.includes(action.payload.seriesInstanceUID)){
        // If select add SeriesInstanceUID to selectedSeries
        seriesReady.push(action.payload.seriesInstanceUID)
      }

      return {
        ...state,
        seriesReady : [...seriesReady]
      }

    case REMOVE_SERIES_READY:

      let newSeriesReady = state.seriesReady.filter(thisRowID => thisRowID !== action.payload.validSeriesInstanceUID)
      return {
        ...state,
        seriesReady: newSeriesReady
      }

    default:
      return state
  }
}
