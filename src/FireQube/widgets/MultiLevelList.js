import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import {  Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../shared/styles/dx-styles.css';

// https://icons.getbootstrap.com/#usage

export default function MultiLevelList(props) {
    const [menuarr,setMenuArr] = React.useState([])

    useEffect(() => {
      getRecords();
    }, [props.open]);
    

    const getRecords = () => {
      axios({
          method: 'get',
          url: "accessLevel/assignedMenus",
        }).then((response) => {
          //console.log(response.data);
          const newData = response.data.map(item => {
            return { ...item, open: false };
          })
          //console.log('revised menu items...');
          //console.log(newData);
          setMenuArr(newData);
          //console.log('menu get...');

        }).catch((error) => {
          if(error.response) {
            console.log("Error occured while fetching data. Error message - " + error.message);
          }
        })
    }


    const handler = ( children ) => {
      //console.log('handler...');
      return children.map( ( subOption ) => {
          if ( !subOption.children ) {
            return (
              <div key={ subOption.MenuName }>
                <ListItem dense="true" sx={{height:'28px'}}
                  button 
                  component={Link}
                  to={subOption.MenuUrl}
                  replace={true}
                  key={ subOption.MenuName }>
                  <i className={subOption.MenuIcon} style={{fontSize: '13pt'}} title={subOption.MenuName}></i>
                    <ListItemText 
                      inset 
                      secondary={ subOption.MenuName }
                      sx={{px:2.5,fontFamily: 'tahoma'}} 
                    />
                </ListItem>
              </div>
            )
          }
          return (
            <div key={ subOption.MenuName }>
              <ListItem dense="true" sx={{height:'28px',fontFamily: 'sans-serif'}}
                button 
                component={Link}
                to={subOption.MenuUrl}
                key={ subOption.MenuName }
                onClick={ () => this.handleClick( subOption.MenuName ) }>
                <i className={subOption.MenuIcon} style={{fontSize: '13pt'}} title={subOption.MenuName}></i>
                <ListItemText dense="true"
                  inset 
                  secondary={ subOption.MenuName }
                  sx={{px:2.5,fontFamily: 'tahoma'}} 
                   />
                
              </ListItem>
              <Collapse 
                timeout="auto" 
                unmountOnExit
              >
                { this.handler( subOption.children ) }
              </Collapse>
            </div>
          )
        } )
      }  
    
     const handleClick = ( item ) => {
        //console.log('clicked ...');
        //console.log(item);
        setMenuArr(
            menuarr.map((menuarrrec) =>
                menuarrrec.MenuName === item.MenuName
                    ? { ...menuarrrec, open: !item.open }
                    : { ...menuarrrec }
            )
        );
        //console.log('after menuarr',menuarr);
      }

      
      const lidata = () => {
        return menuarr.map((tempmenurow) => (
          <List dense="true" sx={{marginBottom:'0px',p:0}}>
            <ListItemButton onClick={ () => handleClick(tempmenurow) } sx={{height:'30px'}}>
                <i className={tempmenurow.MenuIcon} sx={{fontWeight: 'bold', color:'lightblue'}} style={{fontSize: '13pt'}} title={tempmenurow.MenuName}></i>
              <ListItemText
                dense="true"
                inset
                primary={tempmenurow.MenuName}
                key={tempmenurow.MenuName}
                sx ={{ color:'black', fontWeight:'bold', px: 1.9, paddingTop:0, paddingBottom:0 }}
              />
              { tempmenurow.open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={tempmenurow.open} timeout="auto" unmountOnExit>
              {handler(tempmenurow.children)}
            </Collapse>
          </List>
        ));
      }


    
    return (
      menuarr?
      <div style={{height:'90vh',overflow:'auto', overflowX:'hidden'}}>
          <div>
          {lidata()}
          </div>
      </div>
      :<></>
    )


}