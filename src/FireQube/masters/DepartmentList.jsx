import React, { useState, useEffect } from 'react';
import { 
  Table, TableHead, TableCell, TableRow, TableBody, styled, Typography, Button 
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
export default function DepartmentList() {

  const [departments, setDepartments] = useState([]);
  
  useEffect(() => {
    getDepartments();
  }, []);

  const getDepartments = async () => {
    try {
      let response = await axios.get("department", []);
      setDepartments(response.data);
    } catch (error) {
      console.log("Error occured while fetching data. Error message - " + error.message);
    }
  }

  const deleteDepartment = async (id) => {
    await axios.delete("department/" + id, [])
    .then((response) => {
      getDepartments();
    })
    .catch((error) => {
      if(error.response){
        console.log(error.response.data);
      }
    })
  }

  return (
          <>
            <Typography variant="h6" style={{display: 'inline-block', marginRight:10}}>Departments</Typography>

            <Typography style={{display: 'inline-block', fontSize: 13, fontFamily: 'Segoe UI'}} component={Link} to={`/deptEdit/0`}>New Department</Typography>
            
            <Table size="small" padding="normal">
              <TableHead>
                  <THead>
                      <TableCell>Id</TableCell>
                      <TableCell>Department Code</TableCell>
                      <TableCell>Department Name</TableCell>
                      <TableCell>Actions</TableCell>
                  </THead>
              </TableHead>
              <TableBody>
                  {departments.map((dept) => (
                      <TRow key={dept.DepartmentId}>
                          <TableCell>{dept.DepartmentId}</TableCell>
                          <TableCell>{dept.DepartmentCode}</TableCell>
                          <TableCell>{dept.DepartmentName}</TableCell>
                          <TableCell>
                              <Button color="primary" variant="contained" style={{marginRight:10, height: 15}} component={Link} to={`/deptEdit/${dept.DepartmentId}`}>Edit</Button>
                              <Button color="secondary" variant="contained" style={{marginRight:10, height: 15}} onClick={() => deleteDepartment(dept.DepartmentId)}>Delete</Button>
                          </TableCell>
                      </TRow>
                  ))}
              </TableBody>
          </Table>
        </>
  )
}
