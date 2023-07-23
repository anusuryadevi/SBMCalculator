import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
const Row = (props) => {
    const { deleteRow, handleChange, index, coarser,setTableData } = props
    const { rowData } = props
    const { key, count, strength, csp } = rowData
    useEffect(()=>{
       handleChangeLocal(key, rowData)
    },[coarser])
    const handleChangeLocal = (key, obj) => {
        let temp = {
            ...obj,
            csp: coarser ? obj.count * obj.strength * 2 : obj.count * obj.strength
        }
        handleChange(key, temp)
    }

    const isValid = (value) => {
        return value ? false : true
    }
    const cellStyle = {
        paddingLeft: '6px',
        paddingRight: '6px',
    }
    return <>
        <TableRow key={key}>
            <TableCell sx={{ ...cellStyle, width: '5%', padding: '0px' }}>
                <Typography variant='subtitle2' sx={{ display: 'flex', justifyContent: 'center' }}>  {index + 1} </Typography>
            </TableCell>
            <TableCell sx={{ ...cellStyle, width: '30%' }}>
                <TextField
                    type='number'
                    id="count"
                    label=""
                    value={count}
                    size="small"
                    onChange={(e) => handleChangeLocal(key, {
                        ...rowData,
                        count: parseFloat(e.target.value)
                    })}
                    error={isValid(count)}
                />
            </TableCell>
            <TableCell sx={{ ...cellStyle }} >
                <TextField
                    type='number'
                    id="strength"
                    label=""
                    value={strength}
                    size="small"
                    onChange={(e) => handleChangeLocal(key, {
                        ...rowData,
                        strength: parseFloat(e.target.value)
                    })}
                    error={isValid(strength)}
                />
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
                <TextField
                    id="csp"
                    label=""
                    value={csp}
                    disabled
                    size="small"
                />
            </TableCell>
            <TableCell sx={{ ...cellStyle, padding: '0px', width: '5%' }}>
                <IconButton aria-label="delete" size="large" sx={{ padding: '0px' }} color='error' onClick={(e) => {
                    deleteRow(key)
                }}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </TableCell>
        </TableRow>

    </>
}

export default Row