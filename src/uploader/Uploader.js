import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

import Model from '../model/Model'
import DicomFile from '../model/DicomFile'
import DicomBatchUploader from '../model/DicomBatchUploader'

import DicomDropZone from './render_component/DicomDropZone'

import ParsingDetails from './render_component/ParsingDetails'
import ControllerStudiesSeries from './ControllerStudiesSeries'
import ProgressUpload from './render_component/ProgressUpload'
import WarningPatient from './render_component/WarningPatient'

import { getAets, logIn, registerStudy } from '../services/api'

import { addSeries, addStudy } from './actions/StudiesSeries'
import Button from 'react-bootstrap/Button'

class Uploader extends Component {

    state = {
        multiUpload: false,
        isFilesLoaded: false,
        isParsingFiles: false,
        isUploadStarted : false,
        fileParsed: 0,
        fileLoaded: 0,
        zipProgress: 0,
        uploadProgress: 0,
        ignoredFiles: {},
        showWarning: false,
        seriesValidated: {}
    }

    constructor(props) {

        super(props)
        this.uploadModel = new Model();
        this.addFile = this.addFile.bind(this)
        this.onHideWarning = this.onHideWarning.bind(this)
        this.onUploadClick = this.onUploadClick.bind(this)
        this.onUploadDone = this.onUploadDone.bind(this)
        this.triggerMultiUpload = this.triggerMultiUpload.bind(this)
        this.seriesValidated = this.seriesValidated.bind(this)

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
        await logIn()
        await registerStudy()
        let answer = await getAets()
        console.log(answer)
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
                isParsingFiles : true 
            }
        })

        //Build promise array for all files reading
        let readPromises = files.map((file) => {
            return this.read(file)
        })

        //Once all promised resolved update state and refresh redux with parsing results
        Promise.all(readPromises).then(() => {
            this.setState({ isFilesLoaded : true, isParsingFiles : false })
            this.checkSeriesAndUpdateRedux()
        })
        
    }

    /**
	 * Read and parse a single dicom file
	 */
    async read(file) {
        try {
            let dicomFile = new DicomFile(file)
            await dicomFile.readDicomFile()

            //if Secondary capture or DicomDir do no register file
            if( dicomFile.isDicomDir() ){
                throw Error('Dicomdir file')
            }
            if( dicomFile.isSecondaryCaptureImg() ){
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

            series.addInstance( dicomFile.getInstanceObject() )

            this.setState( (previousState) => { 
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

        //ICI A VOIR DIFFEREMENT IL FAUT QUE LE CONTROLEUR INJECTE SEPARAMENT 
        //LES NOUVELLES STUDIES + WARNING SI PATIENT NE MATCH PAS PATIENT ATTENDU
        // LES NOUVELLES SERIES + LES WARNING
        console.log(this.uploadModel.data)
        this.props.addStudy(this.uploadModel.data)
        for (let study in this.uploadModel.data) {
            for (let series in this.uploadModel.data[study].series) {
                this.props.addSeries(this.uploadModel.data[study].series[series])
            }
        }
    }

    /**
     * 
     */
    triggerMultiUpload() {
        this.setState((state) => ({multiUpload: !state.multiUpload}))
    }

    /**
     * Trigger hide warning if closed
     */
    onHideWarning() {
        this.setState((state) => { return { showWarning: !state.showWarning } });
    }

    //SK ICI devrait etre envoyé directement depuis le controlleur studies/series vers le redux
    seriesValidated = (series) => {
        this.setState(() => { return { seriesValidated: { ...series } } })
    }

    /**
     * Upload selected and validated series on click
     */
    async onUploadClick(e) {
        let instancesToUpload = []

        //Gather all instances to upload
        for (let studyInstanceUID in this.state.seriesValidated) {
            for (let seriesInstanceUID in this.state.seriesValidated[studyInstanceUID]) {
                seriesInstanceUID = this.state.seriesValidated[studyInstanceUID][seriesInstanceUID]
                let mySeries = this.uploadModel.getStudy(studyInstanceUID).getSeries(seriesInstanceUID)
                instancesToUpload.push(...mySeries.getArrayInstances())
            }
        }

        let fileArray = instancesToUpload.map(instance => {
            return instance.getFile()
        })

        let uploader = new DicomBatchUploader(this.uppy, 42 /*DOIT ETRE UN VARIABLE */, fileArray, this.onUploadDone)
        this.intervalProgress = setInterval(() => {
            console.log(uploader.getProgress())
            this.setState({
                ...uploader.getProgress()
            })
        }, 200)


        uploader.startUpload()
        this.setState({isUploadStarted : true})

    }

    onUploadDone() {
        clearInterval(this.intervalProgress)
        console.log("upload Finished")
    }

    render() {
        return (
            <Fragment>
                    <div>
                        <Button className="btn btn-dark" onClick={this.triggerMultiUpload}>{this.state.multiUpload ? 'Exit Uploader' : 'Multi Uploader'}</Button>
                        <DicomDropZone 
                            addFile={this.addFile} 
                            isParsingFiles={this.state.isParsingFiles}
                            isUploadStarted = {this.state.isUploadStarted}
                            fileParsed = {this.state.fileParsed}
                            fileIgnored = {Object.keys(this.state.ignoredFiles).length}
                            fileLoaded = {this.state.fileLoaded}
                        />
                    </div>
                    <div className="mb-3" hidden={!this.state.isParsingFiles && !this.state.isFilesLoaded}>
                        <ParsingDetails 
                            fileLoaded={this.state.fileLoaded} 
                            fileParsed={this.state.fileParsed} 
                            dataIgnoredFiles = {this.state.ignoredFiles} 
                        />
                    </div>
                    <div hidden={!this.state.isFilesLoaded}>
                        <WarningPatient show={this.state.showWarning} closeListener={this.onHideWarning} />
                        <ControllerStudiesSeries multiUploader={this.state.multiUpload} selectedSeries={this.props.selectedSeries} seriesValidated={this.seriesValidated} />
                        <ProgressUpload multiUpload={false} studyProgress={3} studyLength={6} onUploadClick={this.onUploadClick} zipPercent={this.state.zipProgress} uploadPercent={this.state.uploadProgress} />
                    </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        studies: state.Studies.studies,
        series: state.Series.series,
        selectedSeries: state.DisplayTables.selectedSeries,
    }
}
const mapDispatchToProps = {
    addStudy,
    addSeries,
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)