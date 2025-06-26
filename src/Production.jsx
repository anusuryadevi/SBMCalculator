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

        let tableContent = tableData.map((obj) => {
            const side = obj.SDE == 1 ? "L" : "R";
            const time = obj.time == 1 ? "Day" : "Night";
            const item = obj.Colour + "_" + obj.Count;
            return [obj.OE, side, item, obj.ActualCount, obj.No_of_Rotors, obj.Delivery, obj.Hours, round(obj.Target, 2), obj.Actual_Pro, round(obj.Eff, 2) + "%", obj.remark, time]
        })
        let data;
        let colorCount = new Map();
        for (const data of tableData) {
            let key = data.Count + '_' + data.Colour;
            key = key.toUpperCase();
            if (colorCount.has(key)) {
                let { target, actual, Eff } = colorCount.get(key);
                target += data.Target;
                actual = parseInt(actual) + parseInt(data.Actual_Pro);
                Eff = [...Eff, data.Eff];
                colorCount.set(key, { "count": data.Count, "color": data.Colour, "target": target, "actual": actual, "Eff": Eff })
            } else {
                colorCount.set(key, { "count": data.Count, "color": data.Colour, "target": data.Target, "actual": data.Actual_Pro, "Eff": [data.Eff] })
            }

        }
        let finalProTotal = 0, finalEffTotal = 0;

        let finalArray = [];
        for (let [key, value] of colorCount) {
            let total = value.Eff.reduce((total, num) => {
                return total + num;
            }, 0);
            //  console.log(value.Eff, total);
            total = total / (value.Eff.length);
            //  console.log(total);
            finalProTotal += round(value.actual, 2);
            finalEffTotal += round(total, 2);
            const item = value.color + "_" + value.count;
            finalArray.push([item, round(value.target, 2), round(value.actual, 2), round(total, 2) + "%"])
        }

        const dayShift = tableContent.filter((obj) => {
            if (obj[11] == "Night") {
                return false;
            }
            return true;
        });
        let dayProTotal = 0, dayEffTotal = 0;
        let nightProTotal = 0, nightEffTotal = 0;
        tableData.map((item) => {
            if (item.time == 1) {
                dayProTotal += parseInt(item.Actual_Pro); dayEffTotal += item.Eff;
            } else {
                nightProTotal += parseInt(item.Actual_Pro); nightEffTotal += item.Eff;
            }

        });
        if (dayShift.length > 0) {
            dayEffTotal = dayEffTotal / dayShift.length;
             dayEffTotal=round(dayEffTotal,2);
        }


        const nightShift = tableContent.filter((obj) => {
            if (obj[11] == "Night") {
                return true;
            }
            return false;
        });


        if (nightShift.length > 0) {
            nightEffTotal = nightEffTotal / nightShift.length;
             nightEffTotal=round(nightEffTotal,2);
        }


        const doc = new jsPDF()

        doc.addImage(logo, 'png', 13, 10, 44, 20)
        doc.setTextColor(0, 51, 153)

        doc.text(`Date:  ${date.format('DD/MM/YYYY')}`, 60, 15);
        doc.setFontSize(16)
        doc.text(`Day Shift`, 100, 30);

        // Or use javascript directly:
        autoTable(doc, {
            head: [['OE', 'Side', 'Item', 'AC', 'ROT', 'DEL', 'HRS', 'TAR', "PRO", "EFF", "Remarks"]],
            theme: 'grid',
            styles: { fontStyle: 'bold', fontSize: 12 },
            body: [
                ...dayShift
            ],
            startY: 40
        });
        let finalY = doc.lastAutoTable.finalY;
        doc.setFontSize(12)
        doc.setTextColor(0, 153, 0);
        doc.text(`Total Day PRO :${dayProTotal}`, 75, finalY + 15);
        doc.text(`Total Day EFF Total:${dayEffTotal}%`, 150, finalY + 15);
        doc.setFontSize(16)
        doc.setTextColor(0, 51, 153)
        finalY = doc.lastAutoTable.finalY;
        doc.text(`Night Shift`, 100, finalY + 30);
        // Or use javascript directly:
        autoTable(doc, {
            head: [['OE', 'Side', 'Item', 'AC', 'ROT', 'DEL', 'HRS', 'TAR', "PRO", "EFF", "Remarks"]],
            theme: 'grid',
            styles: { fontStyle: 'bold', fontSize: 12 },
            body: [
                ...nightShift
            ],
            startY: finalY + 45
        });
        doc.setFontSize(12)
         doc.setTextColor(0, 153, 0);
        finalY = doc.lastAutoTable.finalY;
        doc.text(`Total Night PRO :${nightProTotal}`, 75, finalY + 15);
        doc.text(`Total Night EFF :${nightEffTotal}%`, 150, finalY + 15);
         doc.setTextColor(0, 51, 153)
        doc.setFontSize(16)
        doc.text(`Final Result`, 100, finalY + 30);
        // Or use javascript directly:
        autoTable(doc, {
            head: [['Item', 'TAR', 'PRO', 'EFF']],
            theme: 'grid',
            styles: { fontStyle: 'bold', fontSize: 12 },
            body: [
                ...finalArray
            ],
            startY: finalY + 45
        });
        doc.setFontSize(12);

        if (finalArray.length > 0) {
            finalEffTotal = finalEffTotal / finalArray.length;
             finalEffTotal=round(finalEffTotal,2);
        }

        finalY = doc.lastAutoTable.finalY;
          doc.setTextColor(0, 153, 0);
        doc.text(`Total Final PRO :${finalProTotal}`, 75, finalY + 15);
        doc.text(`TotalFinal EFF :${finalEffTotal}%`, 150, finalY + 15);
        //change
        doc.save(`Production_report${date.format('DD_MM_YYYY')}.pdf`)

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