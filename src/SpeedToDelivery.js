import React, { useEffect, useState } from "react";
import { AppHeader5 } from "./AppHeader";
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


const Speed = (props) => {
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
  
    const cellStyle = {
        paddingLeft: '6px',
        paddingRight: '6px',
    }


    function handleChange(e) {
        const tempData = { ...formData, [e.target.name]: e.target.value }
        setFormData(tempData);
        if (tempData.tpi > 0 && tempData.speed > 0) {
          
            tempData.delivery = (tempData.speed / tempData.tpi / 39.5).toFixed(5);
        } else {
             tempData.delivery = '';
        }
        setFormData(tempData);
    }

   
    return <>
        <Box >
            <AppHeader5   {...props} />

            <div style={{ position: 'fixed', top: '70px', left: '0px', backgroundColor: '#ffff', overflowY: 'auto', height: 'calc(100vh - 130px)' }} >
                <Table stickyHeader aria-label="simple table" size="small"  >
                    <TableHead  >
                        <TableRow>
                            <TableCell sx={{ width: '33%' }} align="center"><Typography variant='body1'>Speed</Typography></TableCell>
                            <TableCell sx={{ width: '33%' }} align="center"><Typography variant='body1'>TPI</Typography></TableCell>
                            <TableCell sx={{ width: '34%' }} align="center"><Typography variant='body1'>Delivery</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow >

                            <TableCell sx={{ ...cellStyle, width: '33.3%' }}>
                                <TextField
                                    type='number'
                                    id="speed"
                                    label=""
                                    value={formData.speed}
                                    name="speed"
                                    size="small"
                                    onChange={(e) => handleChange(e)}
                                    error={isValid(formData.speed)}
                                />
                            </TableCell>
                            <TableCell sx={{ ...cellStyle }} >
                                <TextField
                                    type='number'
                                    id="tpi"
                                    label=""
                                    name="tpi"
                                    value={formData.tpi}
                                    size="small"
                                    onChange={(e) => handleChange(e)}
                                    error={isValid(formData.tpi)}
                                />
                            </TableCell>
                            <TableCell sx={{ ...cellStyle }}>
                            <TextField label="Delivery" color="secondary" focused value={formData.delivery} />
                            </TableCell>

                        </TableRow>
                  
                    </TableBody>
                </Table>

             
            </div>

        </Box>
    </>
}

export default Speed