// Gérer les IDs, selected study, warnings
import { ADD_STUDIES_SERIES, UPDATE_WARNING_STUDY, ADD_WARNING_SERIES, UPDATE_WARNING_SERIES } from '../actions/actions-types'

const initialState = {
  studies: {},
  series: {}
}

export default function StudiesSeriesReducer (state = initialState, action) {
  switch (action.type) {
    case ADD_STUDIES_SERIES:
      const studies = {}
      const seriesList = {}

      // Info necessary for Studies table
      let studyUID
      let patientName
      let studyDescription
      let accessionNumber
      let acquisitionDate
      let firstName
      let lastName
      let birthDate
      let sex
      let series
      let studyWarnings = {}

      // Info necessary for Series table
      let seriesInstanceUID
      let seriesDescription
      let modality
      let seriesNumber
      let seriesDate
      let numberOfInstances
      let seriesWarnings = {}

      for (const stID in action.payload) {
        const study = action.payload[stID]
        studyUID = stID
        patientName = study.patientName
        studyDescription = study.studyDescription
        accessionNumber = study.accessionNumber
        acquisitionDate = study.acquisitionDate
        firstName = study.firstName
        lastName = study.lastName
        birthDate = study.birthDate
        sex = study.sex
        studyWarnings = study.warnings
        series = Object.keys(study.series)
        let studyToAdd
        if (studies[studyUID] == undefined) {
          studyToAdd = {
            studyUID,
            patientName,
            studyDescription,
            accessionNumber,
            acquisitionDate,
            firstName,
            lastName,
            birthDate,
            sex,
            warnings: { ...studyWarnings },
            series: [...series]
          }
        } else {
          studyToAdd = {
            studyUID,
            patientName,
            studyDescription,
            accessionNumber,
            acquisitionDate,
            firstName,
            lastName,
            birthDate,
            sex,
            warnings: { ...studyWarnings },
            series: [...series]
          }
        }
        studies[studyUID] = { ...studyToAdd }
        for (const srID in action.payload[stID].series) {
          let series = action.payload[stID].series[srID]
          seriesInstanceUID = srID
          seriesDescription = series.seriesDescription
          modality = series.modality
          seriesNumber = series.seriesNumber
          seriesDate = series.seriesDate
          numberOfInstances = Object.keys(series.instances).length
          seriesWarnings = series.warnings
          if (state.series[seriesInstanceUID] == undefined) {
            series = {
              seriesInstanceUID, seriesDescription, modality, seriesNumber, seriesDate, numberOfInstances, warnings: { ...seriesWarnings }
            }
          } else {
            series = {
              seriesInstanceUID, seriesDescription, modality, seriesNumber, seriesDate, numberOfInstances, warnings: { ...seriesWarnings }
            }
          }
          seriesList[seriesInstanceUID] = { ...series }
        }
      }

      return {
        ...state,
        studies: {
          ...state.studies,
          ...studies
        },
        series: {
          ...state.series,
          ...seriesList
        }
      }

    case UPDATE_WARNING_SERIES:
      const warningCopy = action.payload
      const seriesID_W = action.payload.objectID
      warningCopy.dismissed = !warningCopy.dismissed
      return {
        ...state,
        series: {
          ...state.series,
          warnings: {
            ...state.series.warnings,
            [seriesID_W]: {
              ...state.series.warnings[seriesID_W],
              [warningCopy.key]: { ...warningCopy }
            }
          }
        }
      }

    default:
      return state
  }
}
