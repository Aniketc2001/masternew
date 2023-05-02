import * as React from 'react';
import {Box, Paper, Grid, ToggleButton, ToggleButtonGroup} from '@mui/material';
import '../../shared/styles/dx-styles.css';
import { alert, custom, confirm  } from 'devextreme/ui/dialog';

import DataGrid, {
    Column, Button, Editing, Grouping, SearchPanel, GroupPanel, Popup, Paging, Lookup,
    Form, FilterRow, HeaderFilter, Export, ColumnChooser, Font, Selection
  } from 'devextreme-react/data-grid';

import BxButton  from 'react-bootstrap/Button';
import { useNavigate,useLocation, useParams } from 'react-router-dom';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function AccessLevelListDx() {
  const m = new URLSearchParams(useLocation().search).get('m');
  const [gridDataSource, setgridDataSource] = useState([]);
  const navigate = useNavigate();
  const [displayPageSize, setdisplayPageSize] = useState(12);
  const [displayFilterRow, setdisplayFilterRow] = useState(true);
  const [displayGroupPanel, setdisplayGroupPanel] = useState(true);
  
  const dataGrid = useRef(null);
  
  const [columnDisplayMap, setcolumnDisplayMap] = useState({
      columns: [
          {name: 'FirstName', visibility: true},
          {name: 'LastName', visibility: false},
      ]
    }
  );

  const config = {
    headers: {
      'mId': m
  }};
  

  useEffect(() => {
    getRecords();
    // eslint-disable-next-line
  }, []);
  
  const getRecords = async () => {
    try {
      let response = await axios.get("accessLevel", config);
      setgridDataSource(response.data);
    } catch (error) {
      console.log("Error occured while fetching data. Error message - " + error.message);
    }
  }

  const renderMarkForDeleteStatus = (cellData) => {
    return (
      <div>
            {cellData.data.MarkedForDelete=="Y" ? 
              <i className={'bi-shield-fill-x'} style={{color:'purple', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Marked for deletion'  />
              :
              <></>
            }
      </div>
    );
  }

  const renderCheckerStatus = (cellData) => {
    return (
      <div>
            {cellData.data.CheckerStatus=="W" ? 
                <i className={'bi-hourglass-split'} style={{color:'darkgray', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Waiting for approval'  />
            :cellData.data.CheckerStatus=="R" ? 
                <i className={'bi-exclamation-circle-fill'} style={{color:'red', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Rejected by checker. Redo edit to restore.'/>    
                :
                <i className={'bi-patch-check-fill'} style={{color:'darkorange', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Approved by checker.'/>    
            }
      </div>
    );
  }

  const renderEditButton = (cellData) => {
    return (
        <i className={'bi-pencil-square'} style={{color:'indigo', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} />
    );
  }

  
  const renderActiveStatus = (cellData) => {
    return (
      <div>
            {cellData.data.Active=="N" ? <i className={'bi-flag-fill'} style={{color:'red', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Inactive' />: <i className={'bi-flag-fill'} style={{color:'lightgreen', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Active' />}
      </div>
    );
  }
  
  const deleteRecord = async (id) => {
    await axios({
      method: 'delete',
      url: "accessLevel/" + id,
      headers: {"mId": m}
    }).then((response) => {
      getRecords();
    }).catch((error) => {
      if(error.response) {
        if(error.response.status === 417) {
          console.log("Error occured while deleting record..");
        }
      }
    })
  }

  const showDialog = () => {
      const vl = confirm('Confirm record deletion?','Confirmation Alert');
      vl.then((dialogResult) => {
          if(dialogResult){
              alert("Selected records are now marked for deletion.", "Delete Confirmation");
          }
      });
      //myDialog.show();
  };

  const checkerStatusClick = (e) => {
    console.log(e);
    alert(e.data.AccessLevelName,'Checker Details');
  }

  const newIconClick = () => {
    navigate(`/accLvlEdit/0`);
  }

  const editIconClick = (e) => {
    console.log('edit click');
    console.log(e);
    navigate(`/accLvlEdit/${e.key}`);
  };

  const deleteIconClick = (e) => {
    console.log(e.row);
  };

  const rowSelectionFunction = ({ currentSelectedRowKeys, selectedRowKeys, selectedRowsData }) => {
    const selectedRows = dataGrid.current.instance.getSelectedRowsData();
    const deletedRows = selectedRows.filter(row => row.MarkedForDelete === 'Y');
    deletedRows.map(row => {
      dataGrid.current.instance.deselectRows(row.Id);
    });
  };
      
  const getColumnVisibility = (columnName) => {
    const item = columnDisplayMap.columns.find(item => item.name === columnName);
    if (item) 
      return item.visibility; 
    else 
      return true;
  };


  const handleGridCellClick = (e) => {
    switch(e.columnIndex){
      case 2: //Checker status
        checkerStatusClick(e.row);
        break;
      case 3: // Active Status
        checkerStatusClick(e.row);
        break;
      case 4: //Edit Button
        editIconClick(e.row);
        break;
    }
    
  }

  const handleCheckBoxVisibility =  (e) => {
    //e.rowElement.style.backgroundColor = 'red';
  }


  return (
      <Box elevation={6} sx={{ p: 1,  paddingTop: 2, backgroundColor: 'white' }}>
        <h2>Application Access Levels</h2>
        <br/>
        <Grid container spacing={1} >
          <Grid item xm={1} >
            <BxButton
              type="primary"
              size="sm"
              style={{ textTransform: "none"}}
              onClick={newIconClick}
            >
              <i className={'bi-save'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Create New
            </BxButton>
          </Grid>
          <Grid item xm={1}>
            <BxButton
              type="contained"
              size="sm"
              style={{ textTransform: "none" }}
              onClick={showDialog}
            >
              <i className={'bi-x-circle'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Delete Records
            </BxButton>
          </Grid>                  
          <Grid item xm={1}>
            <BxButton
              type="contained"
              size="sm"
              style={{ textTransform: "none" }}
            >
              <i className={'bi-calendar2-x'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Active
            </BxButton>
          </Grid>
          <Grid item xm={1}>
            <BxButton
              type="contained"
              variant="secondary"
              size="sm"
              style={{ textTransform: "none" }}
              color="success"
            >
              <i className={'bi-card-checklist'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Inactive
            </BxButton>
          </Grid>
          <Grid item xm={1}>
            <BxButton
              type="primary"
              size="sm"
              style={{ textTransform: "none" }}
            >
              <i className={'bi-card-checklist'} style={{ fontSize: '10pt', marginRight: '10px'}} />
              Advanced Search
            </BxButton>
          </Grid>   
          <Grid item xm={4}>
            <ToggleButtonGroup
                size="small"
                aria-label="text alignment"
                sx={{ marginTop:0, height:'30px',  backgroundColor:'whitesmoke'}}
                >
                <ToggleButton value="left" aria-label="left aligned" onClick={()=> setdisplayPageSize(12)} hint="Pagesize: 12">
                    12
                </ToggleButton>
                <ToggleButton value="center" aria-label="centered" onClick={()=> setdisplayPageSize(20)}>
                    20
                </ToggleButton>
                <ToggleButton value="right" aria-label="right aligned" onClick={()=> setdisplayPageSize(50)}>
                    50
                </ToggleButton>
                <ToggleButton value="justify" aria-label="justified" onClick={()=> setdisplayPageSize(100)}>
                    100
                </ToggleButton>
                <ToggleButton  value="justify" aria-label="justified" onClick={()=> setdisplayFilterRow(!displayFilterRow)}>
                    <i className={'bi-binoculars-fill'} style={{ color:'darkslategray', fontSize: '12pt'}} />
                </ToggleButton>
                <ToggleButton value="justify" aria-label="justified" onClick={()=> setdisplayGroupPanel(!displayGroupPanel)}>
                    <i className={'bi-bar-chart-steps'} style={{ color:'darkslategray', fontSize: '12pt'}} />
                </ToggleButton>
                </ToggleButtonGroup>
          </Grid>   
        </Grid>
        <Box margin={1}>
            <DataGrid
              ref={dataGrid}
              dataSource={gridDataSource}
              showBorders={false}
              showRowLines={true}
              showColumnLines={false}
              highlightChanges={true}
              rowAlternationEnabled={true}
              autoNavigateToFocusedRow={true}
              allowColumnReordering={true}
              allowColumnResizing={true}
              columnAutoWidth={true}
              keyExpr="AccessLevelId"
              focusedRowEnabled={true}
              onSelectionChanged={rowSelectionFunction}
              onCellClick={handleGridCellClick}
              onRowPrepared={handleCheckBoxVisibility}
            >
              <Selection mode="multiple" />
              <Paging enabled={true} pageSize={displayPageSize} />
              <SearchPanel visible={true} />
              <GroupPanel visible={displayGroupPanel} />
              <FilterRow visible={displayFilterRow} />
              <HeaderFilter visible={true}/>
              <ColumnChooser enabled={true} />

              <Export enabled={true}   />
              <Column caption="" cellRender={renderMarkForDeleteStatus} width={25} />
              <Column caption="" cellRender={renderCheckerStatus} width={25} />
              <Column caption="" cellRender={renderActiveStatus} width={25} />
              <Column caption="" cellRender={renderEditButton}  width={35} onClick={editIconClick} />
              <Column dataField="AccessLevelCode" visible={getColumnVisibility('AccessLevelCode')} onClick={checkerStatusClick} />
              <Column dataField="AccessLevelName" visible={getColumnVisibility('AccessLevelName')}/>
              <Column dataField="AccessLevelDescription" visible={getColumnVisibility('AccessLevelDescription')}/>
              <Column dataField="AppName"  visible={getColumnVisibility('AppName')} />
            </DataGrid>
        </Box>
      </Box>
    );
}