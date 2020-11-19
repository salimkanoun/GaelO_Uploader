import DicomBatchUploader from './DicomBatchUploader'
const EventEmitter = require('events').EventEmitter;

export default class DicomMultiStudyUploader extends EventEmitter {

    visitsToUpload = {}

    constructor(uppy) {
        super()
        this.uppy = uppy
    }

    addStudyToUpload(idVisit, fileArray, orthancStudyID) {
        this.visitsToUpload[idVisit] = {}
        this.visitsToUpload[idVisit]['files'] = fileArray
        this.visitsToUpload[idVisit]['orthancStudyID'] = orthancStudyID
    }

    registerListener() {
        this.uploader.on('batch-upload-done', (numberOfFiles, sucessIDsUploaded) => {
            this.uploader.removeAllListeners()

            let orthancStudyID = this.visitsToUpload[this.currentVisitID]['orthancStudyID'];
            this.emit('study-upload-finished', this.currentVisitID, numberOfFiles, sucessIDsUploaded, orthancStudyID)

            if (this.studyNumber === Object.keys(this.visitsToUpload).length) {
                this.emit('upload-finished')
            } else {
                this.emit('batch-upload-progress', this.studyNumber, 0)
                this.emit('batch-zip-progress', this.studyNumber, 0)
                this.uploadNextStudy()
            }

        })

        this.uploader.on('batch-zip-progress', (zipProgress) => {
            this.emit('batch-zip-progress', this.studyNumber, zipProgress)
        })

        this.uploader.on('batch-upload-progress', (uploadProgress) => {
            this.emit('batch-upload-progress', this.studyNumber, uploadProgress)

        })
    }

    uploadNextStudy() {
        this.uploader = this.uploadIterator.next().value
        this.registerListener()
        this.uploader.startUpload()
    }

    startUpload() {
        this.uploadIterator = this.buildNextUploader()
        this.uploadNextStudy()
    }

    buildNextUploader = function* () {
        this.studyNumber = 0
        for (let visitID of Object.keys(this.visitsToUpload)) {
            ++this.studyNumber
            this.currentVisitID = visitID
            let uploader = new DicomBatchUploader(this.uppy, visitID, this.visitsToUpload[visitID]['files'])
            yield uploader

        }

    }
}