import React, { useEffect, useState } from "react";
import { AppHeader3 } from "./AppHeader";
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


const TMTOTPI = (props) => {
    const [formData, setFormData] = useState({
        count: '',
        tm: '',
        speed: '',
        tpi: '',
        delivery: ''
    });

    const isValid = (value) => {
        return value ? false : true
    }
    const [oe, setOE] = useState('')
    const cellStyle = {
        paddingLeft: '6px',
        paddingRight: '6px',
    }
    const [date, setDate] = useState(dayjs())

    function handleChange(e) {
        const tempData = { ...formData, [e.target.name]: e.target.value }
        setFormData(tempData);
        if (tempData.count > 0 && tempData.tm > 0 && tempData.speed > 0) {
            tempData.tpi = (Math.sqrt(tempData.count) * tempData.tm).toFixed(5);
            tempData.delivery = (tempData.speed / tempData.tpi / 39.5).toFixed(5);
        } else {
            tempData.tpi = '';
            tempData.delivery = '';
        }
        setFormData(tempData);
    }

    const downloadAsPDF = () => {

        const doc = new jsPDF()

        doc.addImage(logo, 'png', 13, 10, 44, 20)
        doc.setTextColor(0, 51, 153)
        doc.setFontSize(12)
        doc.text(`Date:  ${date.format('DD/MM/YYYY')}`, 60, 15);
        doc.text(`OE:  ${oe}`, 120, 15);

        autoTable(doc, {
            head: [['Count', 'TM', 'Speed']],
            theme: 'grid',
            styles: { fontStyle: 'bold', fontSize: 12 },
            body: [
                [formData.count, formData.tm, formData.speed],
            ],
            startY: 30
        })

        autoTable(doc, {

            styles: { fontStyle: 'bold', fontSize: 15 },
            body: [
                [`TPI: ${formData.tpi}`, `Delivery: ${formData.delivery}`],

            ]
        })

        doc.save(`A_Percentage_${date.format('DD_MM_YYYY')}.pdf`)
    };
    return <>
        <Box >
            <AppHeader3   {...props} />

            <div style={{ position: 'fixed', top: '70px', left: '0px', backgroundColor: '#ffff', overflowY: 'auto', height: 'calc(100vh - 130px)' }} >
                <Table stickyHeader aria-label="simple table" size="small"  >
                    <TableHead  >
                        <TableRow>
                            <TableCell sx={{ width: '33%' }} align="center"><Typography variant='body1'>Actual Count</Typography></TableCell>
                            <TableCell sx={{ width: '33%' }} align="center"><Typography variant='body1'>TM</Typography></TableCell>
                            <TableCell sx={{ width: '34%' }} align="center"><Typography variant='body1'>Speed</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow >

                            <TableCell sx={{ ...cellStyle, width: '33.3%' }}>
                                <TextField
                                    type='number'
                                    id="count"
                                    label=""
                                    value={formData.count}
                                    name="count"
                                    size="small"
                                    onChange={(e) => handleChange(e)}
                                    error={isValid(formData.count)}
                                />
                            </TableCell>
                            <TableCell sx={{ ...cellStyle }} >
                                <TextField
                                    type='number'
                                    id="tm"
                                    label=""
                                    name="tm"
                                    value={formData.tm}
                                    size="small"
                                    onChange={(e) => handleChange(e)}
                                    error={isValid(formData.tm)}
                                />
                            </TableCell>
                            <TableCell sx={{ ...cellStyle }}>
                                <TextField
                                    type='number'
                                    id="speed"
                                    label=""
                                    name="speed"
                                    value={formData.speed}
                                    size="small"
                                    onChange={(e) => handleChange(e)}
                                    error={isValid(formData.speed)}
                                />
                            </TableCell>

                        </TableRow>
                        <TableRow>

                            <TableCell sx={{ ...cellStyle }}>
                                <TextField label="TPI" color="secondary" focused value={formData.tpi} />
                            </TableCell>
                            <TableCell sx={{ ...cellStyle }}>
                                <TextField label="Delivery" color="secondary" focused value={formData.delivery} />
                            </TableCell>

                        </TableRow>
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

export default TMTOTPI