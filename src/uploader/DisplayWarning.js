import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next'
import ButtonIgnore from './render_component/ButtonIgnore'
//Redux
import { connect } from 'react-redux';
import { updateWarningSeries } from './actions/Model'
class DisplayWarning extends Component {

    columns = [
        {
            dataField: 'key',
            isDummyField: true,
            hidden: true,
        },
        {
            dataField: 'content',
            text: 'Warnings',
        },
        {
            dataField: 'dismissed',
            hidden: true
        },
        {
            dataField: 'ignoreButton',
            text: '',
            formatter: (cell, row, rowIndex, extraData) => (
                <ButtonIgnore onClick={() => {
                    this.props.updateWarningSeries(row)
                }} />
            ),
        },
    ]

    /*Build the tab rows according to the type of object*/
    buildRow() {
        if (this.props.type === 'studies') {
            let rows = []
            for (let study in this.props.studies){
                rows.push(this.props.studies[study].warnings)

                for(let warning in this.props.studies[study]) {
                }
            }
            return rows
        } else if (this.props.type === 'series') {
            let rows = []
            for (let series in this.props.object){
                for(let warning in this.props.series[this.props.object[series]].warnings) {
                    rows.push(this.props.series[this.props.object[series]].warnings[warning])
                }
            }
            return rows        }

    }

    checkObjectValidation(rowID) {
        this.state.rows[rowID](

        )
        this.setState((state) => { return { rows: !state.rows[rowID] } })
    }

    render() {
        if (this.props.object !== null) {
            return (
                <BootstrapTable
                    keyField='key'
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

/*
*/
const mapStateToProps = state => {
    return {
        studies: state.Model.studies,
        series: state.Model.series
    }
}
const mapDispatchToProps = {
    updateWarningSeries
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayWarning)