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

import React, { Component, Fragment } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default class ProgressUpload extends Component {
  render () {
    return (
      <>
        <Row>
          <Col md='auto'>
            <Button variant='primary' onClick={this.props.onUploadClick}> Upload </Button>
          </Col>
          <Col>
            <ProgressBar style={{ height: '100%' }}>
              <ProgressBar variant='success' min={0} max={100} now={this.props.uploadPercent} label={`Upload ${this.props.uploadPercent}%`} key={1} />
              <ProgressBar striped variant='info' min={0} max={100} now={this.props.zipPercent} label='Zip' key={2} />
            </ProgressBar>
          </Col>
        </Row>
      </>
    )
  }
}
