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

class Study {
	constructor(stiuid, stid, std, stdesc, an, ptid, ptn, ptbd, pts, acqd) {
		this.studyIUID = stiuid;
		this.studyID = stid;
		this.studyDate = std;
        this.studyDescription= stdesc;
        this.accessionNumber = an;
        this.patientId = ptid;
		this.patientName = ptn;
		this.patientBirthDate = ptbd;
        this.patientSex= pts;
        this.acquisitionDate = acqd;
        this.series = [];
		this.validSeries = [];     // have passed the checks
		this.rejectedSeries = [];  // do not have passed the checks
		this.queuedSeries = [];    // in wait for uplaod
		this.visit = null;
		this.warnings = {};
		this.isQueued = undefined;
		this.isUploadAborted = undefined;
    }

    getStudyIUID(){
        return this.studyIUID;
    }

    getStudyID(){
        return this.studyID;
    }

    getStudyDate(){
        return this.studyDate;
    }

    getStudyDescription(){
        return this.studyDescription;
    }

    getPatientName() {
		try {
			let name = this.patientName;
			name.toString = () => {
				let fullname = name.familyName + ' ' + name.givenName;
				return fullname.replace('undefined', '').trim();
			}
			return name;
		} catch (e) {
			return undefined;
		}
	}

	getPatientBirthDate() {
		return this.patientBirthDate;
    }
    
    getPatientSex() {
        return this.patientSex;
    }
    
    getPatientId() { 
        return this.patientId; 
    }

    toString(){
        return("\nStudy Instance UID: " + this.studyIUID
        + "\nStudy date: " + this.studyDate
        + "\nStudy ID: " + this.studyID
        + "\nStudy Description: " + this.studyDescription
        + "\nAccession Number: " + this.accessionNumber
        + "\nAcquisition date: " + this.acquisitionDate
        + "\nPatient birth date: " + this.patientBirthDate
        + "\nPatient ID: " + this.patientId 
        + "\nPatient Name: " + this.patientName
        + "\nPatient sex: " + this.patientSex)
    }
}