import * as React from 'react';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { rgbToHex, useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState,useEffect } from 'react';
import {  Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import modules from '../jsondata/modules';
import '../../shared/styles/App.css';

function ApplicationMenuPopover(props) {
    const navigate = useNavigate();
    const theme = useTheme();
    const [currAppId,setcurrAppId] = useState(0);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };

    const handleAppSelect = (e) => {
      console.log('app select',e,props);
      var token = "";
      token = JSON.parse(localStorage.getItem("authToken"));
      token.AppId = e;
      localStorage.setItem("authToken", JSON.stringify(token));
      //props.handleDrawerOpen();
      props.setreloadMenu(props.reloadMenu+1);
      navigate('/');
    }

    const modDivs = () => {
      //console.log('moddivs',props.userInfo);
      
      if(props.userInfo)
       return props.userInfo.SystemUserApps.map((moduleRec) => (
        <ListItemButton key={moduleRec.AppId} sx={{fontWeight:'bold'}} onClick={() => handleAppSelect(moduleRec.AppId)} disabled={currAppId === moduleRec.AppId?true:false} >
          <ListItemIcon sx={{fontSize:'40pt',color:'black'}}>
            <i className={moduleRec.AppIcon} style={{color:'#222242'}} />
          </ListItemIcon>
          <ListItemText sx={{paddingLeft:3, fontWeight:'bold'}} primary={moduleRec.AppName}
             secondary={moduleRec.AppDescription} />
        </ListItemButton>
        ));
      else
        return(
          <>
          </>
        );
    }

  return (
    <div>
      <Popper
        open={props.popoverFlag}
        anchorEl={props.objAppref}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{
          height: 350,
          width: 500,
          marginRight:5 
        }}
      >
        <Paper
          elevation={6}
          sx={{
            height: 250,
            width: 450,
            paddingTop: 2,
            paddingLeft: 2,
            paddingRight: 2,
            marginRight:30,
            marginTop:0.5,
            border:'1px solid #0F6CBD',
            backgroundColor:'#FFF0F5'
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