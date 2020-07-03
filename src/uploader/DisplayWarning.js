import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next'
import ButtonIgnore from './render_component/ButtonIgnore'
export default class DisplayWarning extends Component {

    state = {
        rows: []
    }
    constructor(props) {
        super(props)
        this.rowsLength = Object.keys(this.state.rows).length
        this.onClick = this.onClick.bind(this)
    }

    onClick(id, ignored) {
        this.setState(state => {
            state.forEach(row => {
                if (row.rowName === id) row[id]['valid'] = ignored
            })
        })
        this.checkObjectValidation(id)
    }

    columns = [
        {
            dataField: 'id',
            isDummyField: true,
            hidden: true,
        },
        {
            dataField: 'warning',
            text: 'Warnings',
        },
        {
            dataField: 'ignoreButton',
            text: '',
        },
    ]

    /*Build the tab rows according to the type of object*/
    buildRow() {
        if (this.props.type === 'studies') {
            let rows = []
            this.props.object.forEach(
                series => { rows.push({ series: series.warnings }) })
            return rows
        } else if (this.props.type === 'series') {
            let rows = []
            console.log(this.props.object)
            this.props.object.forEach(
                series => { rows.push({ series: series.warnings }) })
            return rows
        }

    }

    checkObjectValidation(rowID) {
        this.state.rows[rowID](

        )
        this.setState((state) => { return { rows: !state.rows[rowID] } })
    }

    render() {
        if (this.props.loaded) {
            return (
                <BootstrapTable
                    keyField='id'
                    classes="table table-borderless"
                    bodyClasses="du-warnings"
                    headerClasses="du-warnings th"
                    data={this.buildRow()}
                    columns={this.columns}
                />
            )
        } else {
            return null;
        }
    }
}