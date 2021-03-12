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

import { MISSING_TAG_00080060, MISSING_TAG_00080022, MISSING_TAG_00101030, MISSING_TAG_00101031, MISSING_TAG_00181074, MISSING_TAG_00181072, MISSING_TAG_00181075, LESS_THAN_MINIMAL_INSTANCES } from './Warning'
import DicomFile from './DicomFile'

const minNbOfInstances = 30

export default class Series {

	instances = {}

	constructor(seriesInstanceUID, seriesNumber, seriesDate, seriesDescription, modality, studyInstanceUID, patientWeight, patientSize, structureSetROISequence) {
		this.seriesInstanceUID = seriesInstanceUID
		this.seriesNumber = seriesNumber
		this.seriesDate = seriesDate
		this.seriesDescription = seriesDescription
		this.modality = modality
		this.studyInstanceUID = studyInstanceUID
		this.patientWeight = patientWeight
		this.patientSize = patientSize
		this.structureSetROISequence = structureSetROISequence
	}

	getSeriesInstanceUID(){
		if(this.seriesInstanceUID == null){
			throw new Error('Null SeriesInstanceUID')
		}
		return this.seriesInstanceUID
	}

	getSeriesNumber(){
		return this.seriesNumber == null ? '' : this.seriesNumber
	}

	getSeriesDate(){
		return this.seriesDate == null ? '' : this.seriesDate
	}

	getSeriesDescription(){
		return this.seriesDescription == null ? '' : this.seriesDescription
	}

	getModality(){
		return this.modality == null ? '' : this.modality
	}

	getStudyInstanceUID(){
		if(this.studyInstanceUID == null){
			throw new Error('Null StudyInstanceUID')
		}
		return this.studyInstanceUID
	}

	getPatientWeight(){
		return this.patientWeight == null ? '' : this.patientWeight
	}

	getPatientSize(){
		return this.patientSize == null ? '' : this.patientSize
	}

	getStructureSetROISequence(){
		return this.structureSetROISequence
	}

	addInstance(instanceObject) {
		if (!this.isExistingInstance(instanceObject.SOPInstanceUID)) {
			this.instances[instanceObject.SOPInstanceUID] = instanceObject
		} else {
			throw Error("Existing instance")
		}
	}

	isExistingInstance(SOPInstanceUID) {
		let knownInstancesUID = Object.keys(this.instances)
		return knownInstancesUID.includes(SOPInstanceUID)
	}

	getInstance(instanceUID) {
		return this.instances[instanceUID]
	}

	getArrayInstances() {
		let instances = Object.values(this.instances)
		return instances
	}

	getInstancesObject(){
		return this.instances
	}

	getNbInstances() {
		return Object.keys(this.instances).length;
	}

	async getWarnings() {
		let firstInstance = this.getArrayInstances()[0]
		let dicomFile = new DicomFile(firstInstance.getFile())
		await dicomFile.readDicomFile()

		let warnings = {}
		// Check missing tags
		if ((dicomFile.getModality()) === undefined) {
			warnings[MISSING_TAG_00080060.key] = MISSING_TAG_00080060;
		} else {
			if ((dicomFile.getSeriesDate() === undefined) && (dicomFile.getAcquisitionDate() === undefined)) {
				warnings[MISSING_TAG_00080022.key] = MISSING_TAG_00080022;
			}
			//Check PT specific tags
			if (this.modality === 'PT') {
				if (( dicomFile.getPatientWeight() ) === undefined) {
					warnings[MISSING_TAG_00101030.key] = MISSING_TAG_00101030;
				}
				if ((dicomFile.getSeriesTime()) === undefined && (dicomFile.getAcquisitionTime()) === undefined) {
					warnings[MISSING_TAG_00101031.key] = MISSING_TAG_00101031;
				}
				if ((dicomFile.getRadiopharmaceuticalTag('RadionuclideTotalDose')) === undefined) {
					warnings[MISSING_TAG_00181074.key] = MISSING_TAG_00181074;
				}
				if ((dicomFile.getRadiopharmaceuticalTag('RadiopharmaceuticalStartTime')) === undefined && (dicomFile.getRadiopharmaceuticalTag('00181078')) === undefined) {
					warnings[MISSING_TAG_00181072.key] = MISSING_TAG_00181072;
				}
				if ((dicomFile.getRadiopharmaceuticalTag('RadionuclideHalfLife')) === undefined) {
					warnings[MISSING_TAG_00181075.key] = MISSING_TAG_00181075;
				}
			}
		}
		// Check number of instances
		if (this.getNbInstances() < minNbOfInstances) {
			warnings[LESS_THAN_MINIMAL_INSTANCES.key] = LESS_THAN_MINIMAL_INSTANCES;
		}

		return warnings

	}


}