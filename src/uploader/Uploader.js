import React, { Component, Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import Dropzone from 'react-dropzone'
import DicomFile from '../model/DicomFile'
import Model from '../model/Model'
import Study from '../model/Study'
import Series from '../model/Series'
import Instance from '../model/Instance'
import ParsingDetails from './render_component/ParsingDetails'
import ControllerStudiesSeries from './ControllerStudiesSeries'
import ProgressUpload from './render_component/ProgressUpload'
import IgnoredFilesPanel from './render_component/IgnoredFilesPanel'
import WarningPatient from './render_component/WarningPatient'
import { getAets, logIn, registerStudy } from '../services/api'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import DicomBatchUploader from '../model/DicomBatchUploader'

import { connect } from 'react-redux';
import { addStudy, addSeries, addWarningSeries } from './actions/StudiesSeries'

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
    }

    constructor(props) {

        super(props)

        this.uploadModel = new Model();

        this.toggleShowIgnoreFile = this.toggleShowIgnoreFile.bind(this)
        this.onHideWarning = this.onHideWarning.bind(this)
        this.onUploadClick = this.onUploadClick.bind(this)
        this.onUploadDone = this.onUploadDone.bind(this)
        this.ignoredFiles = {}

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
        let readPromises = files.map( (file) => {
            return this.read(file)
        })
        Promise.all(readPromises).then(()=>{
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

            let study
            let series

            let dicomStudyID = dicomFile.getStudyInstanceUID()
            let dicomSeriesID = dicomFile.getSeriesInstanceUID()
            let dicomInstanceID = dicomFile.getSOPInstanceUID()

            study = this.uploadModel.addStudy(dicomFile.getStudyObject(), dicomStudyID)
            series = study.addSeries(dicomFile.getSeriesObject(), dicomSeriesID)
            series.addInstance(new Instance(dicomInstanceID, file), dicomInstanceID);

            this.setState((previousState) => { return { fileParsed: ++previousState.fileParsed } })

        } catch (error) {
            console.warn(error)
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

    async checkSeriesAndSendData(){
        //Check series to send warning
        //SK ICI A AMELIORER NE TESTER QUE LES NOUVELLE SERIES DEPUIS LE PARSE
        let studies = this.uploadModel.getStudiesArray()
        for( let study of studies){
            let series = study.getSeriesArray()
            for(let serieInstance of series){
                //SK DICOMFILE et INSTANCE A REVOIR
                let firstInstance = serieInstance.getArrayInstances()[0]
                await serieInstance.checkSeries(new DicomFile(firstInstance.SOPInstanceUID,firstInstance.getFile()))

            }
        }
        
        //ICI A VOIR DIFFEREMENT IL FAUT QUE LE CONTROLEUR INJECTE SEPARAMENT 
        //LES NOUVELLES STUDIES + WARNING SI PATIENT NE MATCH PAS PATIENT ATTENDU
        // LES NOUVELLES SERIES + LES WARNING
        this.props.addStudy(this.uploadModel.data)
        for(let study in this.uploadModel.data){
            for (let series in this.uploadModel.data[study].series) {
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

    async onUploadClick(e) {

        let studyID = '1.2.276.0.7230010.3.1.2.2831156016.1.1587396216.293569'
        let studyIDSalim = '1.2.840.113619.2.55.3.2831168002.786.1486404132.304'
        let seriesIDSalim = '1.2.840.113619.2.55.3.2831168002.786.1486404132.610'
        let serieID = '1.2.276.0.7230010.3.1.3.2831156016.1.1587396221.293907'
        let series = this.uploadModel.getStudy(studyIDSalim).getSeries(seriesIDSalim)
        let instances = series.getArrayInstances()

        
        let fileArray = instances.map(instance => {
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
                        <ControllerStudiesSeries selectedSeries={this.props.selectedSeries} seriesReadyToUpload={this.props.seriesReadyToUpload}/>
                        <ProgressUpload onUploadClick={this.onUploadClick} zipPercent={this.state.zipProgress} uploadPercent={this.state.uploadProgress} />
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
        selectedSeries: state.DisplayTables.selectedSeries
    }
}
const mapDispatchToProps = {
    addStudy,
    addSeries,
    addWarningSeries
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)