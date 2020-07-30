import DicomFile from './DicomFile'
import JSZip from 'jszip'
const EventEmitter = require('events').EventEmitter;

export default class DicomBatchUploader extends EventEmitter {

    uploadProgress=0
    zipProgress=0

    constructor (uppy, idVisit, files) {
        super()
        this.uppy = uppy
        this.files = files
        this.idVisit = idVisit
        this.timeStamp = Date.now()
        this.buildBatches()

        this.uppy.on('upload-success', async (file, response) => {
            this.currentBatchUpload = ++this.currentBatchUpload
            let fractionUploaded = ( this.currentBatchUpload * this.batchValue)
            this.uploadProgress = Math.min(fractionUploaded , 100)
            this.emitProgress()
            await this.batchesIterator.next()
        })

    }

    emitProgress(){
        this.emit('batch-progress', Math.round(this.zipProgress), Math.round(this.uploadProgress) )
        if(this.zipProgress>=100 && this.uploadProgress >= 100) {
            this.emit('batch-upload-done', this.timeStamp, this.files.length)
        }

    }

    async startUpload(){
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

    /**
     * Generator generating subzips of the bactch
     */
    buildNextZip = async function*(){

        let index = 0
        for (let batch of this.batches){
            index = ++index
            let zipBlob = await this.zipFiles(batch, index)
            this.uppy.addFile(
                {
                    name: this.timeStamp+'_'+this.idVisit+'_'+index+'_'+this.batches.length+'.zip', // file name
                    type: 'application/zip', // file type
                    meta: {
                        //add metadata
                        idVisit : this.idVisit,
                        timeStamp : this.timeStamp,
                        zipNumber : index,
                        numberOfZips : this.batches.length,
                        dicomFiles : batch.length,
                        totalDicomFiles :  this.files.length
                    },
                    data: zipBlob // file blob
                }
            )

            yield true

        }

        return

    }


    async zipFiles(files, index){

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
        , (progress)=>{ 
            let fractionZipped = (index-1) * this.batchValue
            let currentZipProgress = (this.batchValue * progress.percent)/100
            this.zipProgress = Math.min( (fractionZipped + currentZipProgress)  , 100)
            this.emitProgress()
           
        })
        let zipBlob = new Blob([uintarray], { type: 'application/zip' });
        return zipBlob

    }

}