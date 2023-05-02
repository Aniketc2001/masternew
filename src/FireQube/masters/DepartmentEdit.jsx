import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControl, FormGroup, InputLabel, Input, Typography, Button, styled } from '@mui/material';
import axios from 'axios';

const Container = styled(FormGroup)`
  width: 50%;
  margin: 5% auto 0 auto;
  & > div {
    margin-top: 20px;
  }
`
const initialVal = {
  DepartmentId: 0,
  DepartmentCode: '',
  DepartmentName: ''
}

export default function DepartmentEdit() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [dept, setDept] = useState(initialVal);
  useEffect(() => {
    getDepartment();
    // eslint-disable-next-line
  }, []);

  const getDepartment = async () => {
    try {
      if(id === "0") { return; }
      
      let response = await axios.get("department/" + id, []);
      setDept(response.data);
    } catch (error) {
      console.log("Error occured while fetching data. Error message - " + error.message);
    }
  }

  const onValChange = (e) => {
    setDept({...dept, [e.target.name]: e.target.value});
  }

  const saveDepartment = async () => {
    await axios({
      method: (id === "0" ? 'post' : 'put'),
      url: "department",
      data: dept
    }).then((response) => {
      navigate("/deptlist");
    }).catch((error) => {
      if(error.response){
        console.log(error.response.data);
      }
    })
  }

  return (
    <Container>
      <Typography variant="h6">Department</Typography>
      <FormControl>
        <InputLabel>Department Code</InputLabel>
        <Input onChange={(evt) => onValChange(evt)} name="DepartmentCode" value={dept.DepartmentCode} autoComplete="off"/>
      </FormControl>
      <FormControl>
        <InputLabel>Department Name</InputLabel>
        <Input onChange={(evt) => onValChange(evt)} name="DepartmentName" value={dept.DepartmentName} autoComplete="off"/>
      </FormControl>
      <FormControl>
        <Button onClick={() => saveDepartment()} variant="contained">Save</Button>
      </FormControl>
    </Container>
  )
}
