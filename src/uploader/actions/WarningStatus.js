import { UPDATE_WARNING_OBJECT } from './actions-types'

export function updateWarningObject(warningToUpdate){
    return {
        type: UPDATE_WARNING_OBJECT, 
        payload: warningToUpdate
    }
}