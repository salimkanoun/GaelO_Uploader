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

export default class SeriesEdition extends Component {


    render = () => {
        console.log(this.props.seriesDetails)
        return (
            
            <>
                <Form>
                    <Form.Group >
                        <Form.Label>Patient Weight</Form.Label>
                        <Form.Control defaultValue={this.props.seriesDetails.patientWeight} type="number" label="Check me out" />
                    </Form.Group>

                    <Form.Group >
                        <Form.Label>Patient Height</Form.Label>
                        <Form.Control defaultValue={this.props.seriesDetails.patientHeight} type="number" />
                    </Form.Group>

                    <Form.Group >
                        <Form.Label>Series Description</Form.Label>
                        <Form.Control type="text" defaultValue={this.props.seriesDetails.seriesDescription} label="Check me out" />
                    </Form.Group>

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