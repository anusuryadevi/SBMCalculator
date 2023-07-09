import * as React from 'react';
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
import ResultRows from './ResultRows';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import logo from './mills_logo.png';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const Calc = (props) => {

    const { tableData, setTableData, lastKey, setLastKey } = props
    const defaultResult = {
        counts: '',
        strengths: '',
        csps: '',
        countMean: '',
        strengthMean: '',
        cspMean: '',
        countDev: '',
        cspDev: '',
        countRes: '',
        cspRes: '',
        countMin: '',
        countMax: '',
        cspMin:'',
        cspMax:''
    }
    const [result, setResult] = useState(defaultResult)
    const [oe, setOE] = useState('')
    const [date, setDate] = useState(dayjs())
    const pdfRef = useRef(null);
    const isValidRow = (row) => {
        return row.count && row.strength ? true : false
    }
    useEffect(() => {
        let counts = []
        let strengths = []
        let csps = []

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

            let countMin = Math.min(...counts)
            let countMax = Math.max(...counts)
            let cspMin = Math.min(...csps)
            let cspMax = Math.max(...csps)

            let countDev = n > 1 ? Math.sqrt(counts.map(x => Math.pow(x - countMean, 2)).reduce((a, b) => a + b, 0) / (n - 1)).toFixed(6) : 0
            let cspDev = n > 1 ? Math.sqrt(csps.map(x => Math.pow(x - cspMean, 2)).reduce((a, b) => a + b, 0) / (n - 1)).toFixed(6) : 0

            let countRes = ((countDev / countMean) * 100).toFixed(6)
            let cspRes = ((cspDev / cspMean) * 100).toFixed(6)

            setResult({
                counts,
                strengths,
                csps,
                countMean,
                strengthMean,
                cspMean,
                countDev,
                cspDev,
                countRes,
                cspRes,
                countMin,
                countMax,
                cspMin,
                cspMax
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
            return [index + 1, obj.count, obj.strength, obj.csp]
        })

        const doc = new jsPDF()

        doc.addImage(logo,'png', 12, 10, 44, 20)
        doc.setTextColor(0, 51, 153)
        doc.setFontSize(12)
        doc.text(`Date:  ${date.format('DD/MM/YYYY')}`, 60, 15);
        doc.text(`OE:  ${oe}`, 120, 15);
        // Or use javascript directly:
        autoTable(doc, {
            head: [['Sno', 'Count', 'Strength', 'CSP']],
            body: [
                ...tableContent
            ],
            startY : 30
        })

        autoTable(doc, {
            // head: [[]],
            body: [
                [`Min Count: ${result.countMin}`, `Avg Strength: ${result.strengthMean}`,`Min CSP: ${result.cspMin}`],
                [`Max Count: ${result.countMax}`,'',`Max CSP: ${result.cspMax}`],
                [`Avg Count: ${result.countMean}`,``,`Avg CSP: ${result.cspMean}`],
                [`Range Count: ${result.countDev}`,``,`Range CSP: ${result.cspDev}`],
                [`CV Count: ${result.countRes}`,``,`CV CSP: ${result.cspRes}`]
            ]
        })

        doc.save('table.pdf')

    };
    return <>
        <Box >
            <div style={{ display: 'flex', minWidth: 400, maxWidth: 600, padding: 15, position: 'fixed', top: '0px', left: '0px', zIndex: 5, backgroundColor: '#ffff' }}>
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

            <div ref={pdfRef} style={{ position: 'fixed', top: '70px', left: '0px', backgroundColor: '#ffff', overflowY: 'scroll', height: 'calc(100vh - 106px)' }} >
                <Table stickyHeader aria-label="simple table" size="small"  >
                    <TableHead  >
                        <TableRow>
                            <TableCell sx={{ width: '5%', padding: '0px' }} align="center"><Typography variant='body1'></Typography></TableCell>
                            <TableCell sx={{ width: '30%' }} align="center"><Typography variant='body1'>Count</Typography></TableCell>
                            <TableCell sx={{ width: '30%' }} align="center"><Typography variant='body1'>Strength</Typography></TableCell>
                            <TableCell sx={{ width: '30%' }} align="center"><Typography variant='body1'>CSP</Typography></TableCell>
                            <TableCell sx={{ width: '5%', padding: '0px' }} align="center"><Typography variant='body1'></Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            tableData.map((r, index) => {
                                return <Row rowData={r} key={r.key} deleteRow={deleteRow} handleChange={handleChange} index={index} />
                            })
                        }
                        <ResultRows result={result} />
                    </TableBody>
                </Table>

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

export default Calc