import * as React from 'react';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import {  Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import modules from '../jsondata/modules';


function ApplicationMenuPopover(props) {

    const theme = useTheme();

    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };

    const modDivs = () => {
       return modules.data.map((moduleRec) => (
        <ListItemButton key={moduleRec.moduleid}>
          <ListItemIcon sx={{fontSize:'20pt',color:'black'}}>
            <i className={moduleRec.icon} style={{color:'darkred'}} />
          </ListItemIcon>
          <ListItemText sx={{paddingLeft:3}} primary={moduleRec.name}
             secondary={moduleRec.desc} />
        </ListItemButton>
        ));
    }

  return (
    <div>
      <Popper
        open={props.popoverFlag}
        anchorEl={props.objref}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        anchorPosition={{left:300,top:150}}
        anchorReference="anchorPosition"
        transitionDuration={50}
        transformorigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper
          elevation={15}
          sx={{
            height: 550,
            width: 450,
            paddingTop: 2,
            paddingLeft: 2,
            paddingRight: 2,
            backgroundColor: 'wheat',
            marginRight:10
          }}
        >
        <Box sx={{ p: 0 }}>
            <b>Application Modules</b>
        </Box>  
          <List
            component="nav"
            sx={{
              p: 0,
              "& .MuiListItemIcon-root": {
                minWidth: 32,
                color: theme.palette.grey[500],
              },
            }}
          >
            {modDivs()}
          </List>
        </Paper>
      </Popper>
    </div>
  );
}

export default ApplicationMenuPopover;