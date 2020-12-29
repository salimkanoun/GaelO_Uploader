// Gérer les IDs, selected study, warnings
import { SELECT_STUDY, ADD_SERIES_READY, REMOVE_SERIES_READY, SELECT_SERIES, ADD_STUDIES_READY, REMOVE_STUDIES_READY } from '../actions/actions-types'

const initialState = {
  selectedStudy: null,
  selectedSeries: null,
  seriesReady: [],
  studiesReady: []
}

export default function DisplayTablesReducer(state = initialState, action) {

  switch (action.type) {

    case SELECT_STUDY:
      return {
        ...state,
        selectedStudy: action.payload,
        selectedSeries: null
      }

    case SELECT_SERIES:
      return {
        ...state,
        selectedSeries: action.payload
      }

    case ADD_STUDIES_READY:
      let newStudiesReady2 = state.studiesReady
      // If select add SeriesInstanceUID to selectedSeries
      // Distinct cases for uniqueUpload mode purpose
      if (!state.studiesReady.includes(action.payload.studyInstanceUID)) newStudiesReady2.push(action.payload.studyInstanceUID)

      return {
        ...state,
        studiesReady: [...newStudiesReady2]
      }

    case REMOVE_STUDIES_READY:
      //remove SeriesInstanceUID from selected Series Array
      let newStudiesReady = state.studiesReady.filter(thisRowID => thisRowID !== action.payload.studyInstanceUID)
      return {
        ...state,
        studiesReady: [...newStudiesReady]
      }

    case ADD_SERIES_READY:
      let seriesReady = state.seriesReady

      if (!seriesReady.includes(action.payload.seriesInstanceUID)) {
        // If select add SeriesInstanceUID to selectedSeries
        seriesReady.push(action.payload.seriesInstanceUID)
      }

      return {
        ...state,
        seriesReady: [...seriesReady]
      }

    case REMOVE_SERIES_READY:
      let newSeriesReady = state.seriesReady.filter(thisRowID => thisRowID !== action.payload.seriesInstanceUID)
      return {
        ...state,
        seriesReady: [...newSeriesReady]
      }

    default:
      return state
  }
}
