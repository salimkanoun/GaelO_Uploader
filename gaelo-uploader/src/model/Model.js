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

/*MOdele référencement des instances. Gérer les ressources. Puis front pour afficher les ressources. Ensuite partie upload des images (bcp de front et un peu de back
   Contraintes de l'empreinte mémoire (d'abord au parsing ex: pas de pique à 1G de rame). A chaque fichier, on a besoin que des références.
   Puis front en React avec Sylvain*/

export default class Modele {

    data = {
    }

    addStudy(studyObject) {
        this.data[studyObject.studyUID] = studyObject;
    }

    isExistingStudy(studyInstanceUID) {
        let existingStudyUID = Object.keys(this.data);
        return existingStudyUID.includes(studyInstanceUID);
    }

    toString() {
        //console.log(this.data);
    }

    getStudy(studyInstanceUID) {
        return this.data[studyInstanceUID]
    }

    allStudies() {
        return this.data
    }

}