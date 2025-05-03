import React, { useEffect, useState } from "react";
import { AppHeader4 } from "./AppHeader";
import { useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Box, Button, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import logo from './mills_logo.png';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import RowCalc3 from "./RowCalc3";

const Production = (props) => {
    const [tableData, setTableData] = useState([{
        key: '1',
        OE: "", SDE: "", Count: "", Colour: "", ActualCount: "", No_of_Rotors: "", Delivery: "", Hours: "", Actual_Pro: "", Eff: "", Target: ""
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

    const addNewRow = () => {

        setTableData((prev) => {
            return ([...prev, {
                key: lastKey + 1
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
    const round = (value, exp) => {
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
            const side =obj.SDE==1?"Left":"Right";
            return [index + 1, obj.OE, side, obj.Count,obj.Colour,obj.ActualCount,obj.No_of_Rotors,obj.Delivery,obj.Hours,round(obj.Target,2),obj.Actual_Pro,round(obj.Eff,2)+"%"]
        })

        const doc = new jsPDF()

        doc.addImage(logo, 'png', 13, 10, 44, 20)
        doc.setTextColor(0, 51, 153)
        doc.setFontSize(8)
        doc.text(`Date:  ${date.format('DD/MM/YYYY')}`, 60, 15);
      
        // Or use javascript directly:
        autoTable(doc, {
            head: [['Index','OE', 'Side', 'Count', 'Colour','Actual Count','No of rotors','Delivery','Hours','Target',"Actual Production","Efficiency"]],
            theme: 'grid',
            styles: { fontStyle: 'bold', fontSize: 8 },
            body: [
                ...tableContent
            ],
            startY: 30
        })


        doc.save(`A_Percentage_${date.format('DD_MM_YYYY')}.pdf`)

    };



    return <>
        <Box >
            <AppHeader4 lastKey={lastKey} addNewRow={addNewRow} {...props} />

            <div ref={pdfRef} style={{ position: 'fixed', top: '70px', left: '0px', backgroundColor: '#ffff', overflowY: 'auto', height: 'calc(100vh - 130px)' }} >
                <Table stickyHeader aria-label="simple table" size="small"  >
                    <TableHead  >
                        <TableRow>
                            <TableCell sx={{ width: '3%', padding: '0px' }} align="center"><Typography variant='body1'></Typography></TableCell>
                            <TableCell sx={{ width: '90%' }} align="center"><Typography variant='body1'>Inputs</Typography></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            tableData.map((r, index) => {
                                return <RowCalc3 rowData={r} key={r.key} deleteRow={deleteRow} handleChange={handleChange} index={index} />
                            })
                        }
                    </TableBody>
                </Table>

                <div style={{ display: 'flex', margin: '20px', gap: '16px', justifyContent: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="date" focused format='DD/MM/YYYY'
                            value={date}
                            onChange={(newdate) => setDate(newdate)}
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

export default Production