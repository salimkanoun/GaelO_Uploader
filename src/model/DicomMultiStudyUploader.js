import DicomBatchUploader from './DicomBatchUploader'
const EventEmitter = require('events').EventEmitter;

export default class DicomMultiStudyUploader extends EventEmitter {

    visitsToUpload = {}

    constructor(uppy){
        super()
        this.uppy  = uppy
    }

    addStudyToUpload(idVisit, fileArray){
        this.visitsToUpload[idVisit] = fileArray
        console.log(this.visitsToUpload)
    }

    uploadNextStudy(){
        let uploader = this.uploadIterator.next().value
        uploader.on('batch-upload-done', (timeStamp, numberOfFiles)=>{
            if(this.studyNumber === Object.keys(this.visitsToUpload).length ){
                this.emit('upload-finished', this.currentVisitID, timeStamp, numberOfFiles)
            }else{
                this.uploadNextStudy()
            }
            
        })
        uploader.on('batch-progress', (zipProgress, uploadProgress)=>{
            this.emit('upload-progress', this.studyNumber, zipProgress , uploadProgress)
            
        })
        uploader.startUpload()

    }

    startUpload(){
        this.uploadIterator = this.buildNextUploader()
        this.uploadNextStudy()
    }

    buildNextUploader = function*(){
        this.studyNumber = 0
        for(let visitID of Object.keys(this.visitsToUpload)){
            this.studyNumber = ++this.studyNumber
            this.currentVisitID = visitID
            let uploader = new DicomBatchUploader(this.uppy, visitID, this.visitsToUpload[visitID])
            yield uploader

        }

    }
}