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
        cspRes,
        countMin,
        countMax,
        cspMin,
        cspMax } = props.result
    const cellStyle = {
        paddingLeft: '6px',
        paddingRight: '6px',
    }


    return <>
      <TableRow>
            <TableCell sx={{ ...cellStyle, width: '5%', padding: '0px' }} />

            <TableCell sx={{ ...cellStyle }}>
            <TextField label="Min Count" color="secondary" focused value={countMin} />
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
                <TextField label="Avg Strength" color="secondary" focused value={strengthMean} />
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
                <TextField label="Min CSP" color="secondary" focused value={cspMin} />
            </TableCell>
        </TableRow>
          <TableRow>
            <TableCell sx={{ ...cellStyle, width: '5%', padding: '0px' }} />

            <TableCell sx={{ ...cellStyle }}>
            <TextField label="Max Count" color="secondary" focused value={countMax} />
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
              
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
                <TextField label="Max CSP" color="secondary" focused value={cspMax} />
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell sx={{ ...cellStyle, width: '5%', padding: '0px' }} />

            <TableCell sx={{ ...cellStyle }}>
                <TextField label="Avg Count" color="secondary" focused value={countMean} />
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
                
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
                <TextField label="Avg CSP" color="secondary" focused value={cspMean} />
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell sx={{ ...cellStyle, width: '5%', padding: '0px' }} />
            <TableCell sx={{ ...cellStyle }}>
                <TextField label="Range Count" color="secondary" focused value={countDev} />
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
                
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
                <TextField label="Range CSP" color="secondary" focused value={cspDev} />
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell sx={{ ...cellStyle, width: '5%', padding: '0px' }} />
            <TableCell sx={{ ...cellStyle }}>
                <TextField label="CV Count" color="secondary" focused value={countRes} />
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
               
            </TableCell>
            <TableCell sx={{ ...cellStyle }}>
                <TextField label="CV CSP" color="secondary" focused value={cspRes} />
            </TableCell>
        </TableRow>
    </>
}

export default ResultRows