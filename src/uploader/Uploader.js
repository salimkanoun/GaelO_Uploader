import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { toast } from 'react-toastify'
import JSZip from 'jszip'

import Model from '../model/Model'
import DicomFile from '../model/DicomFile'

import { Alert } from 'react-bootstrap'

import DicomDropZone from './render_component/DicomDropZone'

import ParsingDetails from './render_component/ParsingDetails'
import ControllerStudiesSeries from './ControllerStudiesSeries'
import ProgressUpload from './render_component/ProgressUpload'
import Options from './render_component/Options'
import Util from '../model/Util'

import { addStudy, setVisitID } from '../actions/Studies'
import { addSeries } from '../actions/Series'
import { addWarningsSeries, addWarningsStudy } from '../actions/Warnings'
import { addVisit, resetRedux } from '../actions/Visits'
import { selectStudy, addStudyReady } from '../actions/DisplayTables'
import { addSeriesReady } from '../actions/DisplayTables'
import { NULL_VISIT_ID, ALREADY_KNOWN_STUDY } from '../model/Warning'
import DicomMultiStudyUploader from '../model/DicomMultiStudyUploader'
class Uploader extends Component {

    state = {
        isFilesLoaded: false,
        isParsingFiles: false,
        isUnzipping: false,
        isUploadStarted: false,
        isPaused : false,
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
            endpoint: this.props.config.tusEndpoint, // use your tus endpoint here
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

        //if paused prevent upload to restart at adding of new files
        this.uppy.on('upload', () => {
            if(this.state.isPaused) {
                console.log('pause uppy')
                this.uppy.pauseAll()
            }
        })
        

    }

    componentDidMount = () => {
        this.loadAvailableVisits()
    }

    componentWillUnmount = () => {
        this.props.resetRedux()
        this.uppy.close()
    }

