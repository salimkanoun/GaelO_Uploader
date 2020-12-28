import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { toast } from 'react-toastify'
import JSZip from 'jszip'

import Model from '../model/Model'
import DicomFile from '../model/DicomFile'

import DicomDropZone from './render_component/DicomDropZone'

import ParsingDetails from './render_component/ParsingDetails'
import ControllerStudiesSeries from './ControllerStudiesSeries'
import ProgressUpload from './render_component/ProgressUpload'
import Options from './render_component/Options'
import Util from '../model/Util'

import { getPossibleImport, logIn, registerStudy, validateUpload, isNewStudy } from '../services/api'

import { addStudy, setVisitID } from '../actions/Studies'
import { addSeries } from '../actions/Series'
import { addWarningsSeries, addWarningsStudy } from '../actions/Warnings'
import { addVisit, resetVisits } from '../actions/Visits'
import { selectStudy, addStudyReady } from '../actions/DisplayTables'
import { addSeriesReady } from '../actions/DisplayTables'
import { NULL_VISIT_ID, ALREADY_KNOWN_STUDY } from '../model/Warning'
import DicomMultiStudyUploader from '../model/DicomMultiStudyUploader'
class Uploader extends Component {

    state = {
        isFilesLoaded: false,
        isParsingFiles: false,
        isUnzipping: false,
        isUploading: false,
        fileParsed: 0,
        fileLoaded: 0,
        zipProgress: 0,
        uploadProgress: 0,
        studyProgress: 0,
        studyLength: 1,
        ignoredFiles: {},
        isCheckDone: false
    }

    constructor(props) {
        super(props)

        this.config = this.props.config
        this.uploadModel = new Model();

        this.uppy = Uppy({
            id: 'uppy',
            autoProceed: true,
            allowMultipleUploads: true,
            debug: true
        })

        this.uppy.use(Tus, {
            endpoint: '/tus', // use your tus endpoint here
            resume: true,
            autoRetry: true,
            chunkSize: 2000000,
            limit: 10,
            headers: {},
            retryDelays: [0, 1000, 3000, 5000]
        })

        this.uppy.on('upload-error', (file, error, response) => {
            toast.error(`Error with file: ${file.id}. Error message: ${error}`)
        })

    }

    componentDidMount = async () => {
        if (this.config.developerMode) {
            await logIn()
            await registerStudy()
        }
        await this.loadAvailableVisits()

    }

    loadAvailableVisits = async ()=>{

        let answer = await getPossibleImport()

        answer= {"AvailablePatients":{"PET0":[{"numeroPatient":"17017101051001","firstName":"F","lastName":"V","patientSex":"M","patientDOB":"02-00-1941","investigatorName":"KARLIN","country":"France","centerNumber":"10501","acquisitionDate":"11-10-2020","visitType":"PET0","idVisit":179}]}}

        //Add All availables visits in visit reducer
        for (let visitArray of Object.values(answer.AvailablePatients) ) {
            visitArray.forEach(visit => {
                this.props.addVisit(visit)
            })
        }

    }

    /**
     * Read droped files (listen to DropZone event)
     * @param {Array} files 
     */
    addFile = (files) => {

        if (files.length === 1 && files[0].type === 'application/zip') {
            this.readAsZipFile(files[0])
            return
        }

        if (this.state.fileParsed === 0) {
            //At first drop notify user started action
            this.config.callbackOnStartAction()
        }

        //Add number of files to be parsed to the previous number (incremental parsing)
        this.setState((previousState) => {
            return {
                fileLoaded: (previousState.fileLoaded + files.length),
                isParsingFiles: true
            }
        })

        //Build promise array for all files reading
        let readPromises = files.map((file) => {
            return this.read(file)
        })

        //Once all promised resolved update state and refresh redux with parsing results
        Promise.all(readPromises).then(() => {
            this.setState({ isFilesLoaded: true, isParsingFiles: false })
            this.checkSeriesAndUpdateRedux()
        })

    }

