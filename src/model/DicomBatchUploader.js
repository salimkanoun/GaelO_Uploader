import DicomFile from './DicomFile'

const JSZip = require('jszip')


export default class DicomBatchUploader {

    zip = {}
    uploadProgress=0
    zipProgress=0

    constructor (uppy, files, onUploadDone) {
        this.uppy = uppy
        this.files = files
        this.onUploadDone = onUploadDone
        this.buildBatches()
        
        this.uppy.on('upload-success', async (file, response) => {
            this.currentBatchUpload = ++this.currentBatchUpload
            let fractionUploaded = ( this.currentBatchUpload * this.batchValue)
            this.uploadProgress = Math.min(fractionUploaded , 100)
            //SK MODIF POUR PREPARER LE SUIVANT QUAND UN UPLOAD ATTEINT 80% ?
            await this.batchesIterator.next()
        })

    }

    getProgress(){
        if(this.zipProgress>=100 && this.uploadProgress >= 100) this.onUploadDone()
        return{
            uploadProgress : Math.round(this.uploadProgress),
            zipProgress : Math.round(this.zipProgress)
        }
    }

    async startUpload(){
        //SK Arrive pas a preload car event sucess peut survenir avant fin du zip
        //Si pas de préload on peut restaurer plus de progressivite dans le progress
        await this.batchesIterator.next()
        await this.batchesIterator.next()
    }

    buildBatches(){
        this.batches = []
        this.currentBatchZip = 0
        this.currentBatchUpload = 0

        let index = 0
        do{
            index = this.makeBatch(index)
        }while( index < this.files.length )

        this.batchesIterator = this.buildNextZip()
        this.batchValue = 100 / this.batches.length

    }

    makeBatch(index){
        let cummulativeSize = 0
        let batch = []
        while( cummulativeSize < 15000000 && index < this.files.length ){
            cummulativeSize = cummulativeSize + this.files[index].size
            batch.push(this.files[index])
            index = ++index
        }
        this.batches.push(batch)
        return index

    }

    buildNextZip = async function*(){

        let index = 0
        for (let batch of this.batches){
            index = ++index
            let zipBlob = await this.zipFiles(batch)
            this.uppy.addFile(
                {
                    name: 'uploadBatch'+index+'.zip', // file name
                    type: 'application/zip', // file type
                    data: zipBlob // file blob
                }
            )

            let fractionZipped = index * this.batchValue
            this.zipProgress = Math.min( fractionZipped , 100)

            yield true


        }

        return

        
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
            }
        )
        let zipBlob = new Blob([uintarray], { type: 'application/zip' });
        return zipBlob

    }

}