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

export default class Uploader extends Component {

    state = {
        fileIgnored: 0,
        fileParsed: 0,
        fileLoaded: 0,
        showIgnoredFiles: false,
        ignoredFiles: {},
        showWarning: false,
        zipPercent: 50,
        uploadPercent: 30
    }

    constructor(props) {

        super(props)

        this.uploadModel = new Model();

        this.toogleShowIgnoreFile = this.toogleShowIgnoreFile.bind(this)
        this.onHideWarning = this.onHideWarning.bind(this)
        this.onUploadClick = this.onUploadClick.bind(this)

        this.ignoredFiles = {}
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
                    series.addInstance(new Instance(dicomInstanceID, dicomFile.getInstanceNumber(), dicomFile, file));
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

    onUploadClick(e) {
        console.log('upload clicked')

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
                        <ControllerStudiesSeries uploadModel={this.uploadModel} />
                        <ProgressUpload onUploadClick={this.onUploadClick} zipPercent={this.state.zipPercent} uploadPercent={this.state.uploadPercent} />
                    </Card.Body>
                </Card>
            </Fragment>
        )
    }
}