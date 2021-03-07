// Gérer les IDs, selected study, warnings
import { ADD_SERIES, EDIT_DICOM_TAG } from '../actions/actions-types'

const initialState = {
  series: {},
  editions : {}
}

export default function SeriesReducer (state = initialState, action) {
  switch (action.type) {
    
    case ADD_SERIES:
      // Add Series to reducer
      const seriesObject = action.payload
      return {
        series: {
          ...state.series,
          [seriesObject.seriesInstanceUID]: { ...seriesObject }
        },
        editions : {...state.editions}
      }

    case EDIT_DICOM_TAG:
        // Add Series to reducer
        const editionObject = action.payload

        let newEditionObject = {}

        //If already existing edition take the previous known edition
        if(state.editions[editionObject.seriesInstanceUID] != null){
          newEditionObject = {...state.editions[editionObject.seriesInstanceUID]}
        }
        //add the new edition
        newEditionObject[editionObject.dicomTag] = editionObject.newValue

        return {
          series: { ...state.series },
          editions: {
            ...state.editions,
            [editionObject.seriesInstanceUID]: { ...newEditionObject },
            
          }
        }

    default:
      return state
  }
}
