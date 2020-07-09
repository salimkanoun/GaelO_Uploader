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
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DisplayWarning from '../DisplayWarning'
import StudiesTab from '../StudiesTab'

export default class DisplayStudies extends Component {
  render() {
    return (
      <>
        <Container fluid>
          <span class='title'>Studies</span>
          <Row>
            <Col xs={12} md={8}>
              <StudiesTab

                validateCheckPatient={this.props.validateCheckPatient}
              />
            </Col>
            <Col xs={6} md={4}>
            <DisplayWarning type='studies'/>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}