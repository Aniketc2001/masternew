import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Grid, IconButton, FormControl, FormGroup, InputLabel, Input, Typography, styled, TextField, MenuItem, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { CancelOutlined, DraftsSharp, SaveAs } from '@mui/icons-material';
import AlertDialog from '../widgets/AlertDialog';

const initialVal = {
  EmployeeId: 0,
  FirstName: '',
  LastName: '',
  EmailId: '',
  PhoneNumber: '',
  JoiningDate: null,
  Salary: 0,
  DepartmentId: '',
  Dependents : []
}

export default function EmployeeEdit() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogMsg, setDialogMsg] = React.useState('');
  const [okfn, setOkfn] = React.useState('');


  const navigate = useNavigate();
  const { id } = useParams();
  const [emp, setEmp] = useState(initialVal);

  const [departments, setDepartments] = useState([]);
  
  useEffect(() => {
    getDepartments();
    getEmployee();
    // eslint-disable-next-line
  }, []);

  const ShowDialog = (title,msg,okfn) => {
    
    setDialogTitle( title );
    setDialogMsg( msg );
    setOkfn(okfn);

    setOpenDialog(true);
  }

  const hideDialog = () => {
    setOpenDialog(false);
  }


  const getEmployee = async () => {
    try {
      if(id === "0") { return; }
      
      let response = await axios.get("employee/" + id, []);
      setEmp(response.data);
    } catch (error) {
      console.log("Error occured while fetching data. Error message - " + error.message);
    }
  }

    const getDepartments = async () => {
    try {
      let response = await axios.get("department", []);
      setDepartments(response.data);
    } catch (error) {
      console.log("Error occured while departments data. Error message - " + error.message);
    }
  }

  const onValChange = (e) => {
    setEmp({...emp, [e.target.name]: e.target.value});
  }

  const onDateValChange = (fieldName) => (value) => {
    setEmp({...emp, [fieldName]: value});
  }

  const confirmSave = () => {
    ShowDialog("Employee details - Save","This action cannot be undone and has direct impact on the application login. Confirm user details for saving?",1)
  }

  const saveEmployee = async () => {
    await axios({
        method: (id === "0" ? 'post' : 'put'),
        url: "employee",
        data: emp
    }).then((response) => {
      navigate("/emplist");
    }).catch((error) => {
      if(error.response){
        if(error.response.status === 417) {
          console.log("Error occured while saving data..");
        }
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
          p: 2
        }}
        noValidate
        autoComplete="off"
      >
        <AlertDialog
          openFlag={openDialog}
          closeHandle={hideDialog}
          okHandle={() => saveEmployee()}
          title={dialogTitle}
          msg={dialogMsg}
        />
        <Paper elevation={6} sx={{ p: 4, m:1, paddingTop: 4 }}>
        <h1>Employees</h1>
        <h6>Create and manage details of employees</h6>
        <br />
        <Grid container spacing={1}>
          <Grid item xl={8}>
              <TextField onChange={(evt) => onValChange(evt)} label="First Name" variant="standard" name="FirstName" value={emp.FirstName} autoComplete="off" sx={{width:400}}  inputProps={{ maxLength: 20 }} />
              <TextField onChange={(evt) => onValChange(evt)} label="Last Name" variant="standard" name="LastName" value={emp.LastName} autoComplete="off" sx={{width:300}}/>
              <TextField onChange={(evt) => onValChange(evt)} label="Email Id" variant="standard" name="EmailId" value={emp.EmailId} autoComplete="off"/>
              <TextField onChange={(evt) => onValChange(evt)}  label="Phone Number" variant="standard" name="PhoneNumber" value={emp.PhoneNumber} autoComplete="off"/>
              <DatePicker 
                label="Joining Date" 
                renderInput = {(params) => <TextField variant="standard" {...params} />}
                value={emp.JoiningDate}
                onChange={onDateValChange("JoiningDate")} 
                name = "JoiningDate"
                />
              <TextField label="Department" variant="standard" select value={emp.DepartmentId} onChange={(evt) => onValChange(evt)} name="DepartmentId">
                {
                  // eslint-disable-next-line
                  departments.map((department) => (
                    <MenuItem key={department.DepartmentId} value = {department.DepartmentId}>{department.DepartmentCode}</MenuItem>
                  ))
                }
              </TextField>

              <TextField onChange={(evt) => onValChange(evt)} label="Salary" variant="standard"  name="Salary" value={emp.Salary} autoComplete="off"/>
              
              <Button onClick={() => saveEmployee()} variant="contained" size="small">Save</Button>
              <br/>
              <br/>
              <Grid container spacing={1} >
                  <Grid item xm={1} >
                    <Button
                      size="sm"
                      style={{ textTransform: "none"}}
                      onClick={() => confirmSave()}
                    >
                      <i className={'bi-save'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Save
                    </Button>
                  </Grid>
                  <Grid item xm={1}>
                    <Button
                      size="sm"
                      style={{ textTransform: "none" }}
                    >
                      <i className={'bi-circle'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Delete
                    </Button>
                  </Grid>                  
                  <Grid item xm={1}>
                    <Button
                      size="sm"
                      style={{ textTransform: "none" }}
                    >
                      <i className={'bi-calendar2-x'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xm={1}>
                    <Button
                      variant="secondary"
                      size="sm"
                      style={{ textTransform: "none" }}
                      color="success"
                      onClick={() =>
                        ShowDialog(
                          "User Save",
                          "Confirm saving this user into draft folder?",
                          2
                        )
                      }
                    >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Save as draft
                    </Button>
                  </Grid>
                </Grid>
              
         </Grid>
      </Grid>
      </Paper>

      </Box>
  )
}
