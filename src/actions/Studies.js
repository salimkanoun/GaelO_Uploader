
import { ADD_STUDY, SET_VISIT_ID, SET_USED_VISIT, SET_NOT_USED_VISIT, UNSET_VISIT_ID, REMOVE_WARNING_STUDY, ADD_WARNING_STUDY } from './actions-types'
import { NULL_VISIT_ID } from '../model/Warning'

/**
 * Add study to Redux studies Object
 * @param {Object} studyObject
 */
export function addStudy (studyInstanceUID, patientFirstName, patientLastName, patientSex, patientID, acquisitionDate, accessionNumber, patientBirthDate, studyDescription, orthancStudyID ) {

  return {
    type: ADD_STUDY,
    payload: {
      visitID : null,
      patientFirstName : patientFirstName,
      patientLastName : patientLastName,
      patientName : patientFirstName+' '+patientLastName,
      patientSex : patientSex,
      patientID : patientID,
      studyDescription : studyDescription,
      acquisitionDate : acquisitionDate,
      patientBirthDate : patientBirthDate,
      accessionNumber : accessionNumber,
      studyInstanceUID : studyInstanceUID,
      orthancStudyID : orthancStudyID
    }
  }
}



/**
 * Set visitID to the passed study awaiting check
 * @param {String} studyInstanceUID
 * @param {Integer} visitID
 */
export function setVisitID (studyInstanceUID, visitID) {

  return function (dispatch){

    //Make id visit used
    dispatch( 
      {
        type: SET_USED_VISIT,
        payload: { 
          visitID: visitID, 
          studyInstanceUID : studyInstanceUID
        }
      }
    )

    //Attach Visit to study
    dispatch(
      {
        type: SET_VISIT_ID,
        payload: {
          studyInstanceUID: studyInstanceUID,
          visitID: visitID
        }
      }
    )

    //remove NULLVisitID Warning
    dispatch(
      {
        type: REMOVE_WARNING_STUDY,
        payload: {
          studyInstanceUID: studyInstanceUID,
          warningKey: 'NULL_VISIT_ID'
        }
      }
    )


  }


}

export function unsetVisitID(studyInstanceUID, visitID) {

  return function (dispatch){

    //Mark Visit not used in the visit redux
    dispatch( 
      {
        type: SET_NOT_USED_VISIT,
        payload: { visitID: visitID}
      }
    )

    dispatch( 
      {
        type : UNSET_VISIT_ID,
        payload: {
          studyInstanceUID: studyInstanceUID
        }
      }
    )

    dispatch(

      {
        type: ADD_WARNING_STUDY,
        payload: { 
          studyInstanceUID: studyInstanceUID,
          warning: NULL_VISIT_ID
        }
      }

    )

  }

}
