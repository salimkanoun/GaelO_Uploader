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

import dicomParser from 'dicom-parser'
import Study from './Study'
import Series from './Series'
import Instance from './Instance'

export default class DicomFile {

  constructor(fileObject) {
    this.fileObject = fileObject
  }

  dicomDirSopValues = [
    '1.2.840.10008.1.3.10'
  ]

  secondaryCaptureImgValues = [
    '1.2.840.10008.5.1.4.1.1.7',
    '1.2.840.10008.5.1.4.1.1.7.1',
    '1.2.840.10008.5.1.4.1.1.7.2',
    '1.2.840.10008.5.1.4.1.1.7.3',
    '1.2.840.10008.5.1.4.1.1.7.4',
    '1.2.840.10008.5.1.4.1.1.88.11',
    '1.2.840.10008.5.1.4.1.1.88.22',
    '1.2.840.10008.5.1.4.1.1.88.33',
    '1.2.840.10008.5.1.4.1.1.88.40',
    '1.2.840.10008.5.1.4.1.1.88.50',
    '1.2.840.10008.5.1.4.1.1.88.59',
    '1.2.840.10008.5.1.4.1.1.88.65',
    '1.2.840.10008.5.1.4.1.1.88.67'
  ]

  tagsToErase = [
    '00101005',	// Patient's Birth Name
    '00100010', // Patient's Name
    '00100020', // Patient's ID
    '00100030',	// Patient's Birth Date
    '00101040', // Patient's Address
    '00080050',	// Accession Number
    '00080080',	// Institution Name
    '00080081',	// Institution Adress
    '00080090',	// Referring Physician's Name
    '00080092',	// Referring Physician's Adress
    '00080094', // Refering Physician's Telephone Number
    '00080096', // Referring Pysician ID Sequence
    '00081040', // Institutional Departement Name
    '00081048', // Physician Of Record
    '00081049', // Physician Of Record ID Sequence
    '00081050', // Performing Physician's Name
    '00081052', // Performing Physicians ID Sequence
    '00081060', // Name Of Physician Reading Study
    '00081062', // Physician Reading Study ID Sequence
    '00081070', // Operators Name
    '00200010', // Study ID
    '0040A123' // Person Name
  ]

