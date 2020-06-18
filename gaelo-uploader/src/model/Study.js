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

export default class Study {

    series = {}

    constructor(studyUID, studyID, studyDate, studyDescription, accessionNumber, patientID, patientName, patientBirthDate, patientSex, acquisitionDate) {
        this.studyUID = studyUID;
        this.studyID = studyID;
        this.studyDate = studyDate;
        this.studyDescription = studyDescription;
        this.accessionNumber = accessionNumber;
        this.patientID = patientID;
        this.patientName = patientName;
        this.patientBirthDate = patientBirthDate;
        this.patientSex = patientSex;
        this.acquisitionDate = acquisitionDate;
        /*
        this.validSeries = [];     // have passed the checks
        this.rejectedSeries = [];  // do not have passed the checks
        this.queuedSeries = [];    // in wait for uplaod
        this.visit = null;
        this.warnings = {};
        this.isQueued = undefined;
        this.isUploadAborted = undefined;
        */
    }

    addSeries(seriesObject){
        this.series[seriesObject.seriesInstanceUID] = seriesObject
    }

    isExistingSeries(seriesInstanceUID){
        let existingSeriesUID = Object.keys(this.series)
        return existingSeriesUID.includes(seriesInstanceUID)
    }

    getSeries(seriesInstanceUID){
        return this.series[seriesInstanceUID]
    }
    getPatientName(){
        return this.patientName
    }

    getStudyUID() {
        return this.studyUID
    }

    getStudyID() {
        return this.studyID
    }

    getStudyDate() {
        return this.studyDate
    }

    getStudyDescription() {
        return this.studyDescription
    }

    getPatientBirthDate() {
        return this.patientBirthDate
    }

    getPatientSex() {
        return this.patientSex
    }

    getPatientID() {
        return this.patientID
    }

    toString() {
        return ("\nStudy Instance UID: " + this.studyUID
            + "\nStudy date: " + this.studyDate
            + "\nStudy ID: " + this.studyID
            + "\nStudy Description: " + this.studyDescription
            + "\nAccession Number: " + this.accessionNumber
            + "\nAcquisition date: " + this.acquisitionDate
            + "\nPatient birth date: " + this.patientBirthDate
            + "\nPatient ID: " + this.patientID
            + "\nPatient Name: " + this.patientName
            + "\nPatient sex: " + this.patientSex);
    }

}