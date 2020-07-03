const { Plugin } = require('@uppy/core')
const JSZip = require('jszip')
const DicomFile = require('./DicomFile')

export default class UppyDicomPlugin extends Plugin {

    constructor (uppy, opts) {
        super(uppy, opts)
        this.id = opts.id || 'MyPlugin'
    }

    buildBatches(fileIDs){
        this.batches = []
        this.currentBatch = 0
        while(fileIDs.length) {
            this.batches.push(fileIDs.splice(0,10))
        }

    }

    async compressNextBatch(){
        if(this.batches.length >0){
            let blobZip = await this.zipFiles(this.batches[0])
            this.batches[0].forEach((file) =>{
                this.uppy.removeFile(file.id)
            })
            this.batches.splice(0,1)

            this.uppy.addFile(
                {
                    name: 'test.zip', // file name
                    type: 'application/zip', // file type
                    data: blobZip// file blob
                }
            )

        }else{
            //Fin upload
        }
        
    }

    prepareUpload (fileIDs) {

        let promise = new Promise(async (resolve, reject)=>{
            this.buildBatches()
            await this.compressNextBatch()
            await this.compressNextBatch()
            resolve()

        })
        return promise
    }


    async zipFiles(files){

        let jszip = new JSZip();
        for (let file in files){
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
                //this.v.zippingProgress[indexStudyToUpload] = metadata.percent;
            }
        )
        let zipBlob = new Blob([uintarray], { type: 'application/zip' });
        return zipBlob

    }

    async uploadPostProcessor(){
        await this.compressNextBatch()

    }

    install () {
        this.uppy.addPreProcessor(this.prepareUpload)
        this.uppy.addPostProcessor(this.uploadPostProcessor)
    }

    uninstall () {
        this.uppy.removePreProcessor(this.prepareUpload)
        this.uppy.removePostProcessor(this.uploadPostProcessor)
    }
}