    loadAvailableVisits = () => {
        let availableVisits = this.props.config.availableVisits
        //Add All availables visits in visit reducer
        availableVisits.forEach(visit=> {
            this.props.addVisit(visit)
        })
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
            this.config.onStartUsing()
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
                console.error('error zip' + e)
            })
        }
    }

    /**
     * Check studies/series with warning and populate redux
     */
    checkSeriesAndUpdateRedux = async () => {
        this.setState({ isCheckDone: false })

        //Scan every study in Model
        let studyArray = this.uploadModel.getStudiesArray()
        for (let studyObject of studyArray) {

            //If unknown studyInstanceUID, add it to Redux
            if ( ! Object.keys(this.props.studies).includes( studyObject.getStudyInstanceUID() )){
                await this.registerStudyInRedux(studyObject)
            }

            //Scan every series in Model
            let series = studyObject.getSeriesArray()

            for (let seriesObject of series) {

                if ( ! Object.keys(this.props.series).includes( seriesObject.getSeriesInstanceUID() )){
                    await this.registerSeriesInRedux(seriesObject)
                }
                
            }
        }

        //Mark check finished to make interface available and select the first study item
        this.setState({ isCheckDone: true })
        //If no study being selected, select the first one
        if( this.props.selectedStudy===undefined && Object.keys(this.props.studies).length >= 1) this.props.selectStudy( this.props.studies[Object.keys(this.props.studies)[0]].studyInstanceUID )
    }

    /**
     * Register a study of the dicom model to the redux
     * @param {Study} studyToAdd 
     */
    registerStudyInRedux = async (studyToAdd) => {
        this.props.addStudy(
            studyToAdd.getStudyInstanceUID(), 
            studyToAdd.getPatientFirstName(), 
            studyToAdd.getPatientLastName(), 
            studyToAdd.getPatientSex(), 
            studyToAdd.getPatientID(), 
            studyToAdd.getAcquisitionDate(), 
            studyToAdd.getAccessionNumber(),
            studyToAdd.getPatientBirthDate(), 
            studyToAdd.getStudyDescription(),
            studyToAdd.getOrthancStudyID(),
            studyToAdd.getChildModalitiesArray()
        )
        
        const studyInstanceUID = studyToAdd.getStudyInstanceUID()

        //Search for a perfect Match in visit candidates and assign it
        let perfectMatchVisit = this.searchPerfectMatchStudy(studyInstanceUID)
        if (perfectMatchVisit != null) {
            this.props.setVisitID(studyInstanceUID, perfectMatchVisit.visitID)
        }
        //Add study warnings to Redux
        let studyRedux = this.props.studies[studyInstanceUID]
        let studyWarnings = await this.getStudyWarning(studyRedux)

        //If no warning mark it as ready, if not add warning to redux
        if( studyWarnings.length === 0 ) this.props.addStudyReady(studyInstanceUID)
        else {
            studyWarnings.forEach( (warning)=> {
                this.props.addWarningsStudy(studyInstanceUID, warning)
            })
            
        }
    }

    registerSeriesInRedux = async (seriesObject) => {

        let seriesWarnings = await seriesObject.getWarnings()
        //Add series to redux
        this.props.addSeries(
            seriesObject.getInstancesObject(),
            seriesObject.getSeriesInstanceUID(),
            seriesObject.getSeriesNumber(),
            seriesObject.getSeriesDate(),
            seriesObject.getSeriesDescription(),
            seriesObject.getModality(),
            seriesObject.getStudyInstanceUID(),
            seriesObject.getPatientWeight(),
            seriesObject.getPatientSize()
        )

        //Automatically add to Redux seriesReady if contains no warnings
        if(  Util.isEmptyObject( seriesWarnings ) ){
            this.props.addSeriesReady( seriesObject.getSeriesInstanceUID() )
        }else{
            //Add series related warnings to Redux
            this.props.addWarningsSeries(seriesObject.getSeriesInstanceUID(), seriesWarnings )
        }

    }

    /**
     * Generate warnings for a given study
     * @param {*} study 
     */
    getStudyWarning = async (studyRedux) => {
        let warnings = []

        //if Visit ID is not set add Null Visit ID (visitID Needs to be assigned)
        if ( studyRedux.visitID == null ) warnings.push(NULL_VISIT_ID)

        // Check if study is already known by server
        let newStudy = await this.props.config.isNewStudy( studyRedux.orthancStudyID )
        if (!newStudy) warnings.push(ALREADY_KNOWN_STUDY)


        return warnings
    }

    /**
     * Search a perfect match visit for a registered studyInstanceUID in redux
     * @param {string} studyInstanceUID 
     */
    searchPerfectMatchStudy = (studyInstanceUID) => {
        let studyRedux = this.props.studies[studyInstanceUID]
        // Linear search through expected visits list
        for (let visitObject of Object.values(this.props.visits) ) {
            if ( this.isPerfectMatch(studyRedux, visitObject) ) {
                return visitObject;
            }
        }

        return undefined;
    }

    getVisitDataById = (visitID) => {
        for (let visit of this.props.visits) {
            if ( visit.visitID === visitID ) {
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
        let modalities = studyRedux.seriesModalitiesArray

        if (Util.areEqualFields(visitObject.patientFirstname.trim().charAt(0), patientFirstname.trim().charAt(0))
        && Util.areEqualFields(visitObject.patientLastname.trim().charAt(0), patientLastname.trim().charAt(0))
        && Util.areEqualFields(visitObject.patientSex.trim().charAt(0), sex.trim().charAt(0))
        && Util.isProbablyEqualDates(visitObject.patientDOB, Util.formatRawDate(birthDate))
        && Util.isProbablyEqualDates(visitObject.visitDate, Util.formatRawDate(acquisitionDate))
        && modalities.includes(visitObject.visitModality) ) {
            return true
        } else return false
    }
    /**
     * Upload selected and validated series on click
     */
    onUploadClick = () => {

        //build array of series object to be uploaded
        let seriesObjectArrays = this.props.seriesReady.map((seriesUID) => {
            return this.props.series[seriesUID]
        })

        //get unique StudyUID in series arrays
        let studyUIDArray = seriesObjectArrays.map((seriesObject) => {
            return seriesObject.studyInstanceUID
        })
        studyUIDArray = [...new Set(studyUIDArray)]

        //Filter non selected studyUID
        studyUIDArray = studyUIDArray.filter(studyUID => (this.props.studiesReady.includes(studyUID)))

        if (studyUIDArray.length === 0) {
            toast.error('No Selected Series to Upload')
            return
        }

        let uploader = new DicomMultiStudyUploader(this.uppy)

        //group series by studyUID
        for (let studyInstanceUID of studyUIDArray) {

            let visitID = this.props.studies[studyInstanceUID].visitID

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

            //SK A FAIRE VENIR ICI LES INFO D EDITION DU REDUX
            let editedTags = {
                'patientWeight' : 50,
                'patientSize' : 1.5,
                'seriesDescription' :'new series description'
            }

            uploader.addStudyToUpload(visitID, filesToUpload, studyOrthancID, editedTags)

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

        uploader.on('study-upload-finished', (visitID, numberOfFiles, sucessIDsUploaded, studyOrthancID) => {
            console.log('study upload Finished')
            this.config.onStudyUploaded( visitID, sucessIDsUploaded, numberOfFiles, studyOrthancID)

        })


        uploader.on('upload-finished', () => {
            console.log('full upload Finished')
            this.config.onUploadComplete()
        })

        uploader.startUpload()
        this.setState({ isUploadStarted: true })
    }

    onPauseUploadClick = (pause) =>{

        if(pause){
            this.uppy.pauseAll()
        }else{
            this.uppy.resumeAll()
        }

        this.setState( { isPaused: pause })
    }

    render = () => {
        if(this.config.availableVisits.length ===0) return <Alert variant='success'>  No Visits Awaiting Upload </Alert>
        return (
            <Fragment>
                <div>
                    <DicomDropZone
                        addFile={this.addFile}
                        isUnzipping={this.state.isUnzipping}
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
                    <Options />
                </div>
                <div hidden={!this.state.isFilesLoaded}>
                    <ControllerStudiesSeries
                        isCheckDone={this.state.isCheckDone}
                        isUploadStarted={this.state.isUploadStarted}
                        multiUpload={this.config.availableVisits.length > 1}
                        selectedSeries={this.props.selectedSeries} />
                    <ProgressUpload
                        disabled={ this.state.isUploadStarted || Object.keys(this.props.studiesReady).length === 0 }
                        isUploadStarted = {this.state.isUploadStarted}
                        isPaused = {this.state.isPaused}
                        multiUpload={this.config.availableVisits.length > 1}
                        studyProgress={this.state.studyProgress}
                        studyLength={this.state.studyLength}
                        onUploadClick={this.onUploadClick}
                        onPauseClick = {this.onPauseUploadClick}
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
        selectedStudy: state.DisplayTables.selectStudy,
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
    resetRedux
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)