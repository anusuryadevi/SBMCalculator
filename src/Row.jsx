import React from 'react';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
const Row = (props) => {
    const { deleteRow, handleChange } = props
    const { rowData } = props
    const { key, count, strength, csp } = rowData
    const handleChangeLocal = (key, obj) => {
        let temp = {
            ...obj,
            csp: obj.count * obj.strength
        }
        handleChange(key, temp)
    }

    const isValid =(value) =>{
        return value ? false : true
    }

    return <>
        <TableRow key={key}>
            <TableCell sx={{width:'30%'}}>
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
                    error = {isValid(count)}
                />
            </TableCell>
            <TableCell >
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
                    error = {isValid(strength)}
                />
            </TableCell>
            <TableCell>
                <TextField
                    id="csp"
                    label=""
                    value={csp}
                    disabled
                    size="small"
                />
            </TableCell>
            <TableCell sx={{padding:'0px'}}>
                <IconButton aria-label="delete" size="large" sx={{padding:'0px'}} color='error' onClick={(e) => {
                    deleteRow(key)
                }}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </TableCell>
        </TableRow>

    </>
}

export default Row