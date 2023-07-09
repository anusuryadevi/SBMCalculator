import React from 'react';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
const RowCalc2 = (props) => {
    const { deleteRow, handleChange, index } = props
    const { rowData } = props
    const { key, cane, caneMinus1, canePlus1 } = rowData
    const handleChangeLocal = (key, obj) => {
        handleChange(key, obj)
    }

    const isValid = (value) => {
        return value ? false : true
    }
    const cellStyle = {
        paddingLeft : '6px',
        paddingRight: '6px',
    }
    return <>
        <TableRow key={key}>
            <TableCell sx={{ ...cellStyle,width: '5%', padding: '0px' }}>
              <Typography variant='subtitle2' sx={{display:'flex',justifyContent:'center'}}>  {index+1} </Typography>
            </TableCell>
            <TableCell sx={{  ...cellStyle, width: '30%' }}>
                <TextField
                    type='number'
                    id="cane"
                    label=""
                    value={cane}
                    size="small"
                    onChange={(e) => handleChangeLocal(key, {
                        ...rowData,
                        cane: parseFloat(e.target.value)
                    })}
                    error={isValid(cane)}
                />
            </TableCell>
            <TableCell sx={{...cellStyle}} >
                <TextField
                    type='number'
                    id="caneMinus1"
                    label=""
                    value={caneMinus1}
                    size="small"
                    onChange={(e) => handleChangeLocal(key, {
                        ...rowData,
                        caneMinus1: parseFloat(e.target.value)
                    })}
                    error={isValid(caneMinus1)}
                />
            </TableCell>
            <TableCell sx={{...cellStyle}}>
            <TextField
                    type='number'
                    id="canePlus1"
                    label=""
                    value={canePlus1}
                    size="small"
                    onChange={(e) => handleChangeLocal(key, {
                        ...rowData,
                        canePlus1: parseFloat(e.target.value)
                    })}
                    error={isValid(canePlus1)}
                />
            </TableCell>
            <TableCell sx={{...cellStyle, padding: '0px', width:'5%' }}>
                <IconButton aria-label="delete" size="large" sx={{ padding: '0px' }} color='error' onClick={(e) => {
                    deleteRow(key)
                }}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </TableCell>
        </TableRow>
        

    </>
}

export default RowCalc2