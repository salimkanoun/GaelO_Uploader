import DicomBatchUploader from './DicomBatchUploader'

export default class DicomMultiStudyUploader {

    visitsToUpload = {}

    constructor(uppy){
        this.uppy  = uppy
    }

    addStudyToUpload(idVisit, fileArray){
        this.visitsToUpload[idVisit] = fileArray
    }

    async execute(){
        for(let visitID in Object.keys(this.visitsToUpload)){

            this.buildNextUploader()

            let uploader = new DicomBatchUploader(this.uppy, visitID, this.visitsToUpload[visitID],  () => {
                clearInterval(this.intervalProgress)
                validateUpload(282, uploader.timeStamp, uploader.totalDicomFiles,studyOrthancID)
            })

        }
        

    }

    buildNextUploader = async function*(){

        for(let visitID in Object.keys(this.visitsToUpload)){
            yield new DicomBatchUploader(this.uppy, visitID, this.visitsToUpload[visitID], ()=>{
                
            })

        }

    }
}