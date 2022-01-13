import React, { useState } from 'react'
import EmployeeForm from "./EmployeeForm";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../../components/useTable";
import * as employeeService from "../../services/employeeService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import Popup from "../../components/Popup";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        left: '1px'
    }
}))


const headCells = [
    { id: 'Budgetstatus', label: 'Budget Status' },
    { id: 'Styleno', label: 'Style no' },
    { id: 'season', label: 'Season' },
    { id: 'IONO', label: 'IONO' },
    { id: 'Buyername', label: 'Buyer Name' },
    { id: 'ordqty', label: 'Ord. Qty' },
    { id: 'uom', label: 'UOM' },
    { id: 'shipqty', label: 'Ship Qty' },
    { id: 'yarnstatus', label: 'Yarn Status' },
    { id: 'fabricstatus', label: 'Fabric Status' },
    { id: 'accstatus', label: 'Acc.Status' },
    { id: 'cmt', label: 'CMT' },  
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Employees() {

    const classes = useStyles();
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState(employeeService.getAllEmployees())
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [openPopup, setOpenPopup] = useState(false)

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.fullName.toLowerCase().includes(target.value))
            }
        })
    }

    const addOrEdit = (employee, resetForm) => {
        if (employee.id == 0)
            employeeService.insertEmployee(employee)
        else
            employeeService.updateEmployee(employee)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        setRecords(employeeService.getAllEmployees())
    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    return (
        <>
            <PageHeader
                title="Budget Entry"
                subTitle="Budget-Entry Screen"
                icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>

                <Toolbar>
                        <Controls.Button
                        text="Params"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        className={classes.newButton}
                        onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item =>
                                (<TableRow key={item.id}>
                                    <TableCell>{item.Budgetstatus}</TableCell>
                                    <TableCell>{item.Styleno}</TableCell>
                                    <TableCell>{item.season}</TableCell>
                                    <TableCell>{item.IONO}</TableCell>
                                    <TableCell>{item.Buyername}</TableCell>
                                    <TableCell>{item.ordqty}</TableCell>
                                    <TableCell>{item.uom}</TableCell>
                                    <TableCell>{item.shipqty}</TableCell>
                                    <TableCell>{item.yarnstatus}</TableCell>
                                    <TableCell>{item.fabricstatus}</TableCell>
                                    <TableCell>{item.accstatus}</TableCell>
                                    <TableCell>{item.cmt}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                            color="primary"
                                            onClick={() => { openInPopup(item) }}>
                                            <EditOutlinedIcon fontSize="small" />
                                        </Controls.ActionButton>
                                        <Controls.ActionButton
                                            color="secondary">
                                            <CloseIcon fontSize="small" />
                                        </Controls.ActionButton>
                                    </TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Employee Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <EmployeeForm
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit} />
            </Popup>
        </>
    )
}
