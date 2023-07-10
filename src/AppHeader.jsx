import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './mills_logo.png';
import { Box, Button, TextField, Typography } from '@mui/material';
const AppHeader1 = (props) =>{
    const { addNewRow, setOpen} = props
    return <>
     <div style={{ display: 'flex', minWidth: 400, maxWidth: 600, padding: 15, position: 'fixed', top: '0px', left: '0px', zIndex: 5, backgroundColor: '#ffff' }}>
              <MenuIcon sx={{paddingRight:'12px'}} onClick={(e)=>setOpen(true)}/>
                <Box
                    component="img"
                    sx={{ height: 40 }}
                    alt="Logo"
                    src={logo}
                />
                <Typography variant='h6'>Count CSP</Typography>
                <div style={{ marginLeft: 'auto', marginRight: '30px' }}>
                    <Button size='small' color='secondary' variant='contained' onClick={(e) => {
                        addNewRow()
                    }}
                    >Add new Row</Button>
                </div>
            </div>
    </>
}

const AppHeader2 = (props) =>{
    const { addNewRow, setOpen} = props
    return <>
     <div style={{ display: 'flex', minWidth: 400, maxWidth: 600, padding: 15, position: 'fixed', top: '0px', left: '0px', zIndex: 5, backgroundColor: '#ffff',gap:'5px'}}>
              <MenuIcon sx={{paddingRight:'12px'}} onClick={(e)=>setOpen(true)}/>
                <Box
                    component="img"
                    sx={{ height: 40 }}
                    alt="Logo"
                    src={logo}
                />
                <Typography variant='h6'>A %</Typography>
                <div style={{ marginLeft: 'auto', marginRight: '30px' }}>
                    <Button size='small' color='secondary' variant='contained' onClick={(e) => {
                        addNewRow()
                    }}
                    >Add new Row</Button>
                </div>
            </div>
    </>
}

export  {AppHeader1, AppHeader2}