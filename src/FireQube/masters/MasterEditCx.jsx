import * as React from 'react';
import {Box, Paper, Grid, ToggleButton, ToggleButtonGroup} from '@mui/material';
import '../../shared/styles/dx-styles.css';
import { alert, custom, confirm  } from 'devextreme/ui/dialog';

import BxButton  from 'react-bootstrap/Button';
import { useNavigate,useLocation, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import EditPageLayout from '../widgets/EditPageLayout';
import axios from 'axios';

/* Props for EditPageComponent
	- APIName
	- InitialVal
	- ListPageName
	- Title
	- SubTitle */

export default function MasterEditCx(props) {
  const [initialVal, setinitialVal] = useState(null);
  const [ancillaryData, setancillaryData] = useState(null);
  const {id} = useParams();
  const m = new URLSearchParams(useLocation().search).get('m');
  const [menuDetails, setmenuDetails] = useState(null); 
  //const APIName = new URLSearchParams(useLocation().search).get('a');
  const [ApiName, setApiName] = useState(null); 
 
  const hdr = {
    'mId': m
  };

  useEffect(() => {
    console.log('useeffect for menu...');
    getMenuDetails();
  }, [props.mId]);
  
  useEffect(() => {
    console.log('ApiName' + ApiName);
    if(ApiName != null){
      console.log('useeffect for initialval...');
      getinitialVal();
      getancillaryData();
    }
  }, [ApiName]);


  const getinitialVal = () =>{
    try{
        axios({
          method: 'get',
          url: ApiName + "/" + id,
          headers: hdr
        }).then((response) => {
          let x = response.data;
          x.Active = x.Active === 'Y' ? true : false;
          setinitialVal(x);
          console.log(x);
        }).catch((error) => {
          if(error.response) {
            if(error.response.status === 417) {
              console.log("Error occured while deleting record..");
            }
          }
        })
    }
    catch(ex){

    }
  }

  const getancillaryData = () => {
    try{
        axios({
          method: 'get',
          url: ApiName  + '/ancillaryData',
          headers: hdr
        }).then((response) => {
            setancillaryData(response.data);
        }).catch((error) => {
            setancillaryData("no values");
            if(error.response){
                console.log("Error occured while retrieving ancillary data..");   
            }
        })
    }
    catch(ex){
    }
  }


  const getMenuDetails = () => {
    try{
      axios({
          method: 'get',
          url: "menu/getMenuInfo",
          headers: hdr
        }).then((response) => {
          console.log('menu obj...');
          console.log(response.data);
          setmenuDetails(response.data);
          setApiName(response.data.ApiName);
        }).catch((error) => {
          if(error.response) {
            console.log("Error occured while fetching data. Error message - " + error.message);
          }
      })
    }
    catch(ex){
    }
  }

  return(
        initialVal && ancillaryData && menuDetails && ApiName?
        <EditPageLayout 
            APIName={ApiName}
            initialVal={initialVal}
            ancillaryData={ancillaryData}
            listPageName={menuDetails.MenuUrl }
            title={menuDetails.MenuName}
            subTitle={menuDetails.SubTitle}
        />
        :<></>
    );
}