    /**
     * Read and parse a single dicom file
     * @param {File} file 
     */
    read = async (file) => {
        try {
            let dicomFile = new DicomFile(file)
            await dicomFile.readDicomFile()

            //if Secondary capture or DicomDir do no register file
            if (dicomFile.isDicomDir()) {
                throw Error('Dicomdir file')
            }
            if (dicomFile.isSecondaryCaptureImg()) {
                throw Error('Secondary Capture Image')
            }

            //Register Study, Series, Instance if new in model
            let studyInstanceUID = dicomFile.getStudyInstanceUID()
            let seriesInstanceUID = dicomFile.getSeriesInstanceUID()

            let study
            if (!this.uploadModel.isExistingStudy(studyInstanceUID)) {
                study = this.uploadModel.addStudy(dicomFile.getStudyObject())
            } else {
                study = this.uploadModel.getStudy(studyInstanceUID)
            }

            let series
            if (!study.isExistingSeries(seriesInstanceUID)) {
                series = study.addSeries(dicomFile.getSeriesObject())
            } else {
                series = study.getSeries(seriesInstanceUID)
            }

            series.addInstance(dicomFile.getInstanceObject())

            this.setState((previousState) => {
                return { fileParsed: ++previousState.fileParsed }
            })

        } catch (error) {
            //If exception register file in ignored file list

            //Save only message of error
            let errorMessage = error
            if (typeof error === 'object') {
                errorMessage = error.message
            }
            this.setState(state => {
                return {
                    ignoredFiles: {
                        ...state.ignoredFiles,
                        [file.name]: errorMessage
                    }
                }
            })
        }

    }

