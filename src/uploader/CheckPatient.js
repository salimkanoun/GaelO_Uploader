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
import Modal from 'react-bootstrap/Modal'
import BootstrapTable from 'react-bootstrap-table-next';
import ButtonIgnore from './render_component/ButtonIgnore'
import Button from 'react-bootstrap/Button'

export default class CheckPatient extends Component {

    state = {
        rows: []
    }

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    async componentDidMount() {
        await (this.props.currentStudy.length !== 0)
        console.log(this.props.currentStudy)
        this.generateRows()
        
    }


    columns = [
        {
            dataField: 'rowName',
            text: '',
        },
        {
            dataField: 'expectedStudy',
            text: 'Expected',
        },
        {
            dataField: 'currentStudy',
            text: 'Current',
        },
        {
            dataField: 'ignoreButton',
            text: '',
        },
        {
            dataField: 'valid',
            hidden: true
        }
    ]

    onClick(id, ignored) {
        this.setState(state => {
            state.forEach(row => {
                if (row.rowName === id) row[id]['valid'] = ignored
            })

        })
    }

    checkRow(expected, current) {
        if (expected === '' || expected === undefined) {
            return true
        } else if (expected === current) {
            return true
        } else {
            return false
        }
    }

    generateRows() {
        console.log('Generating rows...')
        let labels = ['First Name', 'Last Name', 'Birth Date', 'Sex', 'Acquisition Date']
        let keys = ['firstName, lastName', 'birthDate', 'sex', 'acquisitionDate']
        let currentStudy = this.props.currentStudy
        let studyID = currentStudy['studyUID']
        let expectedStudy = this.props.expectedStudy
        for (let i in labels) {
            this.setState( {rows: [...this.state.rows, { rowName: labels[i],
                    expectedStudy: expectedStudy[keys[i]],
                    currentStudy: currentStudy[keys[i]],
                    ignoreButton: <ButtonIgnore id={labels[i]} onClick={this.onClick} />,
                    valid: this.checkRow(expectedStudy[keys[i]], currentStudy[keys[i]]) } ] } )
            }
        console.log(this.state.rows)

    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.closeListener} updatedData={null}>
                <Modal.Header class="modal-header" closeButton>
                    <Modal.Title class="modal-title" id="du-patientLongTitle">Check Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body class="modal-body" id="du-patp-comparison">
                    <p>The imported patient informations do not match with the ones in the server. We let you check these informations below:</p>
                    <BootstrapTable
                        keyField='studyUID'
                        classes="table table-borderless"
                        bodyClasses="du-studies-tbody"
                        headerClasses="du-studies th"
                        rowClasses="du-studies td"
                        data={this.state.rows}
                        columns={this.columns}
                        selectRow={this.selectRow}
                    />
                    <p>If you want to force the upload you may have to ignore all the warnings.</p>
                </Modal.Body>
                <Modal.Footer class="modal-footer">
                    <Button id="du-patp-btn-confirm" type="button" onClick={this.props.validateCheckPatient(this.props.studyUID)} class="btn btn-primary" data-dismiss="modal">This is the correct patient</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}