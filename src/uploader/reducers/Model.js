//Gérer les IDs, selected study, warnings
import { ADD_SERIES, ADD_STUDY, ADD_INSTANCE, UPDATE_WARNING_STUDY, ADD_WARNING_SERIES, UPDATE_WARNING_SERIES } from '../actions/actions-types'

const initialState = {
    studies: {},
    series: {},
}

export default function StudiesSeriesReducer(state = initialState, action) {

    switch (action.type) {

        case ADD_INSTANCE:
            let study = action.payload.study
            //Info necessary for Studies table
            let studyUID = study.studyUID
            let patientName = study.patientName
            let studyDescription = study.studyDescription
            let accessionNumber = study.accessionNumber
            let acquisitionDate = study.acquisitionDate
            let firstName = study.firstName
            let lastName = study.lastName
            let birthDate = study.birthDate
            let sex = study.sex

            let series = action.payload.series
            //Info necessary for Series table
            let seriesInstanceUID = series.seriesInstanceUID
            let seriesDescription = series.seriesDescription
            let modality = series.modality
            let seriesNumber = series.seriesNumber
            let seriesDate = series.seriesDate
            let numberOfInstances = series.numberOfInstances

            let instanceID = action.payload.instance.SOPInstanceUID
            console.log(state)
            if (state.studies[studyUID] == undefined) {
                study = {
                    studyUID, patientName, studyDescription, accessionNumber, acquisitionDate, firstName, lastName, birthDate, sex,
                    series: [action.payload.series.seriesInstanceUID]
                }
            } else {
                study = {
                    studyUID, patientName, studyDescription, accessionNumber, acquisitionDate, firstName, lastName, birthDate, sex,
                    series: [...state.studies[studyUID].series, action.payload.series.seriesInstanceUID]
                }
            }
            if (state.series[seriesInstanceUID] == undefined) {
                series = {
                    seriesInstanceUID, seriesDescription, modality, seriesNumber, seriesDate, numberOfInstances,
                    instances: [action.payload.instance.SOPInstanceUID]
                }
            } else {
                series = {
                    seriesInstanceUID, seriesDescription, modality, seriesNumber, seriesDate, numberOfInstances,
                    instances: [...state.series[seriesInstanceUID].instance, action.payload.instance.SOPInstanceUID]
                }
            }

            return {
                ...state,
                studies: {
                    ...state.studies,
                    [studyUID]: { ...study },
                },
                series: {
                    ...state.series,
                    [seriesInstanceUID]: { ...series },
                }
            }

        case UPDATE_WARNING_SERIES:
            let warningCopy = action.payload
            let seriesID_W = action.payload.objectID
            warningCopy.dismissed = !warningCopy.dismissed
            console.log(state.series[seriesID_W])
            return {
                ...state,
                series: {
                    ...state.series,
                    [seriesID_W]: {
                        ...state.series[seriesID_W],
                        [warningCopy.key]: { ...warningCopy }
                    }
                }
            }

        case ADD_WARNING_SERIES:
            let seriesID = action.payload.seriesID
            let seriesWarnings = action.payload.warnings
            return {
                ...state,
                series: {
                    ...state.series,
                    [seriesID]: { ...state.series[seriesID], [seriesWarnings.key]: { ...seriesWarnings } }
                }
            }

        default:
            return state
    }
}