import * as React from 'react';
import '../../shared/styles/dx-styles.css';
import { useNavigate,useLocation, useParams   } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ListPageLayout from '../widgets/ListPageLayout';
import axios from 'axios';
import PropTypes  from 'prop-types';

/* ListPageLayout Component Props 
    - ColumnVisibilityJSON (columnDisplayMap)
    - API Name (APIName)
    - Edit Page Name (EditPageName)
    - ID Column Name (KeyFieldName)
    - List Page Title (ListPageTitle)
    - TableName (TableName)
    - KeyFieldName (KeyFieldName)
    - ColumnNamesJSON (Columns) */

export default function MasterListPageCx(props) {
    const m = new URLSearchParams(useLocation().search).get('m');
    const [menuDetails, setmenuDetails] = useState(null); 
    const [columnNamesJSON, setcolumnNamesJSON] = useState(null);
   

    const hdr = {
        'mId': m
    };

    useEffect(() => {
        getDetails();
        getColumnDetails();
    }, [props.mId]);
      
    const getDetails = () => {
        axios({
            method: 'get',
            url: "menu/getMenuInfo",
            headers: hdr
          }).then((response) => {
            //console.log('menu obj MasterListPage...');
            setmenuDetails(response.data);
            //console.log(response.data);
          }).catch((error) => {
            console.log('MasterListPage err...',error);
            if(error.response) {
              console.log("Error occured while fetching data. Error message - " + error.message);
            }
        })
    }

    const getColumnDetails = () => {
        axios({
            method: 'get',
            url: "menu/assignedGrants", 
            headers: hdr
          }).then((response) => {
            //console.log('column details obj...',response.data);
            //response.data.grants_columns.sort((a, b) => a.FunctionPointId - b.FunctionPointId);
            setcolumnNamesJSON(response.data.grants_columns);
            //console.log(response.data.grants_columns);
          }).catch((error) => {
            console.log('err');
            console.log(error);
            if(error.response) {
              console.log("Error occured while fetching data. Error message - " + error.message);
            }
        })
    }


    return(
        menuDetails && columnNamesJSON  ? 
        <ListPageLayout 
            APIName={menuDetails.ApiName}
            EditPageName={menuDetails.EditUrl}
            ListPageName={menuDetails.MenuUrl}
            ListPageTitle={menuDetails.MenuName}
            SubTitle={menuDetails.SubTitle}
            TableName={menuDetails.MenuName}
            KeyFieldName={menuDetails.KeyField}
            columnNamesJSON={columnNamesJSON}
            viewState={props.viewState}   
            setViewState={props.setViewState}
        />
        :
        <></>
    );
};

MasterListPageCx.propTypes = {
    mId : PropTypes.string.isRequired
}