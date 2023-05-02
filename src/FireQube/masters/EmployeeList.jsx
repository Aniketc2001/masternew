import React, { useState, useEffect } from 'react';
import { 
  Table, TableHead, TableCell, TableRow, TableBody, styled, Typography, Button 
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import format from "date-fns/format";

const THead = styled(TableRow)`
    & > th {
        font-size: 14px;
        background: #ed6c02;
        color: #FFFFFF;
    }
`
const TRow = styled(TableRow)`
    & > td{
        font-size: 14px
    }
`
export default function EmployeeList() {

  const [Employees, setEmployees] = useState([]);

  // const formatToMyDate = (dateVal, dateFormat) => {
  //   return format(new Date(dateVal), dateFormat);
  // }
  
  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    try {
      let response = await axios.get("employee", []);
      setEmployees(response.data);
    } catch (error) {
      console.log("Error occured while fetching data. Error message - " + error.message);
    }
  }

  const deleteEmployee = async (id) => {
    try {
      await axios.delete("employee/" + id, []);
      getEmployees();
    } catch (error) {
      console.log("Error occured while deleting data. Error message - " + error.message);
    }  
  }
  
  return (
          <>
            <Typography variant="h6" style={{display: 'inline-block', marginRight:10}}>Employees</Typography>

            <Typography style={{display: 'inline-block', fontSize: 13, fontFamily: 'Segoe UI'}} component={Link} to={`/empEdit/0`}>New Employee</Typography>
            
            <Table size="small" padding="normal">
              <TableHead>
                  <THead>
                      <TableCell>Id</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email Id</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Joining Date</TableCell>
                      <TableCell>Salary</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Actions</TableCell>
                  </THead>
              </TableHead>
              <TableBody>
                  {Employees.map((emp) => (
                      <TRow key={emp.EmployeeId}>
                          <TableCell>{emp.EmployeeId}</TableCell>
                          <TableCell>{emp.FirstName}</TableCell>
                          <TableCell>{emp.LastName}</TableCell>
                          <TableCell>{emp.EmailId}</TableCell>
                          <TableCell>{emp.PhoneNumber}</TableCell>
                          <TableCell>{emp.JoiningDate}</TableCell>
                          <TableCell>{emp.Salary}</TableCell>
                          <TableCell>{emp.Department.DepartmentCode}</TableCell>
                          <TableCell>
                              <Button color="primary" variant="contained" style={{marginRight:10, height: 15}} component={Link} to={`/empEdit/${emp.EmployeeId}`}>Edit</Button>
                              <Button color="secondary" variant="contained" style={{marginRight:10, height: 15}} onClick={() => deleteEmployee(emp.EmployeeId)}>Delete</Button>
                          </TableCell>
                      </TRow>
                  ))}
              </TableBody>
          </Table>
        </>
  )
}

