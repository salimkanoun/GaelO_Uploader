import React, { Component } from 'react'
import { StatusBar,DragDrop } from '@uppy/react'
import Uppy from '@uppy/core'
import dicomParser from 'dicom-parser'
import DicomFile from './DicomFile'
import Patient from './Patient'
import Serie from './Serie'
import Study from './Study'

export default class Uploader extends Component{

    /*Récupérer les infos dans un fichier et les trier dans un modèle
    Description dicom (path + infos noms etc) et explorer profil de mémoire (plus de réf de dicomParser, uniquement les objets)*/

    /**
	 * Read and parse dicom file
	 */
	read(file) {
        const reader = new FileReader();
        console.log(reader)
		reader.readAsArrayBuffer(file.data);
		reader.onload = () => {
			// Retrieve file content as Uint8Array
			const arrayBuffer = reader.result;
			const byteArray = new Uint8Array(arrayBuffer);
			try {
				// Try to parse as dicom file
				//Will throw exception if not dicom file (exeption from dicomParser)
				let parsedDicom = dicomParser.parseDicom(byteArray)
				//But read data in a DicomFile Object
				let dicomFile = new DicomFile(file, parsedDicom);

                this.up(dicomFile)

			} catch (e) {
				console.warn(e)
			}
		}
    }

    up(dfile){
        let patient = new Patient(dfile.getPatientID(), dfile.getPatientName(), dfile.getPatientBirthDate(), dfile.getPatientSex())
        let serie = new Serie(dfile.getSeriesInstanceUID(), dfile.getSeriesNumber(), dfile.getSeriesDate(), dfile.getSeriesDescription(), dfile.getModality())
        let study = new Study(dfile.getStudyInstanceUID(), dfile.getStudyID(), dfile.getStudyDate(), dfile.getStudyDescription())
        this.displayInformation(dfile)
        console.log(patient.toString() + serie.toString() + study.toString())

    }
    displayInformation(dfile){
        console.log("Accession number: " + dfile.getAccessionNumber()
        + "\nAcquisition date: " + dfile.getAcquisitionDate())
    }

    constructor(props){

        super(props)
        this.uppy = Uppy({
            autoProceed: false,
            allowMultipleUploads: false,
        })

        this.uppy.on('upload-success', async (file, response) => {
            if(response.body.ID !== undefined){
                await this.addUploadedFileToState(response.body)
            }
        })

        this.uppy.on('upload-error', (file, error, response) => {
            this.uppy.removeFile(file.id)
            let info = JSON.parse(response.body.error)
            this.addErrorToState(file.id, file.name, info.Details)
        })
        this.uppy.on('upload', () => this.setState({inProgress: true}))
        this.uppy.on('complete', () => this.setState({inProgress: false}))
        this.uppy.on('cancel-all', () => this.setState({inProgress: false}))

        this.uppy.on('file-added', (file) => {
            console.log('Added file', file)
            this.read(file)
          })

    }

    render (){
        return (
            <div className="jumbotron">
            <h2 className="col card-title">Import Dicom Files</h2>
            <div className="col mb-5">
                <DragDrop
                    uppy={this.uppy}
                    locale={{
                        strings: {
                            dropHereOr: 'Drop Dicom Folder',
                            browse: 'browse'
                        }
                    }}
                />
                <StatusBar hideUploadButton={false} showProgressDetails={true} hideRetryButton={true} hideAfterFinish={false} uppy={this.uppy} /> 
            </div>
        </div>

        )
    }


    

}