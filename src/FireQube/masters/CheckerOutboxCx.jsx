import * as React from 'react';
import {Box, Paper, Grid, ToggleButton, ToggleButtonGroup, Slide} from '@mui/material';
import '../../shared/styles/dx-styles.css';
import { alert, custom, confirm  } from 'devextreme/ui/dialog';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import DataComparisonDialog from './DataComparisonDialog';


import DataGrid, {
    Column, Button, Editing, Grouping, SearchPanel, GroupPanel, Popup, Paging, Lookup,
    Form, FilterRow, HeaderFilter, Export, ColumnChooser, Font, Selection
  } from 'devextreme-react/data-grid';

import BxButton  from 'react-bootstrap/Button';
import { useNavigate,useLocation, useParams } from 'react-router-dom';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function CheckerOutboxCx(props) {
  const m = new URLSearchParams(useLocation().search).get('m');
  const [CheckerQueues, setCheckerQueues] = useState([]);
  const hdrs = {
     'mId': m,
     'clr': 'outbox'
  };

  const [gridDataSource, setgridDataSource] = useState([]);
  const navigate = useNavigate();

  const [displayPageSize, setdisplayPageSize] = useState(12);
  const [displayFilterRow, setdisplayFilterRow] = useState(false);
  const [displayGroupPanel, setdisplayGroupPanel] = useState(false);

  const [openNotificationBar, setOpenNotificationBar] = React.useState(false); //Notification Bar Flag
  const [notificationBarMessage, setnotificationBarMessage] = React.useState(''); //Notification Message
  
  const [anchorElement, setAnchorElement] = React.useState(null);     //Anchor point for Popover
  const [openPopover, setOpenPopover] = React.useState(false);     //Display status for Popover

  const [beforeData, setbeforeData] = React.useState();     
  const [afterData, setafterData] = React.useState();     
  const [dataChanges, setdataChanges] = React.useState();     


  const [checkerInfo,setCheckerInfo] = useState({
    CheckedBy: '',
    CheckedDate: '',
    CheckerRemarks: '',
    RequestByName: '',
    RequestDate: ''
  });
  
  const dataGrid = useRef(null);

  const handleCloseNotificationBar = () => {
    setOpenNotificationBar(false);
  };

  useEffect(() => {
    getRecords();
    // eslint-disable-next-line
  }, []);
  
  const getRecords = () => {
    axios({
        method: 'get',
        url: "checkerQueue",
        headers: hdrs
      }).then((response) => {
        setgridDataSource(response.data);
        console.log(response.data);
      }).catch((error) => {
        if(error.response) {
          console.log("Error occured while fetching data. Error message - " + error.message);
        }
      })
  }

  const getSelectedRowIDs = () => {
    const selectedRows = dataGrid.current.instance.getSelectedRowsData();
    var selectedIDs = '';
    selectedRows.map(row => {
      selectedIDs = selectedIDs + row["CheckerQueueId"] + ',';
    });

    if(selectedIDs)
        selectedIDs = selectedIDs.substring(0,selectedIDs.length-1);

    return(selectedIDs);
  }


  const closeRecords = () => {
    var ids = getSelectedRowIDs();
    if(ids){
      const vl = confirm('Selected records would be removed from the Maker Queue<br/>Confirm removal from the list?','Confirmation Alert');
      vl.then((dialogResult) => {
          if(dialogResult){    
            axios({
              method: 'put',
              url: "checkerQueue/closeentries/" + ids,
              headers: hdrs
            }).then((response) => {
              getRecords();
              setnotificationBarMessage('Entries removed successfully from the maker outbox!');
              setOpenNotificationBar(true);
            }).catch((error) => {
              if(error.response) {
                console.log("Error occured while fetching data. Error message - " + error.message);
              }
            });
          }
          else{
            setnotificationBarMessage('No records selected!');
            setOpenNotificationBar(true);
          }
      });
    }
  }

   const renderCheckerStatus = (cellData) => {
    return (
      <div>
            {cellData.data.CheckerStatus=="W" ? 
                <i className={'bi-hourglass-split'} style={{color:'darkgray', fontSize: '10pt', cursor:'pointer'}} title='Waiting for approval' />
            :cellData.data.CheckerStatus=="R" ? 
                <i className={'bi-exclamation-circle-fill'} style={{color:'red', fontSize: '10pt', cursor:'pointer'}} title='Rejected by checker. Redo edit to restore.'/>    
                :
                <i className={'bi-patch-check-fill'} style={{color:'darkorange', fontSize: '10pt', cursor:'pointer'}} title='Approved by checker.'/>    
            }
      </div>
    );
  }

  const renderEditButton = (cellData) => {
    return (
        <i className={'bi-search'} style={{color:'indigo', fontSize: '10pt', cursor:'pointer'}} title='View details' />
    );
  }

  const renderDiffButton = (cellData) => {
      return (
        cellData.data.DataPacket?
        <i className={'bi-sliders'} style={{color:'purple', fontSize: '10pt',  cursor:'pointer'}} title='View comparision details'/>:<></>
    );
  }
  
  const editIconClick = (e) => {
    navigate('/' + e.data.DataUrl + '&clr=m');
  };

  const diffIconClick = (e) => {
    try{
      const tmpData = JSON.parse(e.data.DataPacket);

      setbeforeData(tmpData.before);
      setafterData(tmpData.after);
      setdataChanges(tmpData.changes); 

      console.log(beforeData);
      console.log(afterData);
      console.log('data changes');
      console.log(dataChanges);

      setOpenPopover(true);
    }
    catch(ex){
      setnotificationBarMessage('Checker details not available for this entry!');
      setOpenNotificationBar(true);
    }
  };

  const hidePopover = () =>{
    setOpenPopover(false);
  }

  const rowSelectionFunction = ({ currentSelectedRowKeys, selectedRowKeys, selectedRowsData }) => {
    const selectedRows = dataGrid.current.instance.getSelectedRowsData();
    const rejectedRows = selectedRows.filter(row => row.CheckerStatus != 'R');
    console.log('rejected...');
    console.log(rejectedRows);
    rejectedRows.map(row => {
      dataGrid.current.instance.deselectRows(row["CheckerQueueId"]);
    });
  };
      
  const handleGridCellClick = (e) => {
    console.log(e);
    switch(e.columnIndex){
      case 2: //Edit Button
        editIconClick(e.row);
        break;
      case 3: //Diff Button
        diffIconClick(e.row);
        break;
    }
    
  }

  
  
  return (
      <Box sx={{ margin:0, p: 0.1,  padding: 3, minHeight:'90vh', backgroundColor: 'white'}}>
        <Grid container spacing={1}  >
          <Grid item xs={8} >
             <h2>Maker Outbox</h2>
             <p style={{color:'gray'}}>Review the data updates initiated by you</p>
          </Grid>
          <Grid item xs={4}  >
            <BxButton
              type="primary"
              size="sm"
              style={{ textTransform: "none" }}
              onClick={closeRecords}
            >
              <i className={'bi-card-checklist'} style={{ fontSize: '10pt', marginRight: '10px'}} />
              Close Records
            </BxButton>
            &nbsp;
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
        <Box margin={0} padding={0}>
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
              keyExpr="CheckerQueueId"
              focusedRowEnabled={false}
              onSelectionChanged={rowSelectionFunction}
              onCellClick={handleGridCellClick}
            >
              <Selection mode="multiple"  />
              <Paging enabled={true} pageSize={displayPageSize} />
              <SearchPanel visible={true} />
              <GroupPanel visible={displayGroupPanel} />
              <FilterRow visible={displayFilterRow} />
              <HeaderFilter visible={false}/>
              <ColumnChooser enabled={true} />

              <Export enabled={true}   />
              <Column caption="" cellRender={renderCheckerStatus} width={25}  />
              <Column caption="" cellRender={renderEditButton}  width={30} onClick={editIconClick}  />
              <Column caption="" cellRender={renderDiffButton}  width={30} onClick={diffIconClick}  />

              <Column dataField="RequestDate" caption="Request Date"  width={200}  dataType="date" format="dd-MMM-yyyy hh:mm:ss a"/>
              <Column dataField="RequestByName" caption="Requested By"  width={200} />
              <Column dataField="RequestDescription" caption="Request Description"  width={600} />
   
            </DataGrid>
        </Box>
        <Snackbar
            open={openNotificationBar}
            onClose={handleCloseNotificationBar}
            autoHideDuration={3000}
            anchorOrigin={{vertical:'bottom', horizontal:'center'}}
            
        >
              <Alert onClose={handleCloseNotificationBar} severity="success" variant="filled" sx={{ width: '100%' }}>
                {notificationBarMessage}
            </Alert>
        </Snackbar>
        {beforeData && dataChanges?
          <DataComparisonDialog
              openPopover={openPopover}
              beforeData={beforeData}
              afterData={afterData}
              dataChanges={dataChanges}
              hidePopover={hidePopover}
          />
        :<></>}
      </Box>
    );
}