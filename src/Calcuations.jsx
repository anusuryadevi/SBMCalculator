import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Row from './Row';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
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
import { AppHeader1 } from './AppHeader';


const Calc = (props) => {
    const [coarser, setCoarser] = useState(false)
    const [tableData, setTableData] = useState([{
        key: '1',
        count: '',
        strength: '',
        csp: ''
    }])
    const [lastKey, setLastKey] = useState(1)
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
        cspMin: '',
        cspMax: ''
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

            let countDev = countMax -countMin;
            let cspDev = cspMax -cspMin;

            let countRes = (((n > 1 ? Math.sqrt(counts.map(x => Math.pow(x - countMean, 2)).reduce((a, b) => a + b, 0) / (n - 1)).toFixed(6) : 0) / countMean) * 100).toFixed(6)
            let cspRes = (((n > 1 ? Math.sqrt(csps.map(x => Math.pow(x - cspMean, 2)).reduce((a, b) => a + b, 0) / (n - 1)).toFixed(6) : 0) / cspMean) * 100).toFixed(6)

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

    }, [tableData, coarser])

    const addNewRow = () => {

        setTableData((prev) => {
            return ([...prev, {
                key: lastKey + 1,
                count: '',
                strength: '',
                csp: ''
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

    const round = (value, exp)=> {
        if (typeof exp === 'undefined' || +exp === 0)
          return Math.round(value);
      
        value = +value;
        exp = +exp;
      
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
          return NaN;
      
        // Shift
        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
      
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
      };
   
    const downloadAsPDF = () => {
        let tableContent = tableData.map((obj, index) => {
            return [index + 1, obj.count, obj.strength, round(obj.csp, 2)]
        })

        const doc = new jsPDF()

        doc.addImage(logo, 'png', 13, 10, 44, 20)
        doc.setTextColor(0, 51, 153)
        doc.setFontSize(12)
        doc.text(`Date:  ${date.format('DD/MM/YYYY')}`, 60, 15);
        doc.text(`OE:  ${oe}`, 120, 15);

        autoTable(doc, {
            theme: 'grid',
            styles: { fontStyle:'bold',fontSize: 12 },
            head: [['Sno', 'Count', 'Strength', 'CSP']],
            body: [
                ...tableContent
            ],
            startY: 30
        })

        autoTable(doc, {
            // head: [[]],
           
            styles: { fontStyle:'bold',fontSize: 15 },
            body: [
                [`Min Count:   ${result.countMin}`, `Avg Strength:   ${Math.round(result.strengthMean)}`, `Min CSP:   ${Math.round(result.cspMin)}`],
                [`Max Count:   ${result.countMax}`, '', `Max CSP:   ${Math.round(result.cspMax)}`],
                [`Avg Count:   ${round(result.countMean,2)}`, ``, `Avg CSP:   ${Math.round(result.cspMean)}`],
                [`Range Count:   ${round(result.countDev,2)}`, ``, `Range CSP:   ${Math.round(result.cspDev)}`],
                [`CV Count:   ${round(result.countRes,2)}`, ``, `CV CSP:   ${Math.round(result.cspRes)}`]
            ]
        })

        doc.save(`cv_${date.format('DD_MM_YYYY')}.pdf`)

    };
    return <>
        <Box >
            <AppHeader1 lastKey={lastKey} addNewRow={addNewRow} {...props} />

            <div ref={pdfRef} style={{ position: 'fixed', top: '70px', left: '0px', backgroundColor: '#ffff', overflowY: 'auto', height: 'calc(100vh - 130px)' }} >
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
                                return <Row rowData={r} key={r.key} deleteRow={deleteRow} handleChange={handleChange} index={index} coarser={coarser} />
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
                        <FormControlLabel
                            value="Coarser"
                            control={<Checkbox checked={coarser} onChange={() => setCoarser((prev) => !prev)} />}
                            label="Coarser"
                            labelPlacement="end"
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