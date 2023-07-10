import React, { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';

const Dashboard = (props) => {
    const theme = useTheme();
    const { open, setOpen, setCalculator ,calculator} = props
    const handleSelect = (key) =>{
        setCalculator(key)
        setOpen(false)
    }
    return <>
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={() => setOpen(false)}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>

            <Divider />
            <List>
                <ListItem key={1} disablePadding>
                    <ListItemButton onClick={(e)=>handleSelect(1)}>
                        <ListItemText primary={'Count CSP'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={2} disablePadding>
                    <ListItemButton onClick={(e)=>handleSelect(2)}>
                        <ListItemText primary={'A Percentage'} />
                    </ListItemButton>
                </ListItem>
            </List>

        </Drawer>
    </>
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default Dashboard