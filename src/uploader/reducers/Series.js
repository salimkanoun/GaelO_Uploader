// Gérer les IDs, selected study, warnings
import { ADD_SERIES, UPDATE_WARNING_SERIES } from '../actions/actions-types'

const initialState = {
  series: {}
}

export default function SeriesReducer (state = initialState, action) {
  switch (action.type) {
    //Ajouter une series au reducer
    case ADD_SERIES:
        let seriesObject = action.payload
        return {
            ...state,
            series : {
                ...state.series,
                [seriesObject.seriesInstanceUID] : {...seriesObject}
            }
        }

    //Ignore warning at series level
    case UPDATE_WARNING_SERIES:
        return{
            ...state
        }

    default:
      return state
  }
}
