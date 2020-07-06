import DicomFile from './DicomFile'

const JSZip = require('jszip')


export default class DicomBatchUploader {

    constructor (uppy, files, onUploadDone) {
        this.uppy = uppy
        this.files = files
        this.onUploadDone = onUploadDone
        this.buildBatches()

        this.uppy.on('upload-success', (file, response) => {
            this.compressNextBatch()
            this.currentBatchUpload = ++this.currentBatchUpload
        })

        this.uppy.on('upload-progress', (file, progress) => {
            let currentUploadProgress =  (progress.bytesUploaded / progress.bytesTotal)*100
            let fractionUploaded = ( this.currentBatchUpload * this.batchValue)
            this.uploadProgress = Math.min(fractionUploaded + ( (currentUploadProgress/100) * this.batchValue), 100)
            console.log(this.uploadProgress)
        })
    }

    getProgess(){
        if(this.zipProgress>=100 && this.uploadProgress >= 100) this.onUploadDone()
        return{
            uploadProgress : Math.round(this.uploadProgress),
            zipProgress : Math.round(this.zipProgress)
        }
    }

    async startUpload(){
        await this.compressNextBatch()
        await this.compressNextBatch()
    }

    buildBatches(){
        this.batches = []
        this.currentBatchZip = 0
        this.currentBatchUpload = 0

        let index = 0
        do{
            
            index = this.makeBatch(index)
            console.log(index)

        }while( index < (this.files.length ) )

        this.batchValue = 100 / this.batches.length

    }

    makeBatch(index){
        let cummulativeSize = 0
        let batch = []
        while( cummulativeSize < 50000000 && index < this.files.length ){
            cummulativeSize = cummulativeSize + this.files[index].size
            batch.push(this.files[index])
            index = ++index
        }
        console.log(cummulativeSize)
        this.batches.push(batch)
        return index

    }

    async compressNextBatch(){
        console.log('Compressing batch'+this.currentBatchZip)
        if (this.currentBatchZip < this.batches.length) {
            let blobZip = await this.zipFiles(this.batches[this.currentBatchZip])
            this.startUploadBatch(blobZip, this.currentBatchZip)
            this.currentBatchZip = ++this.currentBatchZip
            
        }else{
            console.log('uploadFinished')
        }

        
    }

    startUploadBatch(blobZip, batchNumber){
        this.uppy.addFile(
            {
                name: 'uploadBatch'+batchNumber+'.zip', // file name
                type: 'application/zip', // file type
                data: blobZip // file blob
            }
        )
        this.uppy.upload()
    }


    async zipFiles(files){

        let jszip = new JSZip();
        for (let file of files){
            let dicomFile = new DicomFile(file)
            await dicomFile.readDicomFile()
            dicomFile.anonymise()
            jszip.file(dicomFile.getFilePath(), dicomFile.byteArray);
        }

        let uintarray = await jszip.generateAsync(
            // Zipping options
            {
                type: "uint8array",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 3,
                    streamFiles: true
                }
            },
            // Callback on update
            (metadata) => {
                let fractionZipped = ( this.currentBatchZip * this.batchValue)
                this.zipProgress = Math.min( (fractionZipped + (metadata.percent/100) * this.batchValue), 100)
            }
        )
        let zipBlob = new Blob([uintarray], { type: 'application/zip' });
        return zipBlob

    }

}