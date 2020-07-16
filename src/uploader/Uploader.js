import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import Card from 'react-bootstrap/Card'
import Dropzone from 'react-dropzone'
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

import Model from '../model/Model'
import DicomFile from '../model/DicomFile'
import DicomBatchUploader from '../model/DicomBatchUploader'

import ParsingDetails from './render_component/ParsingDetails'
import ControllerStudiesSeries from './ControllerStudiesSeries'
import ProgressUpload from './render_component/ProgressUpload'
import IgnoredFilesPanel from './render_component/IgnoredFilesPanel'
import WarningPatient from './render_component/WarningPatient'

import { getAets, logIn, registerStudy } from '../services/api'

import { addSeries, addStudy } from './actions/StudiesSeries'

class Uploader extends Component {

    state = {
        fileIgnored: 0,
        fileParsed: 0,
        fileLoaded: 0,
        parseFinished: false,
        showIgnoredFiles: false,
        ignoredFiles: {},
        showWarning: false,
        zipProgress: 0,
        uploadProgress: 0,
        seriesValidated: {}
    }

    constructor(props) {

        super(props)
        this.uploadModel = new Model();

        this.toggleShowIgnoreFile = this.toggleShowIgnoreFile.bind(this)
        this.onHideWarning = this.onHideWarning.bind(this)
        this.onUploadClick = this.onUploadClick.bind(this)
        this.onUploadDone = this.onUploadDone.bind(this)
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

    addFile(files) {
        this.setState((previousState) => { return { fileLoaded: (previousState.fileLoaded + files.length) } })
        console.log('Added file', files)
        let readPromises = files.map((file) => {
            return this.read(file)
        })
        Promise.all(readPromises).then(() => {
            this.checkSeriesAndSendData()
        })

    }

    /**
	 * Read and parse dicom file
	 */
    async read(file) {
        try {
            let dicomFile = new DicomFile(file);
            await dicomFile.readDicomFile()

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

            this.setState((previousState) => { return { fileParsed: ++previousState.fileParsed } })

        } catch (error) {
            //Save only message of error
            let errorMessage = error
            if (typeof error === 'object') {
                errorMessage = error.message
            }
            this.setState(state => {
                return {
                    fileIgnored: ++state.fileIgnored,
                    ignoredFiles: {
                        ...state.ignoredFiles,
                        [file.name]: errorMessage
                    }
                }
            })
        }

    }

    async checkSeriesAndSendData() {
        //Check series to send warning
        //SK ICI A AMELIORER NE TESTER QUE LES NOUVELLE SERIES DEPUIS LE PARSE
        let studies = this.uploadModel.getStudiesArray()
        for (let study of studies) {
            let series = study.getSeriesArray()
            for (let serieInstance of series) {
                //SK DICOMFILE et INSTANCE A REVOIR
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

    /*Trigger ignored files panel if clicked*/
    toggleShowIgnoreFile() {
        this.setState(((state) => { return { showIgnoredFiles: !state.showIgnoredFiles } }))
    }

    /*Trigger hide warning if closed*/
    onHideWarning() {
        this.setState((state) => { return { showWarning: !state.showWarning } });
    }

    seriesValidated = (series) => {
        this.setState(() => { return { seriesValidated: { ...series } } })
    }

    async onUploadClick(e) {

        /*let studyID = '1.2.276.0.7230010.3.1.2.2831156016.1.1587396216.293569'
        let studyIDSalim = '1.2.840.113619.2.55.3.2831168002.786.1486404132.304'
        let seriesIDSalim = '1.2.840.113619.2.55.3.2831168002.786.1486404132.610'
        let seriesID = '1.2.276.0.7230010.3.1.3.2831156016.1.1587396221.293907'
        let series = this.uploadModel.getStudy(studyID).getSeries(seriesID)
        let instances = series.getArrayInstances()*/
        let instancesToUpload = []

        //Gather all instances to upload
        for (let studyID in this.state.seriesValidated) {
            for (let seriesID in this.state.seriesValidated[studyID]) {
                    seriesID = this.state.seriesValidated[studyID][seriesID]
                    let mySeries = this.uploadModel.getStudy(studyID).getSeries(seriesID)
                    instancesToUpload.push(...mySeries.getArrayInstances())
            }
        }

        let fileArray = instancesToUpload.map(instance => {
            return instance.getFile()
        })

        let uploader = new DicomBatchUploader(this.uppy, fileArray, this.onUploadDone)
        this.intervalProgress = setInterval(() => {
            console.log(uploader.getProgress())
            this.setState({
                ...uploader.getProgress()
            })
        }, 200)


        uploader.startUpload()

    }

    onUploadDone() {
        clearInterval(this.intervalProgress)
        console.log("upload Finished")
    }

    render() {
        return (
            <Fragment>
                <Card className="col mb-5">
                    <Card.Body>
                        <Dropzone onDrop={acceptedFiles => this.addFile(acceptedFiles)} >
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div className="dropzone" {...getRootProps()}>
                                        <input directory="" webkitdirectory="" {...getInputProps()} />
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                        <ParsingDetails fileLoaded={this.state.fileLoaded} fileParsed={this.state.fileParsed} fileIgnored={this.state.fileIgnored} onClick={this.toggleShowIgnoreFile} />
                        <IgnoredFilesPanel display={this.state.showIgnoredFiles} closeListener={this.toggleShowIgnoreFile} dataIgnoredFiles={this.state.ignoredFiles} />
                        <WarningPatient show={this.state.showWarning} closeListener={this.onHideWarning} />
                        <ControllerStudiesSeries selectedSeries={this.props.selectedSeries} seriesValidated={this.seriesValidated} />
                        <ProgressUpload multiUpload={false} studyProgress = {3} studyLength={6} onUploadClick={this.onUploadClick} zipPercent={this.state.zipProgress} uploadPercent={this.state.uploadProgress} />
                    </Card.Body>
                </Card>
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