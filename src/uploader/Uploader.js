import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

import Model from '../model/Model'
import DicomFile from '../model/DicomFile'

import DicomDropZone from './render_component/DicomDropZone'

import ParsingDetails from './render_component/ParsingDetails'
import ControllerStudiesSeries from './ControllerStudiesSeries'
import ProgressUpload from './render_component/ProgressUpload'
import WarningPatient from './render_component/WarningPatient'
import Util from '../model/Util'

import { getPossibleImport, logIn, registerStudy, validateUpload } from '../services/api'

import { addSeries, addStudy, addWarningsStudy } from './actions/StudiesSeries'
import { addWarningsSeries } from './actions/Warnings'
import { addVisit, setExpectedVisitID } from './actions/Visits'
import { NOT_EXPECTED_VISIT, NULL_VISIT_ID } from '../model/Warning'
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
            chunkSize: 2000000,
            limit: 3,
            headers: {},
            retryDelays: [0, 1000, 3000, 5000]
        })

        this.uppy.on('upload-error', (file, error, response) => {
            console.log('error with file:', file.id)
            console.log('error message:', error)
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
        if(!this.config.multiUpload) this.props.setExpectedVisitID(this.config.idVisit) 
        this.props.addVisit(visits)
    }

    /**
     * Read droped files (listen to DropZone event)
     * @param {Array} files 
     */
    addFile(files) {

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
                let studyWarnings = this.checkStudy(this.uploadModel.data[studyInstanceUID])
                //Add study to Redux
                this.props.addStudy(this.uploadModel.data[studyInstanceUID])
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

    checkStudy(study) {
        let warnings = {}
        // Check if the study corresponds to the visits in wait for series upload
        let expectedVisit = this.findExpectedVisit(study);
        if (expectedVisit === undefined) {
            warnings[NOT_EXPECTED_VISIT.key] = NOT_EXPECTED_VISIT;
        }

        // Check if visit ID is set
        if (this.props.expectedVisit === null || typeof this.props.expectedVisit === undefined) {
            warnings[NULL_VISIT_ID.key] = NULL_VISIT_ID;
        }
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
        console.log(this.props.seriesReady)
        console.log(this.props.studiesReady)
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

        //group series by studyUID
        for (let studyInstanceUID of studyUIDArray) {

            let seriesInstanceUID = seriesObjectArrays.filter((seriesObject) => {
                return (seriesObject.studyInstanceUID === studyInstanceUID)
            })
            let studyOrthancID = this.uploadModel.getStudy(studyInstanceUID).getOrthancStudyID()

            let filesToUpload = []

            seriesInstanceUID.forEach(seriesObject => {
                console.log(studyInstanceUID)
                console.log(seriesObject.seriesInstanceUID)
                let getSeriesObject = this.uploadModel.getStudy(studyInstanceUID).getSeries(seriesObject.seriesInstanceUID)
                let fileArray = getSeriesObject.getArrayInstances().map(instance => {
                    return instance.getFile()
                })
                filesToUpload.push(...fileArray)
            })
            console.log(filesToUpload)
            let uploader = new DicomMultiStudyUploader(this.uppy)
            uploader.addStudyToUpload(282, filesToUpload)
            uploader.on('upload-progress', (studyNumber, zipProgress, uploadProgress) => {
                this.setState({
                    studyLength : studyUIDArray.length,
                    studyProgress : studyNumber,
                    uploadProgress: uploadProgress,
                    zipProgress: zipProgress
                })
                console.log(zipProgress)
                console.log(uploadProgress)

            })
            uploader.on('upload-finished', (visitID, timeStamp, numberOfFiles) => {
                this.config.callbackOnComplete()
                console.log('Batch Finished')
                validateUpload(visitID, timeStamp, numberOfFiles, studyOrthancID)
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
    setExpectedVisitID
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)