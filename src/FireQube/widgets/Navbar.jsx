import { AppBar, Toolbar, styled } from '@mui/material'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import React from 'react';
import { NavLink } from 'react-router-dom';

const Tabs = styled(NavLink)`
    font-size: 14px;
    margin-right: 10px;
    text-decoration: none;
    color: #FFFFFF;
`
export default function Navbar({setToken}) {

  const navigate = useNavigate();

  const logout = async () => {

    let id = JSON.parse(localStorage.getItem("authToken")).SystemUserId;

    await axios.put('systemUser/logout/' + id)
    .then((response) => {
      if(response.status === 200) {
        localStorage.removeItem("authToken");
        setToken(null);
        navigate("./");
      }
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
      }
    });
  }

  return (
    <AppBar position="sticky">
        <Toolbar>
            <Tabs to="./" exact="true" marginright={10}>My Office Logo</Tabs>
            <Tabs to="./" exact="true">Home</Tabs>
            <Tabs to="userlist" exact="true">Users</Tabs>
            <Tabs to="deptlist" exact="true">Departments</Tabs>
            <Tabs to="emplist" exact="true">Employees</Tabs>
            <Tabs onClick={() => logout()} exact="true">Logout</Tabs>
        </Toolbar>
    </AppBar>
  )
}

Navbar.propTypes = {
  setToken: PropTypes.func.isRequired
}