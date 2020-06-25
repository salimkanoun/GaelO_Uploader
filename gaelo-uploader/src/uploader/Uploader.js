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
import ParsingDetails from './ParsingDetails'
import ControllerStudiesSeries from './ControllerStudiesSeries'
import ProgressUpload from './ProgressUpload'
import WarningPatient from './WarningPatient'

import { getAets, logIn, registerStudy } from '../services/api'

export default class Uploader extends Component {

    state = { fileIgnored: 0, fileParsed: 0, fileLoaded: 0, warning: true, show: false, showIgnoredFiles: false }

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

        this.ignoredClick = this.ignoredClick.bind(this)

        this.ignoredFiles = {

        }
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


                let dicomStudyID = dicomFile.getStudyInstanceUID()
                let dicomSeriesID = dicomFile.getSeriesInstanceUID()
                let dicomInstanceID = dicomFile.getSOPInstanceUID()

                if (!this.uploadModel.isExistingStudy(dicomFile.getStudyInstanceUID())) {
                    study = new Study(dicomFile.getStudyInstanceUID(), dicomFile.getStudyID(), dicomFile.getStudyDate(), dicomFile.getStudyDescription(),
                        dicomFile.getAccessionNumber(), dicomFile.getPatientID(), dicomFile.getPatientName(), dicomFile.getPatientBirthDate(),
                        dicomFile.getPatientSex(), dicomFile.getAcquisitionDate());
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
                this.ignoredFiles[file.name] = e;
            }

        }

    }

    ignoredClick(event) {
        this.setState(((state) => { return { showIgnoredFiles: !state.showIgnoredFiles } }))
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
                        <StatusBar Button={true} showProgressDetails={true} hideRetryButton={false} hideAfterFinish={false} uppy={this.uppy} />
                        <ParsingDetails fileLoaded={this.state.fileLoaded} fileParsed={this.state.fileParsed} fileIgnored={this.state.fileIgnored} onClick={this.ignoredClick}
                            displayIgnoredFiles={this.state.showIgnoredFiles} closeIgnoredFiles={this.ignoredClick} dataIgnoredFiles={this.ignoredFiles} />
                        <WarningPatient show={this.state.warning} />
                        <ControllerStudiesSeries studies={this.uploadModel} />
                    </Card.Body>
                </Card>
            </Jumbotron>

        )
    }
}