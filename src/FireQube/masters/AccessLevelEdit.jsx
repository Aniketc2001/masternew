import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Box, Paper, FormControl, FormGroup, InputLabel, Input, Typography,  styled, TextField, MenuItem,
  Stack, Divider, FormControlLabel, Checkbox, Alert, Grid, Snackbar
} from '@mui/material';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { alert, custom, confirm  } from 'devextreme/ui/dialog';

const initialVal = {
  AccessLevelId: 0,
  AccessLevelCode: '',
  AccessLevelName: '',
  AccessLevelDescription: '',
  AppId: 0,
  Active : true
}

export default function AccessLevelEdit() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [accLvl, setAccLvl] = useState({});
  const m = new URLSearchParams(useLocation().search).get('m');
  const clr = new URLSearchParams(useLocation().search).get('clr');
  const [apps, setApps] = useState([]);
  const [showAR, setShowAR] = useState(false);
  
  const [openNotificationBar, setOpenNotificationBar] = React.useState(false); //Notification Bar Flag
  const [notificationBarMessage, setnotificationBarMessage] = React.useState(''); //Notification Message

  const config = {
    headers: {
      "mId": m
  }};
  
  useEffect(() => {
    getApps();
    getAccessLevel();
    setShowAR(clr === 'c');
    // eslint-disable-next-line
  }, []);

  const handleCloseNotificationBar = () => {
    setOpenNotificationBar(false);
  };

  const getAccessLevel = async () => {
    try {
      let response = await axios.get("accessLevel/" + id, config);
      let x = response.data;
      x.Active = x.Active === 'Y' ? true : false;
      setAccLvl(x);
    } catch (error) {
      console.log("Error occured while fetching data. Error message - " + error.message);
    }
  }

  const getApps = async () => {
    try {
      let response = await axios.get("app", []);
      setApps(response.data);
    } catch (error) {
      console.log("Error occured while departments data. Error message - " + error.message);
    }
  }

  const onValChange = (e) => {
    if(e.target.type === 'checkbox')
      setAccLvl({...accLvl, [e.target.name]: e.target.checked ? true : false});
    else
      setAccLvl({...accLvl, [e.target.name]: e.target.value});
  }

  const approveRequest = async () => {
    await axios({
        method: (accLvl.MarkedForDelete === 'Y' ? 'delete' : 'put'),
        url: "accessLevel" + (accLvl.MarkedForDelete === 'Y' ? '/' + id : ''),
        data: (accLvl.MarkedForDelete === 'Y' ? null : accLvl),
        headers: {"mId": m, "cact" : 'A'}
    }).then((response) => {
      navigate("/accLvlListCx?m=" + m);
    }).catch((error) => {
      if(error.response){
        if(error.response.status === 417) {
          console.log("Error occured while approving record..");
        }
      }
    })
  }

  const deleteRecord = async () => {
    await axios({
      method: 'delete',
      url: "accessLevel/" + id,
      headers: {"mId": m}
    }).then((response) => {
      navigate("/accLvlListCx?m=" + m);
    }).catch((error) => {
      if(error.response) {
        if(error.response.status === 417) {
          console.log("Error occured while deleting record..");
        }
      }
    })
  }

  const rejectRequest = async () => {
    await axios({
      method: (accLvl.MarkedForDelete === 'Y' ? 'delete' : 'put'),
      url: "accessLevel" + (accLvl.MarkedForDelete === 'Y' ? '/' + id : ''),
      data: (accLvl.MarkedForDelete === 'Y' ? null : accLvl),
      headers: {"mId": m, "cact" : 'R'}
    }).then((response) => {
      navigate("/accLvlListCx?m=" + m);
    }).catch((error) => {
      if(error.response){
        if(error.response.status === 417) {
          console.log("Error occured while rejecting record..");
        }
      }
    })
  }

  const cancelEntry = async () => {
    console.log(accLvl);
    navigate("/accLvlListCx?m=" + m);
  }

  const saveRecord = () => {
    axios({
        method: (id === "0" ? 'post' : 'put'),
        url: "accessLevel",
        data: {...accLvl, 'Active': accLvl.Active ? 'Y' : 'N'},
        headers: {"mId": m}
    }).then((response) => {
        navigate("/accLvlListCx?m=" + m);
    }).catch((error) => {
        if(error.response){
            if(error.response.status === 417) {
              console.log("Error occured while saving data.." + error.response.data);
            }
            setnotificationBarMessage("Error occured while saving data.." + error.response.data);
            setOpenNotificationBar(true);            
        }
    })
  }

  return (
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          fontFamily: "Poppins",
          fontSize: 13,
          p: 1
        }}
        noValidate
        autoComplete="off"
      >
      <Paper elevation={6} sx={{ p: 4, m:1, paddingTop: 4 }}>
      <h2>Access Level</h2>
      <h6>Create and manage access levels</h6>
      <br />
      <Grid container spacing={1}>
          <Grid item xl={10} spacing={2}>
            <TextField onChange={(evt) => onValChange(evt)} label="Access Level Code" variant="standard" name="AccessLevelCode" value={accLvl.AccessLevelCode} autoComplete="off" sx={{width:200}}  inputProps={{ maxLength: 20 }} />

            <TextField onChange={(evt) => onValChange(evt)} label="Access Level Name" variant="standard" name="AccessLevelName" value={accLvl.AccessLevelName} autoComplete="off" sx={{width:400}} fullWidth={400}  inputProps={{ maxLength: 100 }} />

            <TextField onChange={(evt) => onValChange(evt)} label="Description" variant="standard" name="AccessLevelDescription" value={accLvl.AccessLevelDescription} autoComplete="off" sx={{width:400}}  inputProps={{ maxLength: 500 }} />

            <TextField label="App" variant="standard" select value={accLvl.AppId} onChange={(evt) => onValChange(evt)} name="AppId">
              {
                // eslint-disable-next-line
                apps.map((app) => (
                  <MenuItem key={app.AppId} value = {app.AppId}>{app.AppName}</MenuItem>
                ))
              }
            </TextField>

            <FormControl variant="standard">
              <FormControlLabel control={<Checkbox checked={accLvl.Active} onChange={(evt) => onValChange(evt)} name="Active"/>} label="Active" />
            </FormControl>
          </Grid>
          <Grid item xl={10} spacing={2} sx={{paddingTop:4}}>
            <FormControl>
              { showAR ? (
                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                  <Button size="sm" style={{ textTransform: "none"}} onClick={() => approveRequest()}>
                      <i className={'bi-bag-check-fill'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Approve
                  </Button> 
                  <Button size="sm" style={{ textTransform: "none"}} onClick={() => rejectRequest()}>
                      <i className={'bi-bag-x-fill'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Reject
                  </Button>
                  <Button size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Back to List
                  </Button>                    
                </Stack>
              ) : (clr === null && accLvl.CheckerStatus !== 'W') ? (
                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                    <Button size="sm" style={{ textTransform: "none"}} onClick={() => saveRecord()}>
                      <i className={'bi-save'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Save
                    </Button>                  
                    <Button size="sm" style={{ textTransform: "none" }} onClick={() => deleteRecord()} >
                      <i className={'bi-x-square-fill'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Delete
                    </Button>                    
                    <Button size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Back to List
                    </Button>                    
                </Stack>
              ) :
                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                  <Button size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Back to List
                  </Button>                    
                </Stack>
              }
            </FormControl>
            <FormControl>
              { accLvl.MarkedForDelete === 'Y' ? (
              <Alert severity="error">
                Entry marked for deletion. Awaiting check..
              </Alert> ) : ''}
            </FormControl>
          </Grid>
        </Grid>  
        <Snackbar
                open={openNotificationBar}
                onClose={handleCloseNotificationBar}
                autoHideDuration={3000}
                anchorOrigin={{vertical:'bottom', horizontal:'center'}}
                
            >
                 <Alert onClose={handleCloseNotificationBar} severity="info" variant="filled" sx={{ width: '100%' }}>
                    {notificationBarMessage}
                </Alert>
        </Snackbar>
      </Paper>
      </Box>
  )
}
