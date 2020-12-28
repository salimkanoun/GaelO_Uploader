
import { ADD_STUDY, SET_VISIT_ID, SET_USED_VISIT, SET_NOT_USED_VISIT, UNSET_VISIT_ID, UPDATE_WARNING_STUDY } from './actions-types'

/**
 * Add study to Redux studies Object
 * @param {Object} studyObject
 */
export function addStudy (studyInstanceUID, patientFirstName, patientLastName, patientSex, patientID, acquisitionDate, patientBirthDate, studyDescription, orthancStudyID, series ) {

  return {
    type: ADD_STUDY,
    payload: {
      idVisit : null,
      patientFirstName : patientFirstName,
      patientLastName : patientLastName,
      patientName : patientFirstName+' '+patientLastName,
      patientSex : patientSex,
      patientID : patientID,
      studyDescription : studyDescription,
      acquisitionDate : acquisitionDate,
      patientBirthDate : patientBirthDate,
      studyInstanceUID : studyInstanceUID,
      orthancStudyID : orthancStudyID,
      series : series
    }
  }
}



/**
 * Set idVisit to the passed study awaiting check
 * @param {String} studyInstanceUID
 * @param {Integer} idVisit
 */
export function setVisitID (studyInstanceUID, idVisit) {

  return function (dispatch){

    //Make id visit used
    dispatch( 
      {
        type: SET_USED_VISIT,
        payload: { idVisit: idVisit}
      }
    )

    //Attach Visit to study
    dispatch(
      {
        type: SET_VISIT_ID,
        payload: {
          studyInstanceUID: studyInstanceUID,
          idVisit: idVisit
        }
      }
    )

    //remove NULLVisitID Warning
    dispatch(
      {
        type: UPDATE_WARNING_STUDY,
        payload: {
          studyInstanceUID: studyInstanceUID,
          warningKey: 'NULL_VISIT_ID'
        }
      }
    )


  }


}

export function unsetVisitID(studyInstanceUID, idVisit) {

  return function (dispatch){

    //Mark Visit not used in the visit redux
    dispatch( 
      {
        type: SET_NOT_USED_VISIT,
        payload: { idVisit: idVisit}
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

  }

}
