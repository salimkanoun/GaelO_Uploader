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
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default class ProgressUpload extends Component {
  render () {
    const fullProgression = Math.max(this.props.uploadPercent, this.props.zipPercent)
    let uploadedFraction = 0
    let zippedFraction = 0
    if (this.props.zipPercent !== 0) {
      const uploadFractionOfZipped = this.props.uploadPercent / this.props.zipPercent
      uploadedFraction = fullProgression * uploadFractionOfZipped
      zippedFraction = fullProgression * (1 - uploadFractionOfZipped)
    }

    const style = this.props.multiUpload ? {} : { height: '100%' }

    return (
      <>
        <Row>
          <Col md='auto'>
            <Button variant='primary' onClick={this.props.onUploadClick}> Upload </Button>
          </Col>
          <Col>
            {this.props.multiUpload ? <ProgressBar variant='success' now={(this.props.studyProgress / this.props.studyLength) * 100} max={100} label={'Study ' + this.props.studyProgress + '/' + this.props.studyLength} /> : null}
            <ProgressBar style={style}>
              <ProgressBar striped animated variant='success' now={uploadedFraction} label={`Upload ${this.props.uploadPercent}%`} key={1} />
              <ProgressBar variant='info' now={zippedFraction} label='Zip' key={2} />
            </ProgressBar>
          </Col>
        </Row>
      </>
    )
  }
}
