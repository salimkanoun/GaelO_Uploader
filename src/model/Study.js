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

import SHA1 from 'crypto-js/sha1'

export default class Study {

    series = {}

    constructor(studyInstanceUID, studyID, studyDate, studyDescription, accessionNumber, patientID, patientFirstName, patientLastName,
        patientBirthDate, patientSex, acquisitionDate) {
        this.studyInstanceUID = studyInstanceUID
        this.studyID = studyID
        this.studyDate = studyDate
        this.studyDescription = studyDescription
        this.accessionNumber = accessionNumber
        this.patientID = patientID
        this.patientFirstName = patientFirstName
        this.patientLastName = patientLastName
        this.patientBirthDate = patientBirthDate
        this.patientSex = patientSex
        this.acquisitionDate = acquisitionDate
        this.patientName = patientFirstName + ' ' + patientLastName
    }

    addSeries(seriesObject) {
        if (!this.isExistingSeries(seriesObject.seriesInstanceUID)) {
            this.series[seriesObject.seriesInstanceUID] = seriesObject
            return seriesObject
        } else throw new Error('Existing Series')
    }

    isExistingSeries(seriesInstanceUID) {
        let existingSeriesInstanceUID = Object.keys(this.series)
        return existingSeriesInstanceUID.includes(seriesInstanceUID)
    }

    getSeries(seriesInstanceUID) {
        return this.series[seriesInstanceUID]
    }

    getSeriesArray() {
        let series = Object.values(this.series)
        return series
    }

    getChildSeriesInstanceUIDs() {
        return Object.keys(this.series)
    }

    getPatientFirstName() {
        return (this.patientFirstName === undefined || this.patientFirstName === null) ? '' : this.patientFirstName.toUpperCase()
    }

    getPatientLastName() {
        return (this.patientLastName === undefined || this.patientLastName === null) ? '' : this.patientLastName.toUpperCase()
    }

    getStudyInstanceUID() {
        if(this.studyInstanceUID == null) {
            throw new Error('Missing StudyInstanceUID')
        }
        else return this.studyInstanceUID
    }

    getAccessionNumber(){
        return (this.accessionNumber === undefined || this.accessionNumber === null) ? '' : this.accessionNumber
    }

    getStudyID() {
        return (this.studyID === undefined || this.studyID === null) ? '' : this.studyID
    }

    getStudyDate() {
        return (this.studyDate === undefined || this.studyDate === null) ? '' : this.studyDate
    }

    getAcquisitionDate() {
        return (this.acquisitionDate === undefined || this.acquisitionDate === null) ? '' : this.acquisitionDate
    }

    getStudyDescription() {
        return (this.studyDescription === undefined || this.studyDescription === null) ? '' : this.studyDescription
    }

    getPatientBirthDate() {
        return (this.patientBirthDate === undefined || this.patientBirthDate === null) ? '' : this.patientBirthDate
    }

    getPatientSex() {
        return (this.patientSex === undefined || this.patientSex === null) ? '' : this.patientSex.toUpperCase()
    }

    getPatientID() {
        return (this.patientID === undefined || this.patientID === null) ? '' : this.patientID
    }

    getChildModalitiesArray(){
        let childSeriesArray = this.getSeriesArray()
        let modalityArray = childSeriesArray.map( series => {
            return series.getModality()
        })

        return [...new Set(modalityArray)]

    }
    getOrthancStudyID() {
        let hash = SHA1( this.getPatientID() + '|' + this.getStudyInstanceUID() ).toString()
        return `${hash.substring(0, 8)}-${hash.substring(8, 16)}-${hash.substring(16, 24)}-${hash.substring(24, 32)}-${hash.substring(32, 40)}`
    }
    
}