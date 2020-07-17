import React, {Component} from 'react'
import Dropzone from 'react-dropzone'

export default class DicomDropZone extends Component {

    getClasses(){
        let classArray = ['dropzone']
        if (this.props.isParsingFiles) classArray.push('dz-parsing')
        return classArray.join(' ')
    }

    onHoverHandle(){
        console.log('hover')
    }
    
    render(){
        return (
            <Dropzone onDragEnter={this.onHoverHandle} onDrop={acceptedFiles => this.props.addFile(acceptedFiles)} >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div className={this.getClasses()} {...getRootProps()}>
                            <input directory="" webkitdirectory="" {...getInputProps()} />
                        <p> {this.props.isParsingFiles ? 'Parsing '+( Math.round(( (this.props.fileParsed+this.props.fileIgnored) / this.props.fileLoaded) *100) )+'%' : 'Drag\'n drop some files here, or click to select files'}</p>
                        </div>
                    </section>
                )}
            </Dropzone>
        )
    }
}