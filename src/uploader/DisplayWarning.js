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
                    console.log(this.props.mySeries[row.objectID])
                }} />
            ),
        },
    ]

    /*Build the tab rows according to the type of object*/
    buildRow() {
        if (this.props.type === 'studies') {
            let rows = []
            this.props.studies.forEach(
                series => { rows.push({ series: series.warnings }) })
            return rows
        } else if (this.props.type === 'series') {
            let rows = []
            this.props.object.forEach((object) => {
                rows.push(...object.getArrayWarnings())
            })
            rows = [...rows]
            return rows
        }

    }

    checkObjectValidation(rowID) {
        this.state.rows[rowID](

        )
        this.setState((state) => { return { rows: !state.rows[rowID] } })
    }

    render() {
        if (this.props.object !== null) {
            return (
                 null
            )
        } else {
            return null;
        }
    }
}

/*<BootstrapTable
                    keyField='key'
                    classes="table table-borderless"
                    bodyClasses="du-warnings"
                    headerClasses="du-warnings th"
                    data={this.props.series}
                    columns={this.columns}
                />
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