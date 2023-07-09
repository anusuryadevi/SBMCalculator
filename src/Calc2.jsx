import React, { useEffect, useState } from "react";
import { AppHeader2 } from "./AppHeader";
import { useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Row from './Row';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import logo from './mills_logo.png';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import RowCalc2 from "./RowCalc2";

const Calc2 = (props) => {
    const [tableData, setTableData] = useState([{
        key: '1',
        cane: '',
        caneMinus1: '',
        canePlus1: ''
    }])
    const [lastKey, setLastKey] = useState(1)
    const defaultResult = {
        canes: [],
        caneMinus1s: [],
        canePlus1s: [],
        caneAvg: '',
        canePlusAvg: '',
        caneMinusAvg: '',
        result: ''
    }
    const [result, setResult] = useState(defaultResult)
    const [oe, setOE] = useState('')
    const [date, setDate] = useState(dayjs())
    const pdfRef = useRef(null);
    const cellStyle = {
        paddingLeft: '6px',
        paddingRight: '6px',
    }
    const isValidRow = (row) => {
        return row.cane && row.canePlus1 && row.caneMinus1 ? true : false
    }
    useEffect(() => {
        let canes = []
        let caneMinus1s = []
        let canePlus1s = []

        tableData.forEach(row => {
            if (isValidRow(row)) {
                canes.push(row.cane)
                caneMinus1s.push(row.caneMinus1)
                canePlus1s.push(row.canePlus1)
            }
        });

        let n = canes.length
        if (n > 0) {
            let caneAvg = (canes.reduce((a, b) => a + b, 0) / n).toFixed(6)
            let canePlusAvg = (caneMinus1s.reduce((a, b) => a + b, 0) / n).toFixed(6)
            let caneMinusAvg = (canePlus1s.reduce((a, b) => a + b, 0) / n).toFixed(6)

            let result = ((caneMinusAvg - canePlusAvg) / caneAvg) * 100


            setResult({
                canes,
                caneMinus1s,
                canePlus1s,
                caneAvg,
                canePlusAvg,
                caneMinusAvg,
                result
            })
        }
        else {
            setResult(defaultResult)
        }

    }, [tableData])

    const addNewRow = () => {

        setTableData((prev) => {
            return ([...prev, {
                key: lastKey + 1,
                cane: '',
                caneMinus1: '',
                canePlus1: ''
            }])
        })
        setLastKey(lastKey + 1)
    }

    const deleteRow = (key) => {
        setTableData((prev) => {
            return prev.filter((r) => r.key !== key)
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


    const downloadAsPDF = () => {
        let tableContent = tableData.map((obj, index) => {
            return [index + 1, obj.cane, obj.caneMinus1, obj.canePlus1]
        })

        const doc = new jsPDF()

        doc.addImage(logo, 'png', 13, 10, 44, 20)
        doc.setTextColor(0, 51, 153)
        doc.setFontSize(12)
        doc.text(`Date:  ${date.format('DD/MM/YYYY')}`, 60, 15);
        doc.text(`OE:  ${oe}`, 120, 15);
        // Or use javascript directly:
        autoTable(doc, {
            head: [['Sno', 'N', 'N - 1', 'N + 1']],
            body: [
                ...tableContent
            ],
            startY: 30
        })

        autoTable(doc, {
            // head: [[]],
            body: [
                [`Avg N:   ${result.caneAvg}`, `Avg N-1:   ${result.caneMinusAvg}`, `Avg N+1:   ${result.canePlusAvg}`],
                [`Percentage:   ${result.result}`, '', ``],
            ]
        })

        doc.save(`A%_${date.format('DD_MM_YYYY')}.pdf`)

    };
    return <>
        <Box >
            <AppHeader2 lastKey={lastKey} addNewRow={addNewRow} {...props} />

            <div ref={pdfRef} style={{ position: 'fixed', top: '70px', left: '0px', backgroundColor: '#ffff', overflowY: 'scroll', height: 'calc(100vh - 130px)' }} >
                <Table stickyHeader aria-label="simple table" size="small"  >
                    <TableHead  >
                        <TableRow>
                            <TableCell sx={{ width: '5%', padding: '0px' }} align="center"><Typography variant='body1'></Typography></TableCell>
                            <TableCell sx={{ width: '30%' }} align="center"><Typography variant='body1'>N</Typography></TableCell>
                            <TableCell sx={{ width: '30%' }} align="center"><Typography variant='body1'>N - 1</Typography></TableCell>
                            <TableCell sx={{ width: '30%' }} align="center"><Typography variant='body1'>N + 1</Typography></TableCell>
                            <TableCell sx={{ width: '5%', padding: '0px' }} align="center"><Typography variant='body1'></Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            tableData.map((r, index) => {
                                return <RowCalc2 rowData={r} key={r.key} deleteRow={deleteRow} handleChange={handleChange} index={index} />
                            })
                        }
                        <TableRow>
                            <TableCell sx={{ ...cellStyle, width: '5%', padding: '0px' }} />
                            <TableCell sx={{ ...cellStyle }}>
                                <TextField label="Avg" color="secondary" focused value={result.caneAvg} />
                            </TableCell>
                            <TableCell sx={{ ...cellStyle }}>
                            <TextField label="Avg" color="secondary" focused value={result.caneMinusAvg} />
                            </TableCell>
                            <TableCell sx={{ ...cellStyle }}>
                                <TextField label="Avg" color="secondary" focused value={result.canePlusAvg} />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div style={{ display: 'flex', margin: '20px', gap: '16px', justifyContent: 'center' }}>
                    <TextField label="Percentage" color="secondary" focused value={result.result} />
                </div>
                <div style={{ display: 'flex', margin: '20px', gap: '16px', justifyContent: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="date" focused format='DD/MM/YYYY'
                            value={date}
                            onChange={(newdate) => setDate(newdate)}
                        />
                        <TextField label="OE" focused value={oe}
                            onChange={(e) => setOE(e.target.value)}
                        />
                    </LocalizationProvider>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button sx={{ margin: 'auto' }} variant='contained' onClick={(e) => {
                        downloadAsPDF()
                    }}>Download as PDF </Button>
                </div>
            </div>

        </Box>
    </>
}

export default Calc2