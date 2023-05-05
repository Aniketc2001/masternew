import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Box, Paper, FormControl, FormGroup, InputLabel, Input, Typography,  styled, TextField, MenuItem,
  Stack, Divider, FormControlLabel, Checkbox, Alert, Grid, Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';


export default function UserDashboard() {
  return (
    <div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          fontFamily: 'Poppins',
          fontSize: 12,
          margin:0, p: 0.1 
        }}
        noValidate
        autoComplete="off"
        className="EditPageLayout"
      >
      <Paper elevation={6} sx={{ p: 3, m:0, minHeight: '90vh' }}>
      <h2 className='PageTitle'>Application Dashboard</h2>
      <p className='PageSubTitle'>View & monitor application health stats & insights</p>
      <br />
      <Grid container spacing={0.5} noValidate={false}>
            <Grid item spacing={1} xs={3}>
              <Paper elevation={2} sx={{ p: 3, m:1, minHeight: '15vh', backgroundColor: 'lightcoral' }}>
                <Grid container spacing={0.5} noValidate={false}>
                  <Grid item spacing={0} xs={4}>
                    <i className={'bi-ui-checks-grid'} style={{color:'whitesmoke', fontSize: '30pt', marginRight: '5px', cursor:'pointer'}}  />
                  </Grid>
                  <Grid item spacing={0} xs={8}>
                      <span style={{fontSize:'25pt', color:'white'}}>2</span>
                      <br/>
                      <span style={{fontSize:'12pt', color:'white'}}>Total Apps Loaded</span>

                  </Grid>
                </Grid>
              </Paper>            
            </Grid>
            <Grid item spacing={1} xs={3}>
              <Paper elevation={2} sx={{ p: 3, m:1, minHeight: '15vh', backgroundColor: 'orange' }}>
                <Grid container spacing={0.5} noValidate={false}>
                    <Grid item spacing={0} xs={4}>
                      <i className={'bi-people-fill'} style={{color:'whitesmoke', fontSize: '30pt', marginRight: '5px', cursor:'pointer'}}  />
                    </Grid>
                    <Grid item spacing={0} xs={8}>
                        <span style={{fontSize:'25pt', color:'white'}}>12</span>
                        <br/>
                        <span style={{fontSize:'12pt', color:'white'}}>Active Users</span>

                    </Grid>
                  </Grid>
              </Paper>            
            </Grid>
            <Grid item spacing={1} xs={3}>
              <Paper elevation={2} sx={{ p: 3, m:1, minHeight: '15vh', backgroundColor: 'lightgreen' }}>
                  <Grid container spacing={0.5} noValidate={false}>
                    <Grid item spacing={0} xs={4}>
                      <i className={'bi-qr-code'} style={{color:'whitesmoke', fontSize: '30pt', marginRight: '5px', cursor:'pointer'}}  />
                    </Grid>
                    <Grid item spacing={0} xs={8}>
                        <span style={{fontSize:'25pt', color:'white'}}>214</span>
                        <br/>
                        <span style={{fontSize:'12pt', color:'white'}}>Checker Inbox</span>

                    </Grid>
                  </Grid>
              </Paper>            
            </Grid>
            <Grid item spacing={1} xs={3}>
              <Paper elevation={2} sx={{ p: 3, m:1, minHeight: '15vh', backgroundColor: 'lightskyblue' }}>
                  <Grid container spacing={0.5} noValidate={false}>
                    <Grid item spacing={0} xs={4}>
                      <i className={'bi-recycle'} style={{color:'whitesmoke', fontSize: '30pt', marginRight: '5px', cursor:'pointer'}}  />
                    </Grid>
                    <Grid item spacing={0} xs={8}>
                        <span style={{fontSize:'25pt', color:'white'}}>43</span>
                        <br/>
                        <span style={{fontSize:'12pt', color:'white'}}>Online Requests</span>

                    </Grid>
                  </Grid>
              </Paper>            
            </Grid>

      </Grid>
      </Paper>
      </Box>
    </div>
  )
}
