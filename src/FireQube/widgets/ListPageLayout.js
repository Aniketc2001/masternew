import * as React from 'react';
import {Box, Paper, Grid, ToggleButton, ToggleButtonGroup, Slide} from '@mui/material';
import '../../shared/styles/dx-styles.css';
import { alert, custom, confirm  } from 'devextreme/ui/dialog';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';





import DataGrid, {
    Column, Button, Editing, Grouping, SearchPanel, GroupPanel, Popup, Paging, Lookup,
    Form, FilterRow, HeaderFilter, Export, ColumnChooser, Font, Selection
  } from 'devextreme-react/data-grid';

import BxButton  from 'react-bootstrap/Button';
import { useNavigate,useLocation, useParams } from 'react-router-dom';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';


/* ListPageLayout Component Props 
    - ColumnVisibilityJSON (columnDisplayMap)
    - API Name (APIName)
    - Edit Page Name (EditPageName)
    - ID Column Name (KeyFieldName)
    - List Page Title (ListPageTitle)
    - TableName (TableName)
    - KeyFieldName (KeyFieldName)
    - ColumnNamesJSON (Columns) */



export default function ListPageLayout(props) {
  const m = new URLSearchParams(useLocation().search).get('m');
  const [gridDataSource, setgridDataSource] = useState([]);
  const navigate = useNavigate();

  const [displayDataGrid, setdisplayDataGrid] = useState(true);

  const [displayPageSize, setdisplayPageSize] = useState(12);
  const [displayFilterRow, setdisplayFilterRow] = useState(false);
  const [displayGroupPanel, setdisplayGroupPanel] = useState(false);

  const [openNotificationBar, setOpenNotificationBar] = React.useState(false); //Notification Bar Flag
  const [notificationBarMessage, setnotificationBarMessage] = React.useState(''); //Notification Message
  
  const [anchorElement, setAnchorElement] = React.useState(null);     //Anchor point for Popover
  const [openPopover, setOpenPopover] = React.useState(false);     //Display status for Popover

  
  const [checkerInfo,setCheckerInfo] = useState({
    CheckedBy: '',
    CheckedDate: '',
    CheckerRemarks: '',
    RequestByName: '',
    RequestDate: ''
  });
  
  const dataGrid = useRef(null);

  const hdr = {
      'mId': m
  };
  
  const handlePopoverOpen = (e) => {
    setOpenPopover(true);
    setAnchorElement(e);
  };

  const handlePopoverClose = () => {
    alert('close','close');
    setOpenPopover(false);
  };

  const handleCloseNotificationBar = () => {
    setOpenNotificationBar(false);
  };

  useEffect(() => {
    console.log('useeffect...');
    setdisplayDataGrid(false);
    getRecords();
  }, [props.APIName]);
  
  const getRecords =  () => {
      console.log('inside getrecords');
      axios({
        method: 'get',
        url: props.APIName, 
        headers: hdr
      }).then((response) => {
        console.log('listpage getrecords...');
        setgridDataSource(response.data);
        //console.log(response.data);
        setdisplayDataGrid(true);
      }).catch((error) => {
        console.log('list err');
        console.log(error);
        if(error.response) {
          console.log("Error occured while fetching data. Error message - " + error.message);
        }
    })
  }

  const renderMarkForDeleteStatus = (cellData) => {
    return (
      <div>
            {cellData.data.MarkedForDelete=="Y" ? 
              <i className={'bi-shield-fill-x'} style={{color:'red', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Marked for deletion'  />
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
                <i className={'bi-hourglass-split'} style={{color:'darkgray', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Waiting for approval' />
            :cellData.data.CheckerStatus=="R" ? 
                <i className={'bi-exclamation-circle-fill'} style={{color:'red', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Rejected by checker.'/>    
                :
                <i className={'bi-patch-check-fill'} style={{color:'darkorange', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Approved by checker.'/>    
            }
      </div>
    );
  }

  const renderEditButton = (cellData) => {
    return (
        <i className={'bi-pencil-square'} style={{color:'indigo', fontSize: '10pt',  cursor:'pointer'}} />
    );
  }

  const renderCustomButton = (cellData) => {
    return (
        <i className={'bi-gear-fill'} style={{color:'blueviolet', fontSize: '10pt', cursor:'pointer'}} title='Manage details' />
    );
  }
  
  const renderActiveStatus = (cellData) => {
    return (
      <div>
            {cellData.data.Active=="N" ? <i className={'bi-flag-fill'} style={{color:'red', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Inactive' />: <i className={'bi-flag-fill'} style={{color:'lightgreen', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Active' />}
      </div>
    );
  }
  
  const deleteRecord = (id) => {
    axios({
      method: 'delete',
      url: props.APIName + "/" + id,
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

  const validateSelection = (fg) => {
    const selectedRows = dataGrid.current.instance.getSelectedRowsData();
    let msg = 'Selected rows contains record(s) which are awaiting checker approval. <br/>Please deselect and review the selection.';

    const filteredData = selectedRows.filter((item) => {
      if(fg == 'del')
      {
        return item.CheckerStatus == 'W' || item.MarkedForDelete == 'Y';
      }
      else if(fg == 'act')
      {
        msg = 'Selected rows contains record(s) which are already active. <br/>Please deselect and review the selection.';
        return item.CheckerStatus == 'W' || item.Active == 'Y';
      }
      else if(fg == 'inact')
      {
        msg = 'Selected rows contains record(s) which are already inactive. <br/>Please deselect and review the selection.';
        return item.CheckerStatus == 'W' || item.Active == 'N';
      } 
    });

    console.log('filter...');
    console.log(filteredData.length);

    if(filteredData.length > 0){
      alert(msg,'Selection validation');
      return false;
    }
    
    return true;
  }

  const getSelectedRowIDs = () => {
    const selectedRows = dataGrid.current.instance.getSelectedRowsData();
    var selectedIDs = '';
    selectedRows.map(row => {
      selectedIDs = selectedIDs + row[`${props.KeyFieldName}`] + ',';
    });

    if(selectedIDs)
        selectedIDs = selectedIDs.substring(0,selectedIDs.length-1);

    return(selectedIDs);
  }

  const deleteButtonClick = () => {
      if(!validateSelection('del'))
        return;

      var ids = getSelectedRowIDs();
      if(ids){
        const vl = confirm('Confirm record deletion?<br/><br/><br/>' ,'Confirmation Alert');
        vl.then((dialogResult) => {
            if(dialogResult){
              axios({
                method: 'delete',
                url: props.APIName + "/" + ids,
                headers: {"mId": m}
              }).then((response) => {
                getRecords();
                setnotificationBarMessage('Action on selected record(s) successful!');
                setOpenNotificationBar(true);
              }).catch((error) => {
                if(error.response) {
                  if(error.response.status === 417) {
                    setnotificationBarMessage('Error occured while deleting the record(s)! <br/>' + error.message);
                    setOpenNotificationBar(true);
                  }
                }
              });                
            }
        });
      }
      else{
        setnotificationBarMessage('No records selected!');
        setOpenNotificationBar(true);
      }
  };

  const activeButtonClick = () => {
    if(!validateSelection('act'))
      return;
    
    var ids = getSelectedRowIDs();
      if(ids){
        const vl = confirm('Mark records as active?','Confirmation Alert');
        vl.then((dialogResult) => {
            if(dialogResult){
                axios({
                  method: 'put',
                  url: props.APIName + "/" + ids,
                  headers: {"mId": m, "actstate": 'Y'}
                }).then((response) => {
                  getRecords();
                  setnotificationBarMessage('Records marked as active!');
                  setOpenNotificationBar(true);
                }).catch((error) => {
                  if(error.response) {
                    if(error.response.status === 417) {
                      setnotificationBarMessage('Error occured while setting the active flag for the record(s)! <br/>' + error.message);
                      setOpenNotificationBar(true);
                    }
                  }
                });
            }
        });
      }
      else{
        setnotificationBarMessage('No records selected!');
        setOpenNotificationBar(true);
      }
  };

 
  const inactiveButtonClick = () => {
    if(!validateSelection('inact'))
      return;

    var ids = getSelectedRowIDs();
    if(ids){
      const vl = confirm('Mark records as inactive?','Confirmation Alert');
      vl.then((dialogResult) => {
          if(dialogResult){
            axios({
              method: 'put',
              url: props.APIName + "/" + ids,
              headers: {"mId": m, "actstate": 'N'}
            }).then((response) => {
              getRecords();
              setnotificationBarMessage('Records marked as inactive!');
              setOpenNotificationBar(true);
            }).catch((error) => {
              if(error.response) {
                if(error.response.status === 417) {
                  setnotificationBarMessage('Error occured while setting the inactive flag for the record(s)! <br/>' + error.message);
                  setOpenNotificationBar(true);
                }
              }
            });
         
          }
      });
    }
    else{
      setnotificationBarMessage('No records selected!');
      setOpenNotificationBar(true);
    }
  };

  const hidePopover = () => {
    setOpenPopover(false);
  }

  const handleClose = (e) => {
    e.stopPropagation();
    setOpenPopover(false);
  }

  const checkerStatusIconClick = (e) => {
    console.log('checker status');
    const requestDate =  e.data.CheckerInfo.RequestDate;
    const requestDateObj = new Date(requestDate);

    const checkedDate =  e.data.CheckerInfo.RequestDate;
    const checkedDateObj = new Date(checkedDate);

    setCheckerInfo({ RequestByName: e.data.CheckerInfo.RequestByName, RequestDate: requestDateObj.toLocaleDateString() + ' ' + requestDateObj.toLocaleTimeString() , CheckedBy: e.data.CheckerInfo.CheckedBy, CheckedDate: checkedDateObj.toLocaleDateString() + ' ' + checkedDateObj.toLocaleTimeString() , CheckerRemarks: e.data.CheckerInfo.CheckerRemarks});
    console.log(checkerInfo);
    setOpenPopover(true);

    setTimeout(hidePopover,6000);
  }

  const createButtonClick = () => {
    navigate(`/${props.EditPageName}/0?m=${m}`);
  }

  const editIconClick = (e) => {
    console.log('edit click');
    console.log(e);
    navigate(`/${props.EditPageName}/${e.key}?m=${m}`);
  };
  
  const customIconClick = (e) => {
    console.log('custom click');
    navigate(`/${props.CustomURL}/${e.key}?m=${m}`);
  };

  const deleteIconClick = (e) => {
    console.log(e.row);
  };

  const rowSelectionFunction = ({ currentSelectedRowKeys, selectedRowKeys, selectedRowsData }) => {
    const selectedRows = dataGrid.current.instance.getSelectedRowsData();
    const deletedRows = selectedRows.filter(row => row.MarkedForDelete === 'Y');
    deletedRows.map(row => {
      dataGrid.current.instance.deselectRows(row[`${props.KeyFieldName}`]);
    });
  };
      
  const getColumnVisibility = (columnName) => {
    const item = props.columnNamesJSON.columns.find(item => item.name === columnName);
    if (item) 
      return true; 
    else 
      return false;
  };


  const handleGridCellClick = (e) => {
    switch(e.columnIndex){
      case 2: //Checker status
        checkerStatusIconClick(e.row);
        break;
      case 3: // Active Status
        //checkerStatusIconClick(e.row);
        break;
      case 4: //Edit Button
        editIconClick(e.row);
        break;
      case 5:
        if(props.CustomField)
          customIconClick(e.row);
        break;

    }
    
  }

  const handleCheckBoxVisibility =  (e) => {
    //e.rowElement.style.backgroundColor = 'red';
  }


  return (
      true
      ?
      <Box   sx={{ p: 2,  paddingTop: 2, minHeight:'90vh', minWidth:'90vh',  backgroundColor: 'white', fontFamily:'Poppins' }}>
        <h2 className='PageTitle'>{props.ListPageTitle}</h2>
        <p className='PageSubTitle'>{props.SubTitle}</p>
        <Grid container spacing={1} >
          <Grid item xm={1} >
            <BxButton
              variant="primary"
              size="sm"
              style={{ textTransform: "none"}}
              onClick={createButtonClick}
            >
              <i className={'bi-save'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Create New
            </BxButton>
          </Grid>
          <Grid item xm={1}>
            <BxButton
              variant="primary"
              size="sm"
              style={{ textTransform: "none" }}
              onClick={deleteButtonClick}
            >
              <i className={'bi-x-circle'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Delete Records
            </BxButton>
          </Grid>                  
          <Grid item xm={1}>
            <BxButton
              variant="primary"
              size="sm"
              style={{ textTransform: "none" }}
              onClick={activeButtonClick}
            >
              <i className={'bi-calendar2-x'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Active
            </BxButton>
          </Grid>
          <Grid item xm={1}>
            <BxButton
              variant="secondary"
              size="sm"
              style={{ textTransform: "none" }}
              color="success"
              onClick={inactiveButtonClick}
            >
              <i className={'bi-card-checklist'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Inactive
            </BxButton>
          </Grid>
          <Grid item xm={1}>
            <BxButton
              variant="primary"
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
        {props.columnNamesJSON && gridDataSource && props.KeyFieldName && displayDataGrid?
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
              keyExpr={props.KeyFieldName}
              focusedRowEnabled={false}
              onSelectionChanged={rowSelectionFunction}
              onCellClick={handleGridCellClick}
              onRowPrepared={handleCheckBoxVisibility}
              loadPanel={true}
            >
              <Selection mode="multiple"  />
              <Paging enabled={true} pageSize={displayPageSize} />
              <SearchPanel visible={true} />
              <GroupPanel visible={displayGroupPanel} />
              <FilterRow visible={displayFilterRow} />
              <HeaderFilter visible={true}/>
              <ColumnChooser enabled={true} />

              <Export enabled={true}   />
              <Column caption="" cellRender={renderMarkForDeleteStatus} width={25} />
              <Column caption="" cellRender={renderCheckerStatus} width={25} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}   />
              <Column caption="" cellRender={renderActiveStatus} width={25} />
              <Column caption="" cellRender={renderEditButton}  width={28} onClick={editIconClick}  />
              <Column caption="" cellRender={renderCustomButton} visible={props.CustomField===true} onClick={editIconClick} width={28} />

              {props.columnNamesJSON.map(column => (
                  <Column
                    dataField={column.FunctionPointName}
                    caption={column.ColumnCaption}
                  />
              ))}

            </DataGrid>
            <Snackbar
                open={openNotificationBar}
                onClose={handleCloseNotificationBar}
                autoHideDuration={6000}
                anchorOrigin={{vertical:'bottom', horizontal:'center'}}
                
            >
                 <Alert onClose={handleCloseNotificationBar} severity="info" variant="filled" sx={{ width: '100%' }}>
                    {notificationBarMessage}
                </Alert>
            </Snackbar>
            <Popover
                id="mouse-over-popover"
                sx={{
                pointerEvents: 'none', zIndex: 9999
                }}
                open={openPopover}
                anchorEl={anchorElement}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                }}
                onClose={handleClose}
              >
                <Paper elevation={3} sx={{p:2, backgroundColor:'white', width:300, fontFamily:'Poppins'}}>
                    <Alert variant="filled" severity="info" >
                        Checker Information
                    </Alert>
                    <br/>
                    <Typography variant="button" display="block" gutterBottom>
                        Requester Details:
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                        {checkerInfo.RequestDate}
                    </Typography>                    
                    <Typography variant="overline" sx={{fontWeight:'bold',fontSize:14}} display="block" gutterBottom>
                        {checkerInfo.RequestByName}
                    </Typography>
                   
                    <br/>
                    <Typography variant="button" display="block" gutterBottom>
                        Checker Details:
                    </Typography>

                    <Typography variant="caption" display="block" gutterBottom>
                        {checkerInfo.CheckedDate}
                    </Typography>
                    <Typography variant="overline" sx={{fontWeight:'bold',fontSize:14}} display="block" gutterBottom>
                        {checkerInfo.CheckedBy}
                    </Typography>                    
                    <Typography variant="body2" display="block" gutterBottom>
                        {checkerInfo.CheckerRemarks}
                    </Typography>

                  
                </Paper>
            </Popover>
        </Box>
        :<></>
        }
      </Box>
      :
      <></>
    );
}