import { ADD_SERIES, EDIT_DICOM_TAG } from './actions-types'

/**
 * Add series to Redux series Object
 * @param {Object} series
 */
export function addSeries (instances, seriesInstanceUID, seriesNumber, seriesDate, seriesDescription, modality, studyInstanceUID, patientWeight, patientSize, structureSetROISequence) {
  
  let seriesObject = {
    instances : instances,
    seriesInstanceUID : seriesInstanceUID,
    seriesNumber : seriesNumber,
    seriesDate : seriesDate,
    seriesDescription : seriesDescription,
    modality : modality,
    studyInstanceUID : studyInstanceUID,
    patientWeight : patientWeight,
    patientSize : patientSize,
    numberOfInstances : Object.keys(instances).length,
    structureSetROISequence : structureSetROISequence
  }

  return {
    type: ADD_SERIES,
    payload: seriesObject
  }
}

export function addEditionValue(seriesInstanceUID, dicomTag, newValue){

  let editionObject = {
    seriesInstanceUID : seriesInstanceUID,
    dicomTag : dicomTag,
    newValue : newValue
  }

  return {
    type: EDIT_DICOM_TAG,
    payload: editionObject
  }

}