    readAsZipFile = async (file) => {
        this.setState({
            isUnzipping: true
        })
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            // Retrieve file content as Uint8Array
            const arrayBuffer = reader.result;
            const byteArray = new Uint8Array(arrayBuffer);

            JSZip.loadAsync(byteArray).then((zip) => {
                // Remove the zip file from the loaded files
                let promises = []
                for (let elmt in zip.files) {
                    elmt = zip.files[elmt];
                    // Check if it is a file or a directory
                    if (!elmt.dir) {
                        // Decompress file
                        promises.push(
                            elmt.async('blob').then((data) => {
                                let elmtFile = new File([data], elmt.name);
                                //Add full path to match drag and drop upload
                                elmtFile.fullPath = elmt.name
                                return elmtFile
                            })
                        )
                    }
                }
                Promise.all(promises).then(elements => {
                    this.setState({
                        isUnzipping: false
                    })
                    this.addFile(elements)
                })
            }).catch((e) => {
                console.log('error zip' + e)
            })
        }
    }

    /**
     * Check studies/series with warning and populate redux
     */
    checkSeriesAndUpdateRedux = async () => {
        this.setState({ isCheckDone: false })
        this.props.selectStudy(undefined)
        this.props.resetVisits()
        await this.loadAvailableVisits()
        //Scan every study in Model
        for (let studyInstanceUID in this.uploadModel.data) {
            //Retrieve StudyObject from Model
            let studyToAdd = this.uploadModel.data[studyInstanceUID]

            //Add study to Redux
            this.props.addStudy(
                studyToAdd.getStudyInstanceUID(), 
                studyToAdd.getPatientFirstName(), 
                studyToAdd.getPatientLastName(), 
                studyToAdd.getPatientSex(), 
                studyToAdd.getPatientID(), 
                studyToAdd.getAcquisitionDate(), 
                studyToAdd.getPatientBirthDate(), 
                studyToAdd.getStudyDescription(),
                studyToAdd.getOrthancStudyID(),
                Object.keys(studyToAdd.series)
            )
            //Add study warnings to Redux
            let studyRedux = this.props.studies[studyInstanceUID]

            //Search for a perfect Match in visit candidates and assign it
            let perfectMatchVisit = this.searchPerfectMatchStudy(studyRedux)
            if (perfectMatchVisit != null) {
                this.props.setVisitID(studyInstanceUID, perfectMatchVisit.idVisit)
            }
            
            let studyWarnings = await this.getStudyWarning(studyRedux)

            //If no warning mark it as ready, if not add warning to redux
            if( Util.isEmptyObject(studyWarnings) ) this.props.addStudyReady(studyInstanceUID)
            else this.props.addWarningsStudy(studyInstanceUID, studyWarnings)

            //Scan every series in Model
            let series = this.uploadModel.data[studyInstanceUID].getSeriesArray()
            
            for (let seriesInstance of series) {

                let seriesWarnings = await seriesInstance.getWarnings()
                //Add series to redux
                this.props.addSeries(
                    seriesInstance.getInstancesObject(),
                    seriesInstance.getSeriesInstanceUID(),
                    seriesInstance.getSeriesNumber(),
                    seriesInstance.getSeriesDate(),
                    seriesInstance.getSeriesDescription(),
                    seriesInstance.getModality(),
                    seriesInstance.getStudyInstanceUID()
                )
                //Add series related warnings to Redux
                this.props.addWarningsSeries(seriesInstance.getSeriesInstanceUID(), seriesWarnings )
                //Automatically add to Redux seriesReady if contains no warnings
                if( Util.isEmptyObject( seriesWarnings ) ){
                    this.props.addSeriesReady( seriesInstance.getSeriesInstanceUID() )
                }
                
            }
        }
        this.setState({ isCheckDone: true })
    }

    /**
     * Generate warnings for a given study
     * @param {*} study 
     */
    getStudyWarning = async (studyRedux) => {
        let warnings = {}

        //if Visit ID is not set add Null Visit ID (visitID Needs to be assigned)
        if ( studyRedux.idVisit == null ) warnings[NULL_VISIT_ID.key] = NULL_VISIT_ID

        // Check if study is already known by server
        try{
            let newStudy = await isNewStudy( studyRedux.orthancStudyID )
            if (!newStudy) warnings[ALREADY_KNOWN_STUDY.key] = ALREADY_KNOWN_STUDY
        } catch (error){
            console.warn(error)
            toast.error("Session expired, please refresh browser",  {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                }
            )
        }

        return warnings
    }

    /**
     * Search a perfect match visit for a registered study in redux
     * @param {object} studyRedux 
     */
    searchPerfectMatchStudy = (studyRedux) => {
        // Linear search through expected visits list
        for (let visitObject of Object.values(this.props.visits) ) {
            if ( this.isPerfectMatch(studyRedux, visitObject) ) {
                return visitObject;
            }
        }

        return undefined;
    }

    getVisitDataById = (idVisit) => {
        for (let visit of this.props.visits) {
            if ( visit.idVisit === idVisit ) {
                return visit;
            }
        }
    }

    /**
     * Determine if all identification keys are matching of a study / visit couple
     * @param {object} studyRedux 
     * @param {object} visitObject 
     */
    isPerfectMatch = (studyRedux, visitObject) => {

        let patientFirstname = studyRedux.patientFirstName
        let patientLastname = studyRedux.patientLastName
        let birthDate = studyRedux.patientBirthDate
        let sex = studyRedux.patientSex
        let acquisitionDate = studyRedux.acquisitionDate

        if (Util.areEqualFields(visitObject.firstName.trim().charAt(0), patientFirstname.trim().charAt(0))
        && Util.areEqualFields(visitObject.lastName.trim().charAt(0), patientLastname.trim().charAt(0))
        && Util.areEqualFields(visitObject.patientSex.trim().charAt(0), sex.trim().charAt(0))
        && Util.isProbablyEqualDates(visitObject.patientDOB, Util.formatRawDate(birthDate))
        && Util.isProbablyEqualDates(visitObject.acquisitionDate, Util.formatRawDate(acquisitionDate))) {
            return true
        } else return false
    }
    /**
     * Upload selected and validated series on click
     */
    onUploadClick = async () => {

        //build array of series object to be uploaded
        let seriesObjectArrays = this.props.seriesReady.map((seriesUID) => {
            return this.props.series[seriesUID]
        })

        //get unique StudyUID in series arrays
        let studyUIDArray = seriesObjectArrays.map((seriesObject) => {
            return seriesObject.studyInstanceUID
        })
        studyUIDArray = Array.from(new Set(studyUIDArray))

        //Filter non selected studyUID
        studyUIDArray = studyUIDArray.filter(studyUID => (this.props.studiesReady.includes(studyUID)))

        if (studyUIDArray.length === 0) {
            toast.error('No Selected Series to Upload')
            return
        }

        let uploader = new DicomMultiStudyUploader(this.uppy)

        //group series by studyUID
        for (let studyInstanceUID of studyUIDArray) {

            let idVisit = this.props.studies[studyInstanceUID].idVisit

            let seriesInstanceUID = seriesObjectArrays.filter((seriesObject) => {
                return (seriesObject.studyInstanceUID === studyInstanceUID)
            })
            let studyOrthancID = this.uploadModel.getStudy(studyInstanceUID).getOrthancStudyID()

            let filesToUpload = []

            seriesInstanceUID.forEach(seriesObject => {
                let getSeriesObject = this.uploadModel.getStudy(studyInstanceUID).getSeries(seriesObject.seriesInstanceUID)
                let fileArray = getSeriesObject.getArrayInstances().map(instance => {
                    return instance.getFile()
                })
                filesToUpload.push(...fileArray)
            })

            uploader.addStudyToUpload(idVisit, filesToUpload, studyOrthancID)

        }

        uploader.on('batch-zip-progress', (studyNumber, zipProgress) => {
            this.setState({
                studyLength: studyUIDArray.length,
                studyProgress: studyNumber,
                zipProgress: zipProgress
            })

        })

        uploader.on('batch-upload-progress', (studyNumber, uploadProgress) => {
            this.setState({
                studyLength: studyUIDArray.length,
                studyProgress: studyNumber,
                uploadProgress: uploadProgress
            })

        })

        uploader.on('study-upload-finished', (idVisit, timeStamp, numberOfFiles, sucessIDsUploaded, studyOrthancID) => {
            console.log('sutdy upload Finished')
            validateUpload(idVisit, timeStamp, sucessIDsUploaded, numberOfFiles, studyOrthancID)
        })


        uploader.on('upload-finished', () => {
            console.log('full upload Finished')
            //this.setState({ isUploading: false })
            this.config.callbackOnUploadComplete()
        })

        uploader.startUpload()
        this.setState({ isUploading: true })
    }

    render = () => {
        return (
            <Fragment>
                <div>
                    <DicomDropZone
                        addFile={this.addFile}
                        isUnzipping={this.state.isUnzipping}
                        isParsingFiles={this.state.isParsingFiles}
                        isUploading={this.state.isUploading}
                        fileParsed={this.state.fileParsed}
                        fileIgnored={Object.keys(this.state.ignoredFiles).length}
                        fileLoaded={this.state.fileLoaded}
                    />
                </div>
                <div className="mb-3" hidden={!this.state.isParsingFiles && !this.state.isFilesLoaded}>
                    <ParsingDetails
                        fileLoaded={this.state.fileLoaded}
                        fileParsed={this.state.fileParsed}
                        dataIgnoredFiles={this.state.ignoredFiles}
                    />
                    <Options />
                </div>
                <div hidden={!this.state.isFilesLoaded}>
                    <ControllerStudiesSeries
                        isCheckDone={this.state.isCheckDone}
                        isUploading={this.state.isUploading}
                        multiUpload={this.config.multiUpload}
                        selectedSeries={this.props.selectedSeries} />
                    <ProgressUpload
                        isUploading={this.state.isUploading}
                        multiUpload={this.config.multiUpload}
                        studyProgress={this.state.studyProgress}
                        studyLength={this.state.studyLength}
                        onUploadClick={this.onUploadClick}
                        zipPercent={this.state.zipProgress}
                        uploadPercent={this.state.uploadProgress} />
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        visits: state.Visits.visits,
        expectedVisit: state.Visits.expectedVisit,
        studies: state.Studies.studies,
        series: state.Series.series,
        selectedSeries: state.DisplayTables.selectedSeries,
        seriesReady: state.DisplayTables.seriesReady,
        studiesReady: state.DisplayTables.studiesReady,
        warningsSeries: state.Warnings.warningsSeries,
    }
}
const mapDispatchToProps = {
    addStudy,
    addSeries,
    addWarningsStudy,
    addWarningsSeries,
    addVisit,
    selectStudy,
    addStudyReady,
    addSeriesReady,
    setVisitID,
    resetVisits
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)