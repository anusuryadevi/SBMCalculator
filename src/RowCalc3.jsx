import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, FormControl, InputLabel, MenuItem, NativeSelect, Select, Typography } from '@mui/material';
const RowCalc3 = (props) => {
    const { deleteRow, handleChange, index } = props
    const { rowData } = props
    const { key, OE, SDE,time, Count, Colour, ActualCount, No_of_Rotors, Delivery, Hours, Actual_Pro, Eff, Target,remark } = rowData
    const handleChangeLocal = (key, obj) => {
         CalculateResults(obj)        
        handleChange(key, obj);    
      
    }

    const isAllfilled = () =>{
    const keys = Object.keys(rowData)
    console.log(keys)
    const isFilled= keys.every((key)=> {  if(key !="Target" && key !="Eff" && key!="SDE" ){
        return !!rowData[key]}
        return true;
    });
        
    
    return isFilled;
    }

    const CalculateResults = (obj) => {
        const No_of_Rotors=obj["No_of_Rotors"];
        const Hours=obj["Hours"];
        const ActualCount=obj["ActualCount"];
        const Delivery=obj["Delivery"];

        const Target=0.591072*No_of_Rotors*Hours/ActualCount*60*Delivery/1000;
        const Eff=obj["Actual_Pro"]/Target
        obj["Target"]=Target;
        obj["Eff"]=Eff*100;

    }

    const isValid = (value) => {
        return value ? false : true
    }
    const cellStyle = {
        paddingLeft: '6px',
        paddingRight: '6px',
    }
    return <>
        <TableRow key={key} sx={{
            border: '1px solid gray'
        }}>
            <TableCell sx={{ ...cellStyle, width: '5%', padding: '0px' }}>
                <Typography variant='subtitle2' sx={{ display: 'flex', justifyContent: 'center' }}>  {index + 1} </Typography>
            </TableCell>
            <TableCell sx={{
                ...cellStyle,
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid blue',
                gap: '10px',
                padding: '15px'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '10px',

                }}>
                    <TextField label="OE" color="secondary" focused value={OE} sx={{ width: '30%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, OE: e.target.value })}  error={isValid(OE)}/>

                    <FormControl sx={{ width: '30%' }}>
                        <InputLabel id="demo-simple-select-label">Side</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={SDE}
                            label="SDE"
                            onChange={(e) => handleChangeLocal(key, { ...rowData, SDE: e.target.value })}
                        >
                            <MenuItem value={1}>Left</MenuItem>
                            <MenuItem value={2}>Right</MenuItem>
                            <MenuItem value={3}>RightLeft</MenuItem>

                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '30%' }}>
                        <InputLabel id="demo-time-select-label">Shift</InputLabel>
                        <Select
                            labelId="demo-time-select-label"
                            id="demo-time-select"
                            value={time}
                            label="time"
                            onChange={(e) => handleChangeLocal(key, { ...rowData, time: e.target.value })}
                        >
                            <MenuItem value={1}>Day</MenuItem>
                            <MenuItem value={2}>Night</MenuItem>

                        </Select>
                    </FormControl>

                    {/* <TextField label="SDE" color="secondary" focused value={SDE} sx={{ width: '30%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, SDE: e.target.value })} /> */}
                    <TextField label="Count" color="secondary" focused value={Count} sx={{ width: '30%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, Count: e.target.value })} error={isValid(Count)}/>
                    <TextField label="Colour" color="secondary" focused value={Colour} sx={{ width: '30%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, Colour: e.target.value })} error={isValid(Colour)}/>
                    <TextField label="ActualCount" color="secondary" focused value={ActualCount} sx={{ width: '30%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, ActualCount: e.target.value })} error={isValid(ActualCount)}/>
                    <TextField label="No_of_Rotors" color="secondary" focused value={No_of_Rotors} sx={{ width: '30%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, No_of_Rotors: e.target.value })}  error={isValid(No_of_Rotors)}/>
                    <TextField label="Delivery" color="secondary" focused value={Delivery} sx={{ width: '30%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, Delivery: e.target.value })} error={isValid(Delivery)}/>
                    <TextField label="Hours" color="secondary" focused value={Hours} sx={{ width: '30%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, Hours: e.target.value })} error={isValid(Hours)}/>
                    <TextField label="Actual_Pro" color="secondary" focused value={Actual_Pro} sx={{ width: '30%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, Actual_Pro: e.target.value })} error={isValid(Actual_Pro)}/>
                    {/* <TextField label="Remarks" color="secondary" focused value={remark} sx={{ width: '60%' }} onChange={(e) => handleChangeLocal(key, { ...rowData, remark: e.target.value })} /> */}
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '10px',
                    margin: 'auto'
                }}>
                    <TextField label="Target" color="success" focused value={Target} />
                    <TextField label="Eff" color="success" focused value={Eff} />
                </Box>
            </TableCell>
            <TableCell sx={{ ...cellStyle, padding: '0px', width: '5%' }}>
                <IconButton aria-label="delete" size="large" sx={{ padding: '0px' }} color='error' onClick={(e) => {
                    deleteRow(key)
                }}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </TableCell>
        </TableRow>


    </>
}

export default RowCalc3