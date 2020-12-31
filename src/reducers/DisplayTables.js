// Gérer les IDs, selected study, warnings
import { SELECT_STUDY, ADD_SERIES_READY, REMOVE_SERIES_READY, SELECT_SERIES, ADD_STUDIES_READY, REMOVE_STUDIES_READY } from '../actions/actions-types'

const initialState = {
  selectedStudy: null,
  selectedSeries: null,
  seriesReady: [],
  studiesReady: []
}

export default function DisplayTablesReducer(state = initialState, action) {
  console.log(state)
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
      let newStudiesReady2 = [...state.studiesReady]
      //add StudyInstanceUID to selectedStudies
      if (!state.studiesReady.includes(action.payload.studyInstanceUID)) {
        newStudiesReady2.push(action.payload.studyInstanceUID)
      }else throw new Error('Impossible to Add a Study already in ready list')


      return {
        ...state,
        studiesReady: newStudiesReady2
      }

    case REMOVE_STUDIES_READY:
      if ( !state.studiesReady.includes(action.payload.studyInstanceUID) ) throw new Error('Impossible to Remove a Study not in ready list')
      //remove SeriesInstanceUID from selected Series Array
      let newStudiesReady = state.studiesReady.filter(thisRowID => thisRowID !== action.payload.studyInstanceUID)
      return {
        ...state,
        studiesReady: [...newStudiesReady]
      }

    case ADD_SERIES_READY:
      let seriesReady = [...state.seriesReady]
      console.log(action)
      if (!seriesReady.includes(action.payload.seriesInstanceUID)) {
        //add SeriesInstanceUID to selectedSeries
        seriesReady.push(action.payload.seriesInstanceUID)
      } else throw new Error('Impossible to Add a Series already in ready list')

      return {
        ...state,
        seriesReady: seriesReady
      }

    case REMOVE_SERIES_READY:
      if ( !state.seriesReady.includes(action.payload.seriesInstanceUID) ) throw new Error('Impossible to Remove a Series not in ready list')
      let newSeriesReady = state.seriesReady.filter(thisRowID => thisRowID !== action.payload.seriesInstanceUID)
      return {
        ...state,
        seriesReady: [...newSeriesReady]
      }

    default:
      return state
  }
}
