/**
 Copyright (C) 2018-2020 KANOUN Salim
 This program is free software; you can redistribute it and/or modify
 it under the terms of the Affero GNU General Public v.3 License as published by
 the Free Software Foundation;
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 Affero GNU General Public Public for more details.
 You should have received a copy of the Affero GNU General Public Public along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

import Instance from '../Modele/Instance'
import Serie from '../Modele/Serie'
import Study from '../Modele/Study'

 /*MOdele référencement des instances. Gérer les ressources. Puis front pour afficher les ressources. Ensuite partie upload des images (bcp de front et un peu de back
    Contraintes de l'empreinte mémoire (d'abord au parsing ex: pas de pique à 1G de rame). A chaque fichier, on a besoin que des références.
    Puis front en React avec Sylvain*/

export default class Modele {

    

	constructor() {
        this.studies = []; 
        this.series = [];
        this.instances = [];
    }

    getObjLength(myObj){
        return  (Object.keys(myObj).length);
    }

    addStudy(dicomFile) {
        this.studies.push(new Study(this.dicomFile.getStudyInstanceUID(), this.dicomFile.getStudyID(), this.dicomFile.getStudyDate(), this.dicomFile.getStudyDescription(), this.dicomFile.getAccessionNumber(),
            this.dicomFile.getPatientID(), this.dicomFile.getPatientName(), this.dicomFile.getPatientBirthDate(), this.dicomFile.getPatientSex(), this.dicomFile.getAcquisitionDate()));
    }

    addSerie(id) {
        this.series.push(new Serie(this.dicomFile.getSeriesInstanceUID(), this.dicomFile.getSeriesNumber(), this.dicomFile.getSeriesDate(), this.dicomFile.getSeriesDescription(), this.dicomFile.getModality()));
    }

    addInstance(id, dic) {
            this.instances.push(new Instance(this.dicomFile.getSOPInstanceUID(), this.dicomFile.getInstanceNumber(), this.dicomFile));
            this.instances.push("un");
        }
    }
    
    isExistingInstance(sopid) {
        let exists = false;
        for(let element in this.instances){
            console.log(element);
            if(element.getSOPInstanceUID() == this.sopid){
                exists = true;
            }
        }
        console.log(exists);
        return (exists);
    }

    isExistingSerie(srid){
        let exists = false;
        for(let element in this.series){
            if(element.getSeriesInstanceUID() == srid){
                exists = true;
            }
        }
        return (exists);
    }

    isExistingStudy(stid){
        let exists = false;
        for(let element in this.study){
            if(element.getStudyInstanceUID() == stid){
                exists = true;
            }
        }
        return (exists);
    }

    /*ajoute des instances dans le modele*/
    register(dfile){
        this.addInstance(dfile.getSOPInstanceUID());
        this.addStudy(dfile.getStudyInstanceUID());
        this.addSerie(dfile.getStudyInstanceUID());
        this.toString();
    }

    toString(){
        console.log("\Instances: " + this.instances.length
        + "\nNombre de studies: " + this.studies.length
        + "\nNombre de series: " + this.series.length + '\n\n');

        console.log("\Instances: " + this.instances.toString()
        + "\nStudies: " + this.studies.toString()
        + "\nSeries: " + this.series.toString() + '\n\n');
    }

}