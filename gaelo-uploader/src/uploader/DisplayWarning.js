import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next'

export default class DisplayWarning extends Component {

    columns = [
        {
            dataField: 'warning',
            text: 'Warnings',
        }
    ]

    buildRow() {
        let rows = []
        this.props.warnings.forEach(warning => {
            rows.push({ warning: warning.message })
        })
        return rows
    }


    render() {
        return ( 
            <BootstrapTable
                keyField='warning'
                classes="table table-borderless"
                bodyClasses="du-studies-warnings"
                headerClasses="du-studies-warnings th"
                data={this.buildRow()}
                columns={this.columns}
            />
        )
    }
}