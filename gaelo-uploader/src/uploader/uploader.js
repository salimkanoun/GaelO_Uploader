import React, { Component } from 'react'
import { StatusBar,DragDrop } from '@uppy/react'
import Uppy from '@uppy/core'
import dicomParser from 'dicom-parser'
import DicomFile from './DicomFile'
import Instance from '../Modele/Instance'
import Serie from '../Modele/Serie'
import Study from '../Modele/Study'

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


    /*Regrouper les mêmes studies
    Modele: array study (getSeries (-> getInstances pour récupérer les instances relatives)) isExisting pour les study et series
    Clés uniques UIDs
    Sotkcer chemin */

    up(dfile){
        
        let instanceExists = false;
        let studyExists = false;
        let serieExists = false;

        /*Check if instance already exists*/
        if(this.instances.length > 0){
            instanceExists = false;
            for(let element of this.instances){
                if(element.getSOPInstanceUID() === dfile.getSOPInstanceUID()){
                    console.log("Instance exists!");
                    instanceExists = true;
                    break;
                }
            }
        }
        /*Check if study already exists*/
        if(this.studies.length > 0){
            studyExists = false;
            for(let element of this.this.studies){
                if(element.getStudyInstanceUID() === dfile.getStudyInstanceUID()){
                    console.log("Study exists!");
                    studyExists = true;
                    break;
                }
            }
        }
        /*Check if serie already exists*/
        if(series.length > 0){
            serieExists = false;
            for(let element of this.series){
                if(element.getSeriesInstanceUID() === dfile.getSeriesInstanceUID()){
                    console.log("Series exists!");
                    serieExists = true;
                    break;
                }
            }
        }

        this.instances.push("Bonjour");
        console.log(this.instances);

        if(!instanceExists) {
            console.log("\nPush instance done");
            this.instances.push(new Instance(dfile.getSOPInstanceUID(), dfile.getInstanceNumber(), dfile));
        }
        if(!studyExists){
            console.log("\nPush study done");
            this.studies.push(new Study(dfile.getStudyInstanceUID(), dfile.getStudyID(), dfile.getStudyDate(), dfile.getStudyDescription(), dfile.getAccessionNumber(),
            dfile.getPatientID(), dfile.getPatientName(), dfile.getPatientBirthDate(), dfile.getPatientSex(), dfile.getAcquisitionDate()));
        }
        if(!serieExists){
            console.log("\nPush serie done");
            series.push(new Serie(dfile.getSeriesInstanceUID(), dfile.getSeriesNumber(), dfile.getSeriesDate(), dfile.getSeriesDescription(), dfile.getModality()));
        }

        console.log("\nNombre d'this.instances: " + this.instances.length
        + "\nNombre de studies: " + studies.length
        + "\nNombre de series: " + series.lenght);
        
        /*for (let element of instances) { 
            console.log("\nInstances: " + element.toString());
        }
        
        for (let element of studies) { 
            console.log("\nStudies: " + element.toString());
        }
        
        for (let element of series) { 
            console.log("\nSeries: " + element.toString());
        }*/

    }


    constructor(props){

        super(props)
        this.uppy = Uppy({
            autoProceed: false,
            allowMultipleUploads: true,
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