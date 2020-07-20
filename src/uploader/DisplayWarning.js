import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next'
import ButtonIgnore from './render_component/ButtonIgnore'
//Redux
import { connect } from 'react-redux';
import { updateWarningSeries, updateWarningStudy } from './actions/Warnings'
class DisplayWarning extends Component {

    columns = [
        {
            dataField: `${this.props.type}InstanceUID`,
            text: `${this.props.type}InstanceUID`,
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
            hidden: true
        },
        {
            dataField: 'ignoreButton',
            text: '',
            formatter: (cell, row, rowIndex, extraData) => (
                <ButtonIgnore
                    warning={this.getWarningStatus(row)}
                    onClick={() => {
                        if (this.props.type === 'series')
                            this.props.updateWarningSeries(row, row.seriesInstanceUID)
                        else if (this.props.type === 'study')
                            this.props.updateWarningStudy(row, row.studyInstanceUID)
                    }}
                />
            ),
        },
    ]

    /**
     * Get warning status of selected row 
     */
    getWarningStatus(row) {
        console.log(row)
        if (this.props.type === 'study')
            return this.props.warningsStudies[row.studyInstanceUID][row.key].dismissed
        else if (this.props.type === 'series')
            return this.props.warningsSeries[row.seriesInstanceUID][row.key].dismissed
    }

    /**
     * Build the tab rows according to the type of object
     */
    buildRow() {
        if (this.props.selectionID !== undefined && this.props.selectionID !== null) {
            let rows = []
            switch (this.props.type) {
                case 'study':
                    for (let i in this.props.warningsStudies[this.props.selectionID]) {
                        rows.push({ studyInstanceUID: this.props.selectionID, ...this.props.warningsStudies[this.props.selectionID][i] })
                    }
                    return rows
                case 'series':
                    for (let i in this.props.warningsSeries[this.props.selectionID]) {
                        rows.push({ seriesInstanceUID: this.props.selectionID, ...this.props.warningsSeries[this.props.selectionID][i] })
                    }
                    return rows
                default:
                    return []
            }
        } else {
            return []
        }

    }

    render() {
        return (
            <BootstrapTable
                keyField='key'
                classes="table table-borderless"
                bodyClasses="du-warnings"
                headerClasses="du-warnings th"
                rowClasses={rowClasses}
                wrapperClasses="table-responsive"
                data={this.buildRow()}
                columns={this.columns}
            />
        )
    }
}

const rowClasses = (row, rowIndex) => {
    if (row.dismissed) return 'du-warnings row-ignored'
    else return 'du-warnings td'
}

const mapStateToProps = state => {
    return {
        warningsStudies: state.Warnings.warningsStudies,
        warningsSeries: state.Warnings.warningsSeries
    }
}
const mapDispatchToProps = {
    updateWarningSeries,
    updateWarningStudy
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayWarning)