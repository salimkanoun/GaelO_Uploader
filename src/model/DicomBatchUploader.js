import DicomFile from './DicomFile'

const JSZip = require('jszip')


export default class DicomBatchUploader {

    constructor (uppy, files) {
        this.uppy = uppy
        this.files = files
        this.buildBatches()

        this.uppy.on('upload-success', (file, response) => {
            //SK ou lancer quand prog >10%
            this.compressNextBatch()
            this.currentBatchUpload = ++this.currentBatchUpload
            
        })

        this.uppy.on('upload-progress', (file, progress) => {
            this.currentUploadProgress =  (progress.bytesUploaded / progress.bytesTotal)*100
            console.log('uploadProgress' + this.currentUploadProgress)
        })
    }

    startUpload(){
        this.compressNextBatch()
    }

    buildBatches(){
        this.batches = []
        this.currentBatchZip = 0
        this.currentBatchUpload = 0
        while(this.files.length) {
            this.batches.push(this.files.splice(0,10))
        }

    }

    async compressNextBatch(){
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
        console.log(files)
        let jszip = new JSZip();
        for (let file of files){
            console.log(file)
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
                this.currentZipProgress = metadata.percent;
                console.log(this.currentZipProgress)
            }
        )
        let zipBlob = new Blob([uintarray], { type: 'application/zip' });
        return zipBlob

    }

}