import React, { Component, Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import Dropzone from 'react-dropzone'
import dicomParser from 'dicom-parser'
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
import JSZip from "jszip";

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

export default class Uploader extends Component {

    state = {
        fileIgnored: 0,
        fileParsed: 0,
        fileLoaded: 0,
        showIgnoredFiles: false,
        ignoredFiles: {},
        showWarning: false,
        zipPercent: 50,
        uploadPercent: 30,
    }

    constructor(props) {

        super(props)

        this.uploadModel = new Model();

        this.toogleShowIgnoreFile = this.toogleShowIgnoreFile.bind(this)
        this.onHideWarning = this.onHideWarning.bind(this)
        this.onUploadClick = this.onUploadClick.bind(this)
        this.ignoredFiles = {}
        this.controlerStudiesSeriesRefs = React.createRef();

        this.uppy = Uppy({  
            id: 'uppy', 
            autoProceed: false,
            allowMultipleUploads: true,
            debug: true
        })


        this.uppy.use(Tus, {
            endpoint: 'http://localhost:3000/scripts/tus_upload.php', // use your tus endpoint here
            resume: true,
            autoRetry: true,
            chunkSize: 2000000,
            limit: 3,
            headers:{
                Location : 'http://localhost:3000/scripts/tus_upload.php'
            },
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
        this.setState((previousState) => { return { fileLoaded: previousState.fileLoaded++ } })
        console.log('Added file', files)
        files.forEach(file => {
            this.read(file)
        })

        //console.log(this.uploadModel)
    }

    /**
	 * Read and parse dicom file
	 */
    read(file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            // Retrieve file content as Uint8Array
            const arrayBuffer = reader.result;
            const byteArray = new Uint8Array(arrayBuffer);
            try {
                // Try to parse as dicom file
                //Will throw exception if not dicom file (exeption from dicomParser)
                let dataSet = dicomParser.parseDicom(byteArray)
                //But read data in a DicomFile Object
                let dicomFile = new DicomFile(file, dataSet);
                let study;
                let series;

                //console.log(dicomFile)
                let dicomStudyID = dicomFile.getStudyInstanceUID()
                let dicomSeriesID = dicomFile.getSeriesInstanceUID()
                let dicomInstanceID = dicomFile.getSOPInstanceUID()

                if (!this.uploadModel.isExistingStudy(dicomStudyID)) {
                    study = new Study(dicomStudyID, dicomFile.getStudyID(), dicomFile.getStudyDate(), dicomFile.getStudyDescription(),
                        dicomFile.getAccessionNumber(), dicomFile.getPatientID(), dicomFile.getPatientFirstName(), dicomFile.getPatientLastName(),
                        dicomFile.getPatientBirthDate(), dicomFile.getPatientSex(), dicomFile.getAcquisitionDate());
                    this.uploadModel.addStudy(study);
                } else {
                    study = this.uploadModel.getStudy(dicomStudyID)
                }

                if (!study.isExistingSeries(dicomSeriesID)) {
                    series = new Series(dicomSeriesID, dicomFile.getSeriesNumber(), dicomFile.getSeriesDate(),
                        dicomFile.getSeriesDescription(), dicomFile.getModality());
                    study.addSeries(series);
                } else {
                    series = study.getSeries(dicomSeriesID)
                }

                if (!series.isExistingInstance(dicomInstanceID)) {
                    series.addInstance(new Instance(dicomInstanceID, file));
                    this.setState((previousState) => { return { fileParsed: previousState.fileParsed++ } })
                } else {
                    //this.setState((previousState) => { return { fileIgnored: previousState.fileIgnored++ } })
                    throw ("Existing instance")
                }
                series.checkSeries(dicomFile)

            } catch (e) {
                console.warn(e)
                this.setState(state => {
                    //SK ICI BUG IGNORE FILE A UN SEUL ITEM
                    return {
                        fileIgnored: state.fileIgnored++,
                        ignoredFiles: {
                            ...state.ignoredFiles,
                            [file.name]: e
                        }
                    }
                })
            }
        }
        //console.log(this.uploadModel)
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
        console.log(this.controlerStudiesSeriesRefs)
        console.log(this.controlerStudiesSeriesRefs.current.getValidatedItems())
        console.log('upload clicked')
        let zipBlob = await this.prepareZip()
        console.log(zipBlob)
        this.uppy.addFile(
            {
            name: 'my-file.zip', // file name
            type: 'application/zip', // file type
            data: zipBlob// file blob
            }
        )

        this.uppy.upload()
    }


    /**
	 * Add the dicom files contained in the queued series of 'study'
	 * to a JSZip object
	 */
    async prepareZip() {
        console.log('Zipping files...');
        
        // Create a new jszip object with folders & dicom files
        let jszip = new JSZip();
        let studyID = '1.2.276.0.7230010.3.1.2.2831156016.1.1587396216.293569'
        let serieID = '1.2.276.0.7230010.3.1.3.2831156016.1.1587396221.293907'
        let series = this.uploadModel.getStudy(studyID).getSeries(serieID)
        let instances = series.getArrayInstances()
        for(let instance in instances){
            let dicomFile = new DicomFile(instances[instance].getFile())
            await dicomFile.readDicomFile()

            jszip.file(dicomFile.getFilePath(), dicomFile.byteArray);
            console.log(jszip)
        }

        let uintarray = await jszip.generateAsync(
            // Zipping options
            {
                type: "uint8array",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 3,
                    streamFiles: true
                }
            },
            // Callback on update
            (metadata) => {
                //this.v.zippingProgress[indexStudyToUpload] = metadata.percent;
            }
        )
        let zipBlob = new Blob([uintarray], { type: 'application/zip' });
        console.log(zipBlob)
        return zipBlob
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
                        <ProgressUpload onUploadClick={this.onUploadClick} zipPercent={this.state.zipPercent} uploadPercent={this.state.uploadPercent} />
                    </Card.Body>
                </Card>
            </Fragment>
        )
    }
}