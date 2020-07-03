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
			if (!this.warnings[w].ignore) {
				nbConsideredWarnings++;
			}
		}
		return nbConsideredWarnings > 0;
	}

	setWarning(name, content, ignorable = false, critical = true, visible = true) {
		if (this.warnings[name] === undefined) {
			this.warnings[name] = {
				content: content,
				ignore: false,
				ignorable: ignorable,
				critical: critical,
				visible: visible
			};
		} else {
			this.warnings[name].content = content;
		}
	}

	ignoreWarning(name) {
		this.warnings[name].ignore = true;
	}

	considerWarning(name) {
		this.warnings[name].ignore = false;
	}

	toString() {
		return ("\nInstance number: " + this.seriesNumber
			+ "\nModality: " + this.modality
			+ "\nSeries instance UID: " + this.seriesInstanceUID
			+ "\nSeries date: " + this.seriesDate
			+ "\nSeries description: " + this.seriesDescription);
	}

	checkSeries(dicomFile) {
		// Check missing tags
		if ((dicomFile.getModality()) === undefined) {
			this.setWarning('missingTag00080060', 'Missing tag: Modality', true);
		} else {
			if ((dicomFile._getDicomTag('00080021') === undefined) && (dicomFile._getDicomTag('00080022') === undefined)) {
				this.setWarning('missingTag00080022', 'Missing tag: SeriesDate', true);
			}
			if (this.modality === 'PT') {
				if ((dicomFile._getDicomTag('00101030')) === undefined) {
					this.setWarning('missingTag00101030', 'Missing tag: Patient Weight', true);
				}
				if ((dicomFile._getDicomTag('00080031')) === undefined && (dicomFile._getDicomTag('00080032')) === undefined) {
					this.setWarning('missingTag00101031', 'Missing tag: Series Time', true);
				}
				if ((dicomFile.getRadiopharmaceuticalTag('00181074')) === undefined) {
					this.setWarning('missingTag00181074', 'Missing tag: Radionuclide Total Dose', true);
				}
				if ((dicomFile.getRadiopharmaceuticalTag('00181072')) === undefined && (dicomFile.getRadiopharmaceuticalTag('00181078')) === undefined) {
					this.setWarning('missingTag00181072', 'Missing tag: Radiopharmaceutical Start Time', true);
				}
				if ((dicomFile.getRadiopharmaceuticalTag('00181075')) === undefined) {
					this.setWarning('missingTag00181075', 'Missing tag: Radionuclide Half Life', true);
				}
			}
		}

		// Check number of instances
		if (this.getNbInstances() < minNbOfInstances) {
			this.setWarning(`lessThan${minNbOfInstances}Instances`, `This serie contains less than ${minNbOfInstances} instances`, true, false);
		} else {
			delete this.warnings[`lessThan${minNbOfInstances}Instances`];
		}
	}
}