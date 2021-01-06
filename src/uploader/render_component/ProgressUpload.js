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
import ProgressBar from 'react-bootstrap/ProgressBar'
import Button from 'react-bootstrap/Button'
import { Col, Row } from 'react-bootstrap'
import PauseIcon from '../../assets/images/pauseCog'
import ResumeIcon from '../../assets/images/resumeCog'

export default class ProgressUpload extends Component {

  getActionButton = () => {

    if (this.props.isUploading) {
      return <Button variant='warning' onClick={this.props.onPauseClick} disabled={!this.props.isUploading}>
        {this.props.isPaused ? <ResumeIcon/> : <PauseIcon />}
      </Button>
    } else {
      return <Button variant='primary' onClick={this.props.onUploadClick} disabled={this.props.disabled}> Upload </Button>
    }

  }

  render = () => {
    return (
      <Row>
        <Col md='auto'>
          {this.getActionButton()}
        </Col>
        <Col>
          {this.props.multiUpload ? <ProgressBar variant='success' now={this.props.studyProgress} max={this.props.studyLength} label={'Study ' + this.props.studyProgress + '/' + this.props.studyLength} /> : null}
          <ProgressBar variant='info' now={this.props.zipPercent} label='Zip' max={100} />
          <ProgressBar className="mb-3" striped animated variant='success' now={this.props.uploadPercent} label={`Upload ${this.props.uploadPercent}%`} max={100} />
        </Col>
      </Row>
    )

  }
}
