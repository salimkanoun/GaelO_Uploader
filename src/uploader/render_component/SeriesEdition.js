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
import { Button, Form, Row, Col } from 'react-bootstrap'
import DicomRTEdition from './DicomRTEdition'

export default class SeriesEdition extends Component {

    state = {
        validated: false,
        patientWeight: '',
        patientSize: '',
        seriesDescription: '',
        newROINames: {}
    }


    componentDidMount = () => {
        this.setState({
            patientWeight: this.props.editions.patientWeight,
            patientSize: this.props.editions.patientSize,
            seriesDescription: this.props.editions.seriesDescription
        })
    }

    handleChanges = (event) => {
        let name = event.target.name
        this.setState({ [name]: event.target.valueAsNumber || event.target.value })
    }

    onNameChange = (roiNumber, newName) => {
        this.setState((state) => {
            state.newROINames[roiNumber] = newName
            return state
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.onValidateEdition(this.state)
        this.setState({ validated: true })
    }

    render = () => {
        return (
            <>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}  >
                    <Row>
                        <Col>
                            <Form.Label>Patient Weight (Kg)</Form.Label>
                        </Col>
                        <Col className="text-center">
                            {this.props.patientWeight}
                        </Col>
                        <Col>
                            <Form.Control type="number" min={0} name="patientWeight" onChange={this.handleChanges} value={this.state.patientWeight} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <Form.Label>Patient Size (m)</Form.Label>
                        </Col>
                        <Col className="text-center">
                            {this.props.patientSize}
                        </Col>
                        <Col>
                        <Form.Control type="number" min={0} max={3} step={0.1} name="patientSize" onChange={this.handleChanges} value={this.state.patientSize} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <Form.Label>Series Description</Form.Label>
                        </Col>
                        <Col className="text-center">
                            {this.props.seriesDescription}
                        </Col>
                        <Col>
                        <Form.Control type="text" name="seriesDescription" onChange={this.handleChanges} value={this.state.seriesDescription} />
                        </Col>
                    </Row>

                    {
                        this.props.modality === "RTSTRUCT" ?
                            <DicomRTEdition onChange={this.onNameChange} 
                                options = {this.props.options} 
                                structureSetROISequence = {this.props.structureSetROISequence}
                                editedStructureSetROI = {this.props.editions.structureSetROISequence != null ? this.props.editions.structureSetROISequence : {} } />
                            :
                            null
                    }

                    <div className="float-right">
                        <Button variant="primary" type="submit">
                            Validate
                        </Button>
                    </div>
                </Form>

            </>
        )
    }

}