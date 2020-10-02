// Gérer les IDs, selected study, warnings
import { SELECT_STUDY, SERIES_READY, SELECT_SERIES, STUDIES_READY } from '../actions/actions-types'

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

    case SERIES_READY:
      let seriesReady
      if (action.payload.isSelect) {

        if (!state.seriesReady.includes(action.payload.validSeriesInstanceUID)){
          // If select add SeriesInstanceUID to selectedSeries
          seriesReady = [...state.seriesReady, action.payload.validSeriesInstanceUID]
        } else {
          seriesReady = [...state.seriesReady]
        }

      } else if (!action.payload.isSelect) {
        // If not remove SeriesInstanceUID from selected Series Array
        seriesReady = state.seriesReady.filter(thisRowID => thisRowID !== action.payload.validSeriesInstanceUID)
      }
      return {
        ...state,
        seriesReady: seriesReady
      }

    default:
      return state
  }
}
