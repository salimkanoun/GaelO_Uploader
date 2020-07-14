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

const minNbOfInstances = 30

export default class Series {

	instances = {}


	constructor(seriesInstanceUID, seriesNumber, seriesDate, seriesDescription, modality) {
		this.seriesInstanceUID = seriesInstanceUID;
		this.seriesNumber = seriesNumber;
		this.seriesDate = this.getDate(seriesDate);
		this.seriesDescription = seriesDescription;
		this.modality = modality;
		this.warnings = {};
	}

	getDate(rawDate) {
		if (rawDate != null) {
			return (rawDate.substring(0, 4) + '-' + rawDate.substring(4, 6) + '-' + rawDate.substring(6, 8))
		} else {
			return null
		}
	}

	addInstance( instanceObject ) {
		if (! this.isExistingInstance(instanceObject.SOPInstanceUID) ) {
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
		let instances = []
		Object.keys(this.instances).forEach(
			instanceID => {
				instances.push(this.instances[instanceID])
			}
		)
		return instances
	}

	getNbInstances() {
		return Object.keys(this.instances).length;
	}

	hasWarnings() {
		let nbConsideredWarnings = 0;
		for (let w in this.warnings) {
			if (!this.warnings[w].dismissed) {
				nbConsideredWarnings++;
			}
		}
		return nbConsideredWarnings > 0;
	}

	async checkSeries(dicomFile) {
		await dicomFile.readDicomFile()
		console.log("checkingseries")
		// Check missing tags
		if ((dicomFile.getModality()) === undefined) {
			this.warnings[MISSING_TAG_00080060.key] = MISSING_TAG_00080060;
		} else {
			if ((dicomFile._getDicomTag('00080021') === undefined) && (dicomFile._getDicomTag('00080022') === undefined)) {
				this.warnings[MISSING_TAG_00080022.key] = MISSING_TAG_00080022;
			}
			if (this.modality === 'PT') {
				if ((dicomFile._getDicomTag('00101030')) === undefined) {
					this.warnings[MISSING_TAG_00101030.key] = MISSING_TAG_00101031;
				}
				if ((dicomFile._getDicomTag('00080031')) === undefined && (dicomFile._getDicomTag('00080032')) === undefined) {
					this.warnings[MISSING_TAG_00101031.key] = MISSING_TAG_00101031;
				}
				if ((dicomFile.getRadiopharmaceuticalTag('00181074')) === undefined) {
					this.warnings[MISSING_TAG_00181074.key] = MISSING_TAG_00181074;
				}
				if ((dicomFile.getRadiopharmaceuticalTag('00181072')) === undefined && (dicomFile.getRadiopharmaceuticalTag('00181078')) === undefined) {
					this.warnings[MISSING_TAG_00181072.key] = MISSING_TAG_00181072;
				}
				if ((dicomFile.getRadiopharmaceuticalTag('00181075')) === undefined) {
					this.warnings[MISSING_TAG_00181075.key] = MISSING_TAG_00181075;
				}
			}
		}
		// Check number of instances
		if (this.getNbInstances() < minNbOfInstances) {
			this.warnings[LESS_THAN_MINIMAL_INSTANCES.key] = LESS_THAN_MINIMAL_INSTANCES;
		} else {
			delete this.warnings[LESS_THAN_MINIMAL_INSTANCES]
		}
	}

	getArrayWarnings() {
		return Object.values(this.warnings)
	}

	setWarningStatus(key, dismissed) {
		this.warnings[key]['dismissed'] = dismissed
	}
}