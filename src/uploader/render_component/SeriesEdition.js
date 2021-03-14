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
import { Button, Form } from 'react-bootstrap'
import DicomRTEdition from './DicomRTEdition'

export default class SeriesEdition extends Component {

    state = {
        validated: false,
        patientWeight :'',
        patientSize: '',
        seriesDescription:'',
        newROIName : []
    }


    componentDidMount = () => {
        this.setState({
            patientWeight : this.props.patientWeight,
            patientSize : this.props.patientSize,
            seriesDescription : this.props.seriesDescription
        })
    }

    handleChanges = (event) => {
        let name = event.target.name
        this.setState({ [name]: event.target.valueAsNumber || event.target.value })
    }

    onNameChange = (roiNumber, newName) => {
            this.setState((state) => {
                state.newROIName[roiNumber] = newName
                return state
            }, ()=> console.log(this.state))
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.onValidateEdition(this.state)
        this.setState({ validated: true })
    }

    render = () => {
        console.log(this.props)
        return (
            
            <>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}  >
                    <Form.Group >
                        <Form.Label>Patient Weight (Kg)</Form.Label>
                        <Form.Control type="number" min={0} name="patientWeight" onChange={this.handleChanges} value = {this.state.patientWeight}/>

                    </Form.Group>

                    <Form.Group >
                        <Form.Label>Patient Size (m)</Form.Label>
                        <Form.Control type="number" min={0} max={3} step={0.1} name="patientSize" onChange={this.handleChanges} value = {this.state.patientSize}/>
                    </Form.Group>

                    <Form.Group >
                        <Form.Label>Series Description</Form.Label>
                        <Form.Control type="text" name="seriesDescription" onChange={this.handleChanges} value = {this.state.seriesDescription}/>
                    </Form.Group>

                    { 
                        this.props.modality === "RTSTRUCT" ? 
                            <DicomRTEdition onChange = {this.onNameChange} options = {[{ label: "Liver", value: "Liver" }, { label: "Head", value: "Head" }]} structureSetROISequence = {this.props.structureSetROISequence}/> 
                            : 
                            null 
                    }

                    <div className = "float-right">   
                        <Button variant="primary" type="submit">
                            Validate
                        </Button>
                    </div>
                </Form>

            </>
        )
    }

}