  __pFileReader(file) {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.onload = () => {
        resolve(fr);
      }
    });
  }

  readDicomFile() {
    let self = this
    return this.__pFileReader(this.fileObject).then(reader => {
      const arrayBuffer = reader.result
      const byteArray = new Uint8Array(arrayBuffer)
      self.byteArray = byteArray
      self.dataSet = dicomParser.parseDicom(byteArray)
      self.studyInstanceUID = self.getStudyInstanceUID()
      self.seriesInstanceUID = self.getSeriesInstanceUID()
    }).catch((error) => {
      throw error
    })

  }

  anonymise() {

    for (let tag of this.tagsToErase) {
      let id = tag.toLowerCase()
      try {
        const element = this.dataSet.elements[`x${id}`]
        if (element === undefined) throw Error('Tag Not Found')

        if (element.vr === 'SQ') {
          this.__editSequence(element, '*')
        } else {
          this.__editElement(element, '*')
        }

      } catch (e) {
        if (e.message !== 'Tag Not Found') {
          console.error('tag ' + id)
        }

      }
    }

  }

  __editSequence(element, newContent){
    // Treat each item of sequence
    element.items.forEach(item => {
      const sequenceElement = item.dataSet.elements
      const elementsInSeq = Object.keys(sequenceElement)
      // erase each tag in this item
      elementsInSeq.forEach(tag => {
        if(sequenceElement[tag].vr === 'SQ'){
          //If sequence in Sequence, recursively run this fuction
          this.__editSequence(sequenceElement[tag], newContent)
        }else{
          //If not sequence anonymize the tag by changing its value
          this.__editElement(sequenceElement[tag], newContent)
        }
      })
    })
    

  }

  __editElement(element, newContent) {
    // Retrieve the index position of the element in the data set array
    const dataOffset = element.dataOffset

    // Retrieve the length of the element
    const length = element.length

    // Fill the field with unsignificant values
    for (let i = 0; i < length; i++) {
      // Get charcode of the current char in 'newContent'
      const char = newContent.charCodeAt(i % newContent.length)

      // Write this char in the array
      this.byteArray[dataOffset + i] = char
    }
  }

  getRadiopharmaceuticalTag(tagAddress) {
    try {
      const elmt = this.dataSet.elements.x00540016
      const radioPharmElements = elmt.items[0].dataSet.elements
      return this._getString(radioPharmElements['x' + tagAddress])
    } catch (error) {
      return undefined
    }
  }

  _getDicomTag(tagAddress) {
    const elmt = this.dataSet.elements['x' + tagAddress]
    if (elmt !== undefined && elmt.length > 0) {
      // Return the value of the dicom attribute
      return this._getString(elmt)
    } else return undefined
  }

  getAccessionNumber() {
    return this._getDicomTag('00080050')
  }

  getAcquisitionDate() {
    return this._getDicomTag('00080020')
  }

  getInstanceNumber() {
    return this._getDicomTag('00200013')
  }

  getModality() {
    return this._getDicomTag('00080060')
  }

  getPatientBirthDate() {
    return this._getDicomTag('00100030')
  }

  getPatientID() {
    return this._getDicomTag('00100020')
  }

  getPatientName() {
    return this._getDicomTag('00100010')
  }

  getPatientSex() {
    return this._getDicomTag('00100040')
  }

  getSeriesInstanceUID() {
    return this._getDicomTag('0020000e')
  }

  getSeriesDate() {
    return this._getDicomTag('00080021')
  }

  getSeriesDescription() {
    return this._getDicomTag('0008103e')
  }

  getSOPInstanceUID() {
    return this._getDicomTag('00080018')
  }

  getSOPClassUID() {
    return this._getDicomTag('00020002')
  }

  getSeriesNumber() {
    return this._getDicomTag('00200011')
  }

  getStudyInstanceUID() {
    return this._getDicomTag('0020000d')
  }

  getStudyDate() {
    return this._getDicomTag('00080020')
  }

  getStudyID() {
    return this._getDicomTag('00200010')
  }

  getStudyDescription() {
    return this._getDicomTag('00081030')
  }

  /**
	 * Returns element contain as a string
	 * @param {*} element element from the data set
	 */
  _getString(element) {
    let position = element.dataOffset
    const length = element.length

    if (length < 0) {
      throw Error('Negative length')
    }
    if (position + length > this.byteArray.length) {
      throw Error('Out of range index')
    }

    var result = ''
    var byte

    for (var i = 0; i < length; i++) {
      byte = this.byteArray[position + i]
      if (byte === 0) {
        position += length
        return result.trim()
      }
      result += String.fromCharCode(byte)
    }
    return result.trim()
  }

  isSecondaryCaptureImg() {
    return this.secondaryCaptureImgValues.includes(this.getSOPClassUID())
  }

  isDicomDir() {
    return this.dicomDirSopValues.includes(this.getSOPClassUID())
  }

  getPatientFirstName() {
    if (this.getPatientName() !== undefined) {
      return this.getPatientName().split('^').pop()
    } else {
      return null
    }
  }

  getPatientLastName() {
    if (this.getPatientName() !== undefined) {
      return this.getPatientName().substring(0, this.getPatientName().indexOf('^'))
    } else {
      return null
    }
  }

  getFilePath() {
    let res = this.fileObject.path;
    if (res === undefined) {
      // Uploaded by folder selection,
      //doesn't have a full path but has a webkitrelativepath
      res = this.fileObject.webkitRelativePath;
    }
    return res;
  }

  getStudyObject() {
    return new Study(this.getStudyInstanceUID(), this.getStudyID(), this.getStudyDate(), this.getStudyDescription(),
      this.getAccessionNumber(), this.getPatientID(), this.getPatientFirstName(), this.getPatientLastName(),
      this.getPatientBirthDate(), this.getPatientSex(), this.getAcquisitionDate())
  }

  getSeriesObject() {
    return new Series(this.getSeriesInstanceUID(), this.getSeriesNumber(), this.getSeriesDate(),
      this.getSeriesDescription(), this.getModality(), this.getStudyInstanceUID());
  }

  getInstanceObject() {
    return new Instance(this.fileObject, this.getSOPInstanceUID())
  }
}
