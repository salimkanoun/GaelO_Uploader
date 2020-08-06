/**
 Copyright (C) 2018-2020 KANOUN Salim
 This program is free software; you can redistribute it and/or modify
 it under the terms of the Affero GNU General Public v.3 License as published by
 the Free Software Foundation;
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 Affero GNU General Public Public for more details.
 You should have received a copy of the Affero GNU General Public Public along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

import React, { Component } from 'react'
import Badge from 'react-bootstrap/Badge'
import IgnoredFilesPanel from './IgnoredFilesPanel'

export default class ParsingDetails extends Component {

  state ={
    showIgnoredFiles : false
  }

  constructor(props){
    super(props)
    this.toogleShowIgnoredFile = this.toogleShowIgnoredFile.bind(this)
  }

  toogleShowIgnoredFile(){
    this.setState( (state) => {return {showIgnoredFiles : !state.showIgnoredFiles}} )

  }

  render () {
    return (
      <>
        <Badge variant='secondary'>{this.props.fileLoaded} File(s) loaded</Badge>
        <Badge variant='success'>{this.props.fileParsed} File(s) parsed</Badge>
        <Badge variant='warning' className='du-ignored-badge' onClick={this.toogleShowIgnoredFile}>{Object.keys(this.props.dataIgnoredFiles).length} File(s) ignored (Click to show)</Badge>
        <IgnoredFilesPanel display={this.state.showIgnoredFiles} closeListener={this.toogleShowIgnoredFile} dataIgnoredFiles={this.props.dataIgnoredFiles} />
      </>
    )
  }
}
