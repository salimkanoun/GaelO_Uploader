import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next'

import { connect } from 'react-redux';
import { updateWarningSeries } from './actions/Warnings'
import { updateWarningStudy } from './actions/StudiesSeries'
import { setUsedVisit } from './actions/Visits'

import ButtonIgnore from './render_component/ButtonIgnore'

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
            dataField: 'idVisit',
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
                        else if (this.props.type === 'study') {
                            if (this.props.multiUpload && row.idVisit !== undefined) this.props.setUsedVisit(row.idVisit, this.props.selectedStudy, !row.dismissed)
                            this.props.updateWarningStudy(row, row.studyInstanceUID)
                        }
                            
                    }}
                />
            ),
        },
    ]

    /**
     * Get warning status of selected row 
     */
    getWarningStatus(row) {
        if (this.props.type === 'study')
            return this.props.studies[row.studyInstanceUID].warnings[row.key].dismissed
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
                    for (let i in this.props.studies[this.props.selectionID].warnings) {
                        rows.push({ studyInstanceUID: this.props.selectionID, ...this.props.studies[this.props.selectionID].warnings[i] })
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
        selectedStudy: state.DisplayTables.selectedStudy,
        studies: state.Studies.studies,
        warningsSeries: state.Warnings.warningsSeries
    }
}
const mapDispatchToProps = {
    updateWarningSeries,
    updateWarningStudy,
    setUsedVisit
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayWarning)