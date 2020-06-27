import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Card from 'react-bootstrap/Card'
import { StatusBar, DragDrop } from '@uppy/react'
import Uppy from '@uppy/core'
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
        showWarning: true,
        zipPercent: 50,
        uploadPercent: 30
    }

    constructor(props) {

        super(props)
        this.uppy = Uppy({
            autoProceed: false,
            allowMultipleUploads: true,
        })

        this.uppy.on('upload-success', async (file, response) => {
            if (response.body.ID !== undefined) {
                await this.addUploadedFileToState(response.body)
            }
        })

        this.uppy.on('upload-error', (file, error, response) => {
            this.uppy.removeFile(file.id)
            let info = JSON.parse(response.body.error)
            this.addErrorToState(file.id, file.name, info.Details)
        })
        this.uppy.on('upload', () => this.setState({ inProgress: true }))
        this.uppy.on('complete', () => this.setState({ inProgress: false }))
        this.uppy.on('cancel-all', () => this.setState({ inProgress: false }))

        this.uppy.on('file-added', (file) => {
            this.setState((previousState) => { return { fileLoaded: previousState.fileLoaded++ } })
            console.log('Added file', file)
            this.read(file)
            console.log(this.uploadModel)
        })

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

    /**
	 * Read and parse dicom file
	 */
    read(file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file.data);
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

                console.log(dicomFile)
                let dicomStudyID = dicomFile.getStudyInstanceUID()
                let dicomSeriesID = dicomFile.getSeriesInstanceUID()
                let dicomInstanceID = dicomFile.getSOPInstanceUID()

                if (!this.uploadModel.isExistingStudy(dicomFile.getStudyInstanceUID())) {
                    study = new Study(dicomFile.getStudyInstanceUID(), dicomFile.getStudyID(), dicomFile.getStudyDate(), dicomFile.getStudyDescription(),
                        dicomFile.getAccessionNumber(), dicomFile.getPatientID(), dicomFile.getPatientFirstName(), dicomFile.getPatientLastName(),
                        dicomFile.getPatientBirthDate(), dicomFile.getPatientSex(), dicomFile.getAcquisitionDate());
                    this.uploadModel.addStudy(study);
                } else {
                    study = this.uploadModel.getStudy(dicomFile.getStudyInstanceUID())
                }

                if (!study.isExistingSeries(dicomFile.getSeriesInstanceUID())) {
                    series = new Series(dicomFile.getSeriesInstanceUID(), dicomFile.getSeriesNumber(), dicomFile.getSeriesDate(),
                        dicomFile.getSeriesDescription(), dicomFile.getModality());
                    study.addSeries(series);
                } else {
                    series = study.getSeries(dicomFile.getSeriesInstanceUID())
                }

                if (!series.isExistingInstance(dicomFile.getSOPInstanceUID())) {
                    series.addInstance(new Instance(dicomFile.getSOPInstanceUID(), dicomFile.getInstanceNumber(), dicomFile, file));
                    this.setState((previousState) => { return { fileParsed: previousState.fileParsed++ } })
                } else {
                    this.setState((previousState) => { return { fileIgnored: previousState.fileIgnored++ } })
                    throw ("Existing instance")
                }
            } catch (e) {
                console.warn(e)
                this.setState(state => {
                    return { fileIgnored: state.fileIgnored++ }
                })
                this.ignoredFiles[file.name] = e;
            }
        }
    }

    /*Trigger ignored files panel if clicked*/
    toogleShowIgnoreFile () {
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
            <Jumbotron className="jumbotron">
                <Card className="col mb-5">
                    <Card.Title className="card-title">Import Dicom Files</Card.Title>
                    <Card.Body>
                        <DragDrop
                            uppy={this.uppy}
                            locale={{
                                strings: {
                                    dropHereOr: 'Drop Dicom Folder',
                                    browse: 'browse'
                                }
                            }}
                        />
                        <ParsingDetails fileLoaded={this.state.fileLoaded} fileParsed={this.state.fileParsed} fileIgnored={this.state.fileIgnored} onClick={this.toogleShowIgnoreFile} />
                        <IgnoredFilesPanel display={this.state.showIgnoredFiles} closeListener={this.toogleShowIgnoreFile} dataIgnoredFiles={this.ignoredFiles} />
                        <WarningPatient show={this.state.showWarning} closeListener={this.onHideWarning} />
                        <ControllerStudiesSeries studies={this.uploadModel} />
                        <ProgressUpload onUploadClick={this.onUploadClick} zipPercent={this.state.zipPercent} uploadPercent={this.state.uploadPercent} />
                    </Card.Body>
                </Card>
            </Jumbotron>

        )
    }
}