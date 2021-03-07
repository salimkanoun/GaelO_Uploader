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

import dcmjs from 'dcmjs'
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
  /*
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
  */
  tagsToAnonymize = [
    'PatientBirthName',	// Patient's Birth Name
    'PatientName', // Patient's Name
    'PatientID', // Patient's ID
    'PatientBirthDate',	// Patient's Birth Date
    'PatientAddress', // Patient's Address
    'AccessionNumber',	// Accession Number
    'InstitutionName',	// Institution Name
    'InstitutionAddress',	// Institution Adress
    'ReferringPhysicianName',	// Referring Physician's Name
    'ReferringPhysicianAddress',	// Referring Physician's Adress
    'ReferringPhysicianTelephoneNumbers', // Refering Physician's Telephone Number
    'InstitutionalDepartmentName', // Institutional Departement Name
    'PhysiciansOfRecord', // Physician Of Record
    'PerformingPhysicianName', // Performing Physician's Name
    'NameOfPhysiciansReadingStudy', // Name Of Physician Reading Study
    'OperatorsName', // Operators Name
    'StudyID', // Study ID
    'PersonName' // Person Name
  ]


  editableTags = [
    'SeriesDescription',
    'PatientWeight',
    'PatientSize'
  ]

  sequenceToAnonymize = [
    'ReferringPhysicianIdentificationSequence',
    'PhysiciansOfRecordIdentificationSequence', 
    'PerformingPhysicianIdentificationSequence',
    'PhysiciansReadingStudyIdentificationSequence',
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
    return this.__pFileReader(this.fileObject).then(reader => {
      const arrayBuffer = reader.result
      this.dicomDictionary = dcmjs.data.DicomMessage.readFile(arrayBuffer);
      this.dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(this.dicomDictionary.dict);
      this.studyInstanceUID = this.getStudyInstanceUID()
      this.seriesInstanceUID = this.getSeriesInstanceUID()
    }).catch((error) => {
      throw error
    })

  }

  editTag(tagName, value){
    this.dataset[tagName] = value
  }

  anonymise() {

    for (let tag of this.tagsToAnonymize) {
      try {
        if (this.dataset[tag] != null) this.editTag(tag, 'ANONYMIZED')
      } catch (e) {
        console.error(e)
      }
    }

    for (let tag of this.sequenceToAnonymize) {
      try {
        if (this.dataset[tag] != null) this.__editSequence(this.dataset[tag], 'ANONYMIZED')
      } catch (e) {
        console.error(e)
      }
    }

    this.dicomDictionary.dict = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(this.dataset);

    return this.dicomDictionary.write();

  }

  __editSequence(tag, newContent) {

    let nestedTags = Object.keys(tag)

    nestedTags.forEach( (dicomTag) =>{
      if(typeof dicomTag === 'object' ){
        this.__editSequence(tag[dicomTag], newContent)
      }else{
        tag[dicomTag] = newContent
      }
    })

  }

  getRadiopharmaceuticalTag(tagName) {
    try {
      let radiopharmaceuticalSequence = this.dataset.RadiopharmaceuticalInformationSequence
      return radiopharmaceuticalSequence[tagName]
    } catch (error) {
      return undefined
    }
  }

  getAccessionNumber() {
    return this.dataset.AccessionNumber
  }

  getAcquisitionDate() {
    return this.dataset.AcquisitionDate
  }

  getAcquisitionTime() {
    return this.dataset.AcquisitionTime
  }

  getInstanceNumber() {
    return this.dataset.InstanceNumber
  }

  getModality() {
    return this.dataset.Modality
  }

  getPatientBirthDate() {
    return this.dataset.PatientBirthDate
  }

  getPatientID() {
    return this.dataset.PatientID
  }

  getPatientName() {
    return this.dataset.PatientName
  }

  getPatientSex() {
    return this.dataset.PatientSex
  }

  getSeriesInstanceUID() {
    return this.dataset.SeriesInstanceUID
  }

  getSeriesDate() {
    return this.dataset.SeriesDate
  }

  getSeriesTime() {
    return this.dataset.SeriesTime
  }

  getSeriesDescription() {
    return this.dataset.SeriesDescription
  }

  getSOPInstanceUID() {
    return this.dataset.SOPInstanceUID
  }

  getSOPClassUID() {
    return this.dataset.SOPClassUID
  }

  getSeriesNumber() {
    return this.dataset.SeriesNumber
  }

  getStudyInstanceUID() {
    return this.dataset.StudyInstanceUID
  }

  getStudyDate() {
    return this.dataset.StudyDate
  }

  getStudyID() {
    return this.dataset.StudyID
  }

  getStudyDescription() {
    return this.dataset.StudyDescription
  }

  getPatientWeight() {
    return this.dataset.PatientWeight
  }

  getPatientSize() {
    return this.dataset.PatientSize
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
      this.getSeriesDescription(), this.getModality(), this.getStudyInstanceUID(), this.getPatientWeight(), this.getPatientSize());
  }

  getInstanceObject() {
    return new Instance(this.fileObject, this.getSOPInstanceUID())
  }
}
