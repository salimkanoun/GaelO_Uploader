import React, {Component} from 'react'
import Dropzone from 'react-dropzone'

export default class DicomDropZone extends Component {

    state = {
        isdragging : false
    }

    constructor(props){
        super(props)
        this.dragEnter = this.dragEnter.bind(this)
        this.dragLeave = this.dragLeave.bind(this)
    }

    getClasses(){
        let classArray = ['dropzone']
        if (this.props.isParsingFiles) classArray.push('dz-parsing')
        if (this.state.isdragging) classArray.push('dz-hover')
        if (this.props.isUploading) classArray.push('dz-deactivated')
        return classArray.join(' ')
    }

    dragEnter(){
        this.setState({
            isdragging : true
        })
    }

    dragLeave(){
        this.setState({
            isdragging : false
        })
    }

    getTextMessage(){
        if(this.props.isParsingFiles ){
            return 'Parsing '+( Math.round(( (this.props.fileParsed+this.props.fileIgnored) / this.props.fileLoaded) *100) )+'%' 
        }else if(this.props.isUnzipping){
            return 'Unzipping'
        }else{
            return 'Drag\'n drop Dicom files here, or click to select folder'
        }
    }
    
    render(){
        return (
            <Dropzone onDragEnter={this.dragEnter} onDragLeave={this.dragLeave} onDrop={acceptedFiles => this.props.addFile(acceptedFiles)} >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div className={this.getClasses()} {...getRootProps()}>
                            <input directory="" webkitdirectory="" {...getInputProps()} />
                        <p> {this.getTextMessage()}</p>
                        </div>
                    </section>
                )}
            </Dropzone>
        )
    }
}