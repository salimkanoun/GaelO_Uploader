import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import {toast} from 'react-toastify'

import Model from '../model/Model'
import DicomFile from '../model/DicomFile'

import DicomDropZone from './render_component/DicomDropZone'

import ParsingDetails from './render_component/ParsingDetails'
import ControllerStudiesSeries from './ControllerStudiesSeries'
import ProgressUpload from './render_component/ProgressUpload'
import WarningPatient from './render_component/WarningPatient'
import Util from '../model/Util'
import Alert from 'react-bootstrap/Alert'

import { getPossibleImport, logIn, registerStudy, validateUpload, isNewStudy } from '../services/api'

import { addStudy, addWarningsStudy, setVisitID } from './actions/Studies'
import { addSeries } from './actions/Series'
import { addWarningsSeries } from './actions/Warnings'
import { addVisit } from './actions/Visits'
import { NOT_EXPECTED_VISIT, NULL_VISIT_ID, ALREADY_KNOWN_STUDY } from '../model/Warning'
import DicomMultiStudyUploader from '../model/DicomMultiStudyUploader'
class Uploader extends Component {

    state = {
        isFilesLoaded: false,
        isParsingFiles: false,
        isUploadStarted: false,
        fileParsed: 0,
        fileLoaded: 0,
        zipProgress: 0,
        uploadProgress: 0,
        studyProgress : 0,
        studyLenght : 0,
        ignoredFiles: {},
        showWarning: false,
        showAlertZipFiles: true
    }

    constructor(props) {
        super(props)
        this.config = this.props.config
        this.uploadModel = new Model();
        this.addFile = this.addFile.bind(this)
        this.onHideWarning = this.onHideWarning.bind(this)
        this.onUploadClick = this.onUploadClick.bind(this)

        this.uppy = Uppy({
            id: 'uppy',
            autoProceed: true,
            allowMultipleUploads: true,
            debug: true
        })

        this.uppy.use(Tus, {
            endpoint: 'tus', // use your tus endpoint here
            resume: true,
            autoRetry: true,
            chunkSize: 500000,
            limit: 3,
            headers: {},
            retryDelays: [0, 1000, 3000, 5000]
        })

        this.uppy.on('upload-error', (file, error, response) => {
            console.log('error with file:', file.id)
            console.log('error message:', error)
            toast.error(`Error with file: ${file.id}. Error message: ${error}`)
        })

    }

    async componentDidMount() {
        if (this.config.developerMode) {
            await logIn()
            await registerStudy()
        }

        let answer = await getPossibleImport()
        console.log(answer)
        let visitTypes = Object.values(answer)
        console.log(visitTypes)
        let visits = []
        visitTypes.forEach(types => {
            for (let type in types) {
                types[type].forEach(visit => {
                    let visitToPush = visit
                    visitToPush['isUsed'] = false
                    visits.push(visitToPush)
                })
            }
        })
        this.props.addVisit(visits)
    }

    /**
     * Read droped files (listen to DropZone event)
     * @param {Array} files 
     */
    addFile(files) {

        if(this.state.fileParsed ===0){
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
    async read(file) {
        try {
            this.uploadModel = new Model()

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

    /**
     * Check series to add warnings
     */
    //SK ici c'est un peu le bordel
    //Au final peut etre rafraichir tout le redux quitte a perdre les actions faites
    //si on ajoute de nouveaux fichiers
    async checkSeriesAndUpdateRedux() {
        //Check series to send warning
        //SK ICI A AMELIORER NE TESTER QUE LES NOUVELLE SERIES DEPUIS LE PARSE
        let studies = this.uploadModel.getStudiesArray()
        for (let study of studies) {
            let series = study.getSeriesArray()
            for (let serieInstance of series) {
                //SK Cette methode check peut peut etre s'encapsuler dans series
                let firstInstance = serieInstance.getArrayInstances()[0]
                await serieInstance.checkSeries(new DicomFile(firstInstance.getFile()))

            }
        }

        //Scan every study in Model
        for (let studyInstanceUID in this.uploadModel.data) {
            //If not in multiupload mode
            if (!this.state.multiUpload) {
                //Check studies warnings
                let studyWarnings = await this.checkStudy(this.uploadModel.data[studyInstanceUID])
                let studyToAdd = this.uploadModel.data[studyInstanceUID]
                studyToAdd['idVisit'] = undefined
                if(!this.config.multiUpload) studyToAdd['idVisit'] = this.config.idVisit
                //Add study to Redux
                this.props.addStudy(studyToAdd)
                //Add study warnings to Redux
                this.props.addWarningsStudy(studyInstanceUID, studyWarnings)
                //If study has warnings, trigger a warning message
                if (this.uploadModel.data[studyInstanceUID].warnings !== {}) {
                    this.setState({ showWarning: true })
                }
            }
            //Scan every series in Model
            for (let seriesInstanceUID in this.uploadModel.data[studyInstanceUID].series) {
                //Add series to Redux
                this.props.addSeries(this.uploadModel.data[studyInstanceUID].series[seriesInstanceUID])
                //Add series warnings to Redux
                this.props.addWarningsSeries(seriesInstanceUID, this.uploadModel.data[studyInstanceUID].series[seriesInstanceUID].getWarnings())
            }
        }
    }

    async checkStudy(study) {
        let warnings = {}
        // Check if the study corresponds to the visits in wait for series upload
        let expectedVisit = this.findExpectedVisit(study);
        if (expectedVisit === undefined) warnings[NOT_EXPECTED_VISIT.key] = NOT_EXPECTED_VISIT;
        // Check if visit ID is set
        if (this.props.expectedVisit === null || typeof this.props.expectedVisit === undefined) warnings[NULL_VISIT_ID.key] = NULL_VISIT_ID;
        // Check if study is already known by server
        let newStudy = await isNewStudy( study.getOrthancStudyID() )
        if ( !newStudy ) warnings[ALREADY_KNOWN_STUDY.key] = ALREADY_KNOWN_STUDY
        return warnings
    }

    findExpectedVisit(studyObject) {
        let thisPatient = studyObject.getObjectPatientName();
        if (thisPatient.givenName === undefined) {
            return undefined;
        }
        if (thisPatient.familyName === undefined) {
            return undefined;
        }

        thisPatient.birthDate = studyObject.getPatientBirthDate();
        thisPatient.sex = studyObject.patientSex;

        if (thisPatient.birthDate === undefined || thisPatient.sex === undefined) {
            return undefined;
        }

        // Linear search through expected visits list
        for (let visit of this.props.visits) {
            if (visit.firstName.trim().toUpperCase().charAt(0) === thisPatient.givenName.trim().toUpperCase().charAt(0)
                && visit.lastName.trim().toUpperCase().charAt(0) === thisPatient.familyName.trim().toUpperCase().charAt(0)
                && visit.sex.trim().toUpperCase().charAt(0) === thisPatient.sex.trim().toUpperCase().charAt(0)
                && Util.isProbablyEqualDates(visit.birthDate, thisPatient.birthDate)) {
                return visit;
            }
        };
        return undefined;
    }

    /** 
     * Trigger hide warning if closed
     */
    onHideWarning() {
        this.setState((state) => { return { showWarning: !state.showWarning } });
    }

    /**
     * Upload selected and validated series on click
     */
    async onUploadClick(e) {

        //build array of series object to be uploaded
        let seriesObjectArrays = this.props.seriesReady.map((seriesUID) => {
            return this.props.series[seriesUID]
        })

        //get unique StudyUID in series arrays
        let studyUIDArray = seriesObjectArrays.map((seriesObject) => {
            return seriesObject.studyInstanceUID
        })
        studyUIDArray = Array.from(new Set(studyUIDArray))
        console.log(studyUIDArray)
        //Filter non selected studyUID
        studyUIDArray = studyUIDArray.filter(studyUID => (this.props.studiesReady.includes(studyUID)))

        if(studyUIDArray.length ===0 ) {
            toast.error('No Selected Series to Upload')
            return
        }
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

            let uploader = new DicomMultiStudyUploader(this.uppy)
            uploader.addStudyToUpload(idVisit, filesToUpload)
            uploader.on('batch-zip-progress', (studyNumber, zipProgress) => {
                this.setState({
                    studyLength : studyUIDArray.length,
                    studyProgress : studyNumber,
                    zipProgress: zipProgress
                })

            })
            uploader.on('batch-upload-progress', (studyNumber, uploadProgress) => {
                this.setState({
                    studyLength : studyUIDArray.length,
                    studyProgress : studyNumber,
                    uploadProgress: uploadProgress
                })

            })
            uploader.on('upload-finished', (idVisit, timeStamp, numberOfFiles) => {
                console.log('Batch Finished')
                this.config.callbackOnUploadComplete()
                validateUpload(idVisit, timeStamp, numberOfFiles, studyOrthancID)
                this.config.callbackOnValidationSent()
            })

            uploader.startUpload()
            this.setState({ isUploadStarted: true })

        }
    }

    render() {
        return (
            <Fragment>
                <div>
                    <DicomDropZone
                        addFile={this.addFile}
                        isParsingFiles={this.state.isParsingFiles}
                        isUploadStarted={this.state.isUploadStarted}
                        fileParsed={this.state.fileParsed}
                        fileIgnored={Object.keys(this.state.ignoredFiles).length}
                        fileLoaded={this.state.fileLoaded}
                    />
                    <Alert show={this.state.showAlertZipFiles} variant='info' onClose={() => this.setState({showAlertZipFiles: false})} dismissible>
                        ZIP files are not optimally supported yet; if you import such files, please make sure
                        you have enough computer RAM available. Othewise, please unzip the files and batch import them.
                    </Alert>
                </div>
                <div className="mb-3" hidden={!this.state.isParsingFiles && !this.state.isFilesLoaded}>
                    <ParsingDetails
                        fileLoaded={this.state.fileLoaded}
                        fileParsed={this.state.fileParsed}
                        dataIgnoredFiles={this.state.ignoredFiles}
                    />
                </div>
                <div hidden={!this.state.isFilesLoaded}>
                    <WarningPatient show={this.state.showWarning} closeListener={this.onHideWarning} />
                    <ControllerStudiesSeries multiUpload={this.config.multiUpload} selectedSeries={this.props.selectedSeries} />
                    <ProgressUpload multiUpload={this.config.multiUpload} studyProgress={this.state.studyProgress} studyLength={this.state.studyLenght} onUploadClick={this.onUploadClick} zipPercent={this.state.zipProgress} uploadPercent={this.state.uploadProgress} />
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
    setVisitID
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)