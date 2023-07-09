import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Row from './Row';
import { Box, Button, Typography } from '@mui/material';
import ResultRows from './ResultRows';
import { useEffect } from 'react';
import { useState } from 'react';
import logo from './mills_logo.png';
const Calc = (props) => {
    const { tableData, setTableData, lastKey, setLastKey } = props
    const defaultResult = {
        countMean: '',
        strengthMean: '',
        cspMean: '',
        countDev: '',
        cspDev: '',
        countRes: '',
        cspRes: ''
    }
    const [result, setResult] = useState(defaultResult)
    const isValidRow = (row) => {
        return row.count && row.strength ? true : false
    }
    useEffect(() => {
        let total = 0
        let counts = []
        let countAvg = 0
        let strengths = []
        let csps = []
        let strengthAvg = 0

        tableData.forEach(row => {
            if (isValidRow(row)) {
                counts.push(row.count)
                strengths.push(row.strength)
                csps.push(row.csp)
            }
        });
      
        let n = counts.length
        if (n > 0) {
            let countMean = (counts.reduce((a, b) => a + b, 0) / n).toFixed(6)
            let strengthMean = (strengths.reduce((a, b) => a + b, 0) / n).toFixed(6)
            let cspMean = (csps.reduce((a, b) => a + b, 0) / n).toFixed(6)

            let countDev = n>1? Math.sqrt(counts.map(x => Math.pow(x - countMean, 2)).reduce((a, b) => a + b, 0) / (n-1)).toFixed(6) : 0
            let cspDev = n>1 ? Math.sqrt(csps.map(x => Math.pow(x - cspMean, 2)).reduce((a, b) => a + b, 0) / (n-1)).toFixed(6) : 0

            let countRes = ((countDev / countMean) * 100).toFixed(6)
            let cspRes = ((cspDev / cspMean) * 100).toFixed(6)

            setResult({
                countMean,
                strengthMean,
                cspMean,
                countDev,
                cspDev,
                countRes,
                cspRes
            })
        }
        else {
            setResult(defaultResult)
        }

    }, [tableData])

    const addNewRow = (key) => {
        setLastKey(key)
        setTableData((prev) => {
            return ([...prev, {
                key,
                count: '',
                strength: '',
                csp: ''
            }])
        })
    }
    const deleteRow = (key) => {
        setTableData((prev) => {
            return prev.filter((r) => r.key != key)
        })
    }

    const handleChange = (key, obj) => {
        setTableData((prev) => {
            return prev.map((r) => {
                if (r.key === key) {
                    return obj
                }
                return r
            })
        })
    }
    return <>
        <Box  >
            <div style={{ display: 'flex', minWidth: 400, maxWidth: 600, padding: 15 }}>
            <Box
                        component="img"
                        sx={{ height: 40 }}
                        alt="Logo"
                        src={logo}
                    />
                <Typography variant='h6'>Calculations</Typography>
                <div style={{ marginLeft: 'auto', marginRight: '30px' }}>
                    <Button size='small' color='secondary' variant='contained' onClick={(e) => {
                        addNewRow(lastKey + 1)
                    }}
                    >Add new Row</Button>
                </div>
            </div>

            {/* <TableContainer component={Paper}> */}
            <Table sx={{ minWidth: 400, maxWidth: 600 }} aria-label="simple table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{width:'30%'}} align="center"><Typography variant='body1'>Count</Typography></TableCell>
                        <TableCell sx={{width:'30%'}} align="center"><Typography variant='body1'>Strength</Typography></TableCell>
                        <TableCell sx={{width:'30%'}} align="center"><Typography variant='body1'>CSP</Typography></TableCell>
                        <TableCell sx={{width:'10%', padding:'0px'}} align="center"><Typography variant='body1'></Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        tableData.map((r) => {
                            return <Row rowData={r} key={r.key} deleteRow={deleteRow} handleChange={handleChange} />
                        })
                    }
                    <ResultRows result={result} />
                </TableBody>
            </Table>
            {/* </TableContainer> */}
        </Box>
    </>
}

export default Calc