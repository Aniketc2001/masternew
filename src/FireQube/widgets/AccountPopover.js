import * as React from 'react';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import {  Link,useNavigate } from 'react-router-dom';
import axios from 'axios';


// assets
import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';

function AccountPopover(props) {
    const navigate = useNavigate();
    const theme = useTheme();

    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleListItemClick = (event, index) => {
      if(index===4){
        navigate('/');
      }
      setSelectedIndex(index);
      console.log('hide...');
      props.hidePopoverfn();
    };

    const toplogoff = () =>{
        logout();
        props.logoff();
    }

    const logout = () => {
      let id = JSON.parse(localStorage.getItem("authToken")).SystemUserId;

      axios({
        method: 'put',
        url: 'systemUser/logout/' + id
      }).then((response) => {
        //console.log('logoff response');
        //console.log(response); 
        if(response.status === 200) {
          localStorage.removeItem("authToken");
          //setToken(null);
          toplogoff();
        }
      }).catch((error) => {
        //console.log('logoff err response');
        //console.log(error); 
        if (error.response) {
          console.log(error.response);
        }
      })
    } 

  return (
    <div>
      <Popper
        open={props.popoverFlag}
        anchorEl={props.objref}
        anchororigin={{
          vertical: "bottom",
          horizontal: "left",
        }}

      >
        <Paper
          elevation={6}
          sx={{
            height: 250,
            width: 220,
            paddingTop: 2,
            paddingLeft: 2,
            paddingRight: 2,
            backgroundColor: 'whitesmoke'
          }}
        >
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
            <ListItemButton
                        component={Link}
                        to={"Preferences"}
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0)}
            >
              <ListItemIcon>
                <EditOutlined />
              </ListItemIcon>
              <ListItemText primary="Edit Profile"  />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}
            >
              <ListItemIcon>
                <UserOutlined />
              </ListItemIcon>
              <ListItemText primary="View Profile" />
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3)}
            >
              <ListItemIcon>
                <ProfileOutlined />
              </ListItemIcon>
              <ListItemText primary="Social Profile" />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 4)}
            >
              <ListItemIcon>
                <WalletOutlined />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton
              onClick={toplogoff}
              selected={selectedIndex === 2}

            >
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Paper>
      </Popper>
    </div>
  );
}

export default AccountPopover;