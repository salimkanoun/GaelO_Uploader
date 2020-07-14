import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next'
import ButtonIgnore from './render_component/ButtonIgnore'
//Redux
import { connect } from 'react-redux';
import { updateWarningSeries } from './actions/StudiesSeries'
class DisplayWarning extends Component {

    columns = [
        {
            dataField: 'objectID',
            hidden: true,
        },
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
            hidden: false
        },
        {
            dataField: 'ignoreButton',
            text: '',
            formatter: (cell, row, rowIndex, extraData) => (
                <ButtonIgnore warning={this.props.series[row.objectID].warnings[row.key].dismissed} 
                onClick={async () => {
                    await this.props.updateWarningSeries(row)
                }} />
            ),
        },
    ]

    /*Build the tab rows according to the type of object*/
    buildRow() {
        if (this.props.selectionID !== undefined && this.props.selectionID !== null){
            let rows = []
            switch(this.props.type) {
                case 'studies':
                    for (let warning in this.props.studies[this.props.selectionID].warnings) {
                        rows.push(this.props.studies[this.props.selectionID].warnings[warning])
                    }
                    return rows
                case 'series':
                    let selID = this.props.selectionID
                    for (let warning in this.props.series[this.props.selectionID].warnings) {
                        rows.push({objectID: selID, ...this.props.series[this.props.selectionID].warnings[warning]})
                    }
                    return rows
            }
        } else {
            return []
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
                <BootstrapTable
                    keyField='key'
                    classes="table table-borderless"
                    bodyClasses="du-warnings"
                    headerClasses="du-warnings th"
                    wrapperClasses="table-responsive"
                    data={this.buildRow()}
                    columns={this.columns}
                />
            )
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        studies: state.Studies.studies,
        series: state.Series.series
    }
}
const mapDispatchToProps = {
    updateWarningSeries
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayWarning)