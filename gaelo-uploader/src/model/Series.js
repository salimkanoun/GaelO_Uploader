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

export default class Series {

	instances = {}

	constructor(seriesInstanceUID, seriesNumber, seriesDate, seriesDescription, modality) {
		this.seriesInstanceUID = seriesInstanceUID;
		this.seriesNumber = seriesNumber;
		this.seriesDate = seriesDate;
		this.seriesDescription = seriesDescription;
		this.modality = modality;
		this.warnings = {};
	}

	addInstance(instanceObject) {
		this.instances[instanceObject.SOPInstanceUID] = instanceObject
	}

	isExistingInstance(SOPInstanceUID) {
		let knownInstancesUID = Object.keys(this.instances)
		return knownInstancesUID.includes(SOPInstanceUID)

	}

	

	getInstance(instanceUID) {
		return this.instances[instanceUID]
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
}