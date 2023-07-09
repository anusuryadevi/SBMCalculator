import React from 'react';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const ResultRows = (props) => {
    const { countMean,
        strengthMean,
        cspMean,
        countDev,
        cspDev,
        countRes,
        cspRes } = props.result
    

       
    return <>
        <TableRow>
            <TableCell>
                <TextField label="Avg Count" color="secondary" focused value={countMean} />
            </TableCell>
            <TableCell>
                <TextField label="Avg Strength" color="secondary" focused  value={strengthMean} />
            </TableCell>
            <TableCell>
                <TextField label="Avg CSP" color="secondary" focused value={cspMean} />
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell>
                <TextField label="Stdev" color="secondary" focused value={countDev} />
            </TableCell>
            <TableCell>

            </TableCell>
            <TableCell>
                <TextField label="Stdev" color="secondary" focused  value={cspDev} />
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell>
                <TextField label="Result" color="secondary" focused  value={countRes} />
            </TableCell>
            <TableCell>

            </TableCell>
            <TableCell>
                <TextField label="Result" color="secondary" focused  value={cspRes} />
            </TableCell>
        </TableRow>
    </>
}

export default ResultRows