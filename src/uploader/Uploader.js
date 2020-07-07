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

export default class Uploader extends Component {

    state = {
        fileIgnored: 0,
        fileParsed: 0,
        fileLoaded: 0,
        showIgnoredFiles: false,
        ignoredFiles: {},
        showWarning: false,
        zipProgress: 0,
        uploadProgress: 0,
    }

    constructor(props) {

        super(props)

        this.uploadModel = new Model();

        this.toogleShowIgnoreFile = this.toogleShowIgnoreFile.bind(this)
        this.onHideWarning = this.onHideWarning.bind(this)
        this.onUploadClick = this.onUploadClick.bind(this)
        this.onUploadDone = this.onUploadDone.bind(this)
        this.ignoredFiles = {}
        this.controlerStudiesSeriesRefs = React.createRef();

        this.uppy = Uppy({
            id: 'uppy',
            autoProceed: false,
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

        this.uppy.on('complete', (result) => {
            console.log(result)
        })

        this.uppy.on('upload-error', (file, error, response) => {
            console.log('error with file:', file.id)
            console.log('error message:', error)
        })

        this.uppy.on('upload-progress', (file, progress) => {
            // file: { id, name, type, ... }
            // progress: { uploader, bytesUploaded, bytesTotal }
            console.log(file.id, progress.bytesUploaded, progress.bytesTotal)
        })
    }

    async componentDidMount() {
        await logIn()
        await registerStudy()
        let answer = await getAets()
        console.log(answer)
    }

    addFile(files) {
        this.setState((previousState) => { return { fileLoaded: (previousState.fileLoaded+files.length) } })
        console.log('Added file', files)
        files.forEach(file => {
            this.read(file)
        })

        //console.log(this.uploadModel)
    }

    /**
	 * Read and parse dicom file
	 */
    async read(file) {
        try {
            let dicomFile = new DicomFile(file);
            await dicomFile.readDicomFile()

            let study;
            let series;

            let dicomStudyID = dicomFile.getStudyInstanceUID()
            let dicomSeriesID = dicomFile.getSeriesInstanceUID()
            let dicomInstanceID = dicomFile.getSOPInstanceUID()

            study = new Study(dicomStudyID, dicomFile.getStudyID(), dicomFile.getStudyDate(), dicomFile.getStudyDescription(),
                    dicomFile.getAccessionNumber(), dicomFile.getPatientID(), dicomFile.getPatientFirstName(), dicomFile.getPatientLastName(),
                    dicomFile.getPatientBirthDate(), dicomFile.getPatientSex(), dicomFile.getAcquisitionDate());
            study = this.uploadModel.addStudy(study, dicomStudyID);
            series = new Series(dicomSeriesID, dicomFile.getSeriesNumber(), dicomFile.getSeriesDate(),
                    dicomFile.getSeriesDescription(), dicomFile.getModality());
            series = study.addSeries(series, dicomSeriesID);
            series.addInstance(new Instance(dicomInstanceID, file, dicomFile), dicomInstanceID);
            
            this.setState((previousState) => { return { fileParsed: previousState.fileParsed++ } })

        } catch (error) {
            console.warn(error)
            //Save only message of error
            if (typeof error == 'object') {
                error = error.message
            }
            this.setState(state => {
                //SK ICI BUG IGNORE FILE A UN SEUL ITEM
                return {
                    fileIgnored: state.fileIgnored++,
                    ignoredFiles: {
                        ...state.ignoredFiles,
                        [file.name]: error
                    }
                }
            })
        }

        //Check series
        for (let studies in this.uploadModel.getStudiesArray()) {
            let study = this.uploadModel.getStudiesArray()[studies].getSeriesArray()
            for (let series in study) {
                let dicomFile
                let instances = study[series].getArrayInstances()
                for (let instance in instances) {
                    dicomFile = instances[instance].getDicomFile()
                }   
                study[series].checkSeries(dicomFile)
            }
            
        }

    }

    /*Trigger ignored files panel if clicked*/
    toogleShowIgnoreFile() {
        this.setState(((state) => { return { showIgnoredFiles: !state.showIgnoredFiles } }))
    }

    /*Trigger hide warning if closed*/
    onHideWarning() {
        console.log(this.state.onHideWarning)
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
            console.log(uploader.getProgess())
            this.setState({
                ...uploader.getProgess()
            })
        } , 200)
        
            
        uploader.startUpload()

    }

    onUploadDone(){
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
                        <ParsingDetails fileLoaded={this.state.fileLoaded} fileParsed={this.state.fileParsed} fileIgnored={this.state.fileIgnored} onClick={this.toogleShowIgnoreFile} />
                        <IgnoredFilesPanel display={this.state.showIgnoredFiles} closeListener={this.toogleShowIgnoreFile} dataIgnoredFiles={this.state.ignoredFiles} />
                        <WarningPatient show={this.state.showWarning} closeListener={this.onHideWarning} />
                        <ControllerStudiesSeries ref={this.controlerStudiesSeriesRefs} uploadModel={this.uploadModel} />
                        <ProgressUpload onUploadClick={this.onUploadClick} zipPercent={this.state.zipProgress} uploadPercent={this.state.uploadProgress} />
                    </Card.Body>
                </Card>
            </Fragment>
        )
    }
}