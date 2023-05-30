import * as React from 'react';
import {Box, Paper, Grid, ToggleButton, ToggleButtonGroup, Slide} from '@mui/material';
import '../../shared/styles/dx-styles.css';
import { alert, custom, confirm  } from 'devextreme/ui/dialog';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { getFormattedDate } from '../../shared/scripts/common';
import { DateBox } from 'devextreme-react';


import DataGrid, {
    Column, Button, Editing, Grouping, SearchPanel, GroupPanel, Popup, Paging, Lookup,
    Form, FilterRow, HeaderFilter, Export, ColumnChooser, Font, Selection, FilterPanel
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



export default function TransactionListPageLayout(props) {
  const m = new URLSearchParams(useLocation().search).get('m');
  const [gridDataSource, setgridDataSource] = useState([]);
  const navigate = useNavigate();

  const [displayDataGrid, setdisplayDataGrid] = useState(true);

  const [displayPageSize, setdisplayPageSize] = useState(12);
  const [displayFilterRow, setdisplayFilterRow] = useState(false);
  const [displayGroupPanel, setdisplayGroupPanel] = useState(false);
  const [displayFilterPanel, setdisplayFilterPanel] = useState(false);

  const [openNotificationBar, setOpenNotificationBar] = React.useState(false); //Notification Bar Flag
  const [notificationBarMessage, setnotificationBarMessage] = React.useState(''); //Notification Message
  
  const [anchorElement, setAnchorElement] = React.useState(null);     //Anchor point for Popover
  const [openPopover, setOpenPopover] = React.useState(false);     //Display status for Popover

  const [anchorElDates, setAnchorElDates] = React.useState(null);     //Anchor point for Popover
  const [openDatesPopover, setOpenDatesPopover] = React.useState(false);     //Display status for Popover

  const [fromDate, setFromDate] = React.useState(new Date());
  const maxToDate = new Date(2030, 11, 31);
  const [toDate, setToDate] = React.useState(new Date());

  const [dateMsg, setDateMsg] = useState(null);
  const [datebtn, setDateBtn] = useState("TODAY");

  
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
    setdisplayDataGrid(false);
    getRecords();
    if(props.APIName === props.viewState.listPageName)
      renderViewState();
  }, [datebtn]);
  

  const renderViewState = () => {
    dataGrid.current.instance.pageIndex(props.viewState.pageNumber);
    setdisplayDataGrid(true);
  }

  const updateViewState = () => {
    var currpage = "";
    try{
      currpage =dataGrid.current.instance.pageIndex();
    }
    catch(ex){}
    console.log('currpage',currpage);
    props.setViewState({...props.viewState, dataSource: gridDataSource, pageNumber: currpage, listPageName: props.APIName });
  }

  const handle7DaysClick = () => {
    var frdt =  getFormattedDate(new Date());
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Subtract 6 days to get the start date
    var todt = getFormattedDate(sevenDaysAgo);

    setDateBtn('LAST7DAYS');
    props.setViewState({...props.viewState, fromDate: todt, toDate: frdt });
    props.viewState.fromDate = todt;
    props.viewState.toDate = frdt;

    getRecords();
  }

  const handleTodayClick = () => {
    var frdt =  getFormattedDate(new Date());
    var todt = getFormattedDate(new Date());

    setDateBtn('TODAY');
    props.setViewState({...props.viewState, fromDate: todt, toDate: frdt });
    props.viewState.fromDate = todt;
    props.viewState.toDate = frdt;

    getRecords();
  }

  const handle30DaysClick = () => {
    var frdt =  getFormattedDate(new Date());
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // Subtract 29 days to get the start date
    var todt = getFormattedDate(thirtyDaysAgo);

    setDateBtn('LAST30DAYS');
    props.setViewState({...props.viewState, fromDate: todt, toDate: frdt });
    props.viewState.fromDate = todt;
    props.viewState.toDate = frdt;

    getRecords();
  }

  const handleCustomDatesClick = (event) => {
    console.log('event',event);
    setAnchorElDates(event.currentTarget);
    setOpenDatesPopover(true);
  }

  const handleCustomDatesClose = () => {
    // Check if both from date and to date are selected
    if (!fromDate || !toDate) {
      alert('Please specify the date range!');
      return;
    }

    // Check if to date is greater than from date
    if (toDate < fromDate) {
      alert("'To date' should be greater than 'From date'");
      return;
    }
    if (fromDate > maxToDate) {
      alert("'From date' should be less than 'To date'");
      return;
    }

    props.setViewState({...props.viewState, fromDate: getFormattedDate(fromDate), toDate: getFormattedDate(toDate) });
    props.viewState.fromDate = getFormattedDate(fromDate);
    props.viewState.toDate = getFormattedDate(toDate);

    setDateBtn('CUSTOM');
    getRecords();


    setOpenDatesPopover(false);
  };

  const handleFromDateChange = (e) => {
    const selectedFromDate = e.value;
    setFromDate(selectedFromDate);
  };
  const handleToDateChange = (e) => {
    setToDate(e.value);
    console.log(e.value);
  }

  const getRecords =  () => {
      //console.log('inside getrecords');
      var frdt = props.viewState.fromDate;
      var todt = props.viewState.toDate;
      var msg = "";
      
      if(frdt !== todt)
        msg = "Displaying list of bookings between " + frdt + " and " + todt;
      else
        msg = "Displaying list of bookings for " + frdt ;

      if(datebtn === "TODAY")
        msg = "Displaying list of bookings for Today...";
      else if(datebtn === "LAST7DAYS")
        msg = "Displaying list of bookings for last 7 days...";
      else if(datebtn === "LAST30DAYS")
        msg = "Displaying list of bookings for last 30 days...";
      
      console.log('msg',msg);
      setDateMsg(msg);

      axios({
        method: 'get',
        url: props.APIName, 
        headers: {mId: m, frdt: frdt, todt: todt}
      }).then((response) => {
        //console.log('listpage getrecords...');
        setgridDataSource(response.data);
        console.log('getrecords',response.data);
        setdisplayDataGrid(true);
        updateViewState();
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
            :cellData.data.CheckerStatus=="A" ? 
                <i className={'bi-patch-check-fill'} style={{color:'darkorange', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Approved by checker.'/>
            :<></>    
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
    updateViewState();
    navigate(`/${props.EditPageName}/0?m=${m}`);
  }

  const editIconClick = (e) => {
    updateViewState();
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
    console.log(e);
    switch(e.column.name){
      case "CHECKER": //Checker status
        if(e.data.CheckerStatus !== "D")
          checkerStatusIconClick(e.row);
        break;
      case "ACTIVE": // Active Status
        //checkerStatusIconClick(e.row);
        break;
      case "EDIT": //Edit Button
        editIconClick(e.row);
        break;
      case "CUSTOM":
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
        <p className='PageSubTitle'>{props.SubTitle} <span style={{paddingLeft:'20px',color:'blue'}}>{dateMsg}</span></p>
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
              onClick={getRecords}
            >
              <i className={'bi-arrow-repeat'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Refresh Data
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
          <Grid item xm={9}>
                  <BxButton
                  variant="secondary"
                  size="sm"
                  onClick={handleTodayClick}
                  style={{ textTransform: "none",fontSize: '8pt',marginRight:'5px',marginLeft:'15px' }}
                  >
                    <i className={'bi-thermometer'} style={{ fontSize: '10pt', marginRight: '2px'}} />
                    Today
                  </BxButton>
                  <BxButton
                  variant="secondary"
                  size="sm"
                  onClick={handle7DaysClick}
                  style={{ textTransform: "none",fontSize: '8pt',marginRight:'5px' }}
                  >
                    <i className={'bi-thermometer-half'} style={{ fontSize: '10pt', marginRight: '2px'}} />
                    Last 7 days
                  </BxButton>
                  <BxButton
                  variant="secondary"
                  size="sm"
                  onClick={handle30DaysClick}
                  style={{ textTransform: "none",fontSize: '8pt',marginRight:'5px' }}
                  >
                    <i className={'bi-thermometer-high'} style={{ fontSize: '10pt', marginRight: '2px'}} />
                    Last 30 days
                  </BxButton>
                  <BxButton
                  variant="secondary"
                  size="sm"
                  onClick={handleCustomDatesClick}
                  style={{ textTransform: "none",fontSize: '8pt',marginRight:'20px' }}
                  >
                    <i className={'bi-thermometer-snow'} style={{ fontSize: '10pt', marginRight: '2px'}} />
                    Custom
                  </BxButton>
                    <Popover
                      id='dates-popover'
                      open={openDatesPopover}
                      anchorEl={anchorElDates}
                      onClose={handleCustomDatesClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <Paper elevation={0} sx={{ width: "430px", height: "80px", p: 2, backgroundColor:'lightgoldenrodyellow' }}>
                        <Grid container gap={3} alignItems="baseline">
                          <DateBox width={120} value={fromDate} onValueChanged={handleFromDateChange} stylingMode="underlined" label='From Date' labelMode='floating' displayFormat="dd-MMM-yyyy" />
                          <DateBox width={120} max={maxToDate} value={toDate} onValueChanged={handleToDateChange} stylingMode="underlined" label='To Date' labelMode='floating' displayFormat="dd-MMM-yyyy" />
                          <BxButton
                            variant="primary"
                            size="sm"
                            style={{ textTransform: "none", fontSize: '9pt', marginRight: '20px', marginTop: '5px', height: "29px" }} 
                            onClick={handleCustomDatesClose}
                          ><i className={'bi-thermometer-snow'} style={{ fontSize: '10pt', marginRight: '2px' }} />
                            Set Dates
                          </BxButton>
                        </Grid>
                      </Paper>
                    </Popover>
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
                <ToggleButton  value="justify" aria-label="justified" onClick={()=> setdisplayFilterRow(!displayFilterRow)} title="Enable Column Filters">
                    <i className={'bi-binoculars-fill'} style={{ color:'darkslategray', fontSize: '12pt'}} />
                </ToggleButton>
                <ToggleButton value="justify" aria-label="justified" onClick={()=> setdisplayFilterPanel(!displayFilterPanel)} title="Enable Query Filters">
                    <i className={'bi-funnel-fill'} style={{ color:'darkslategray', fontSize: '12pt'}} />
                </ToggleButton>                
                <ToggleButton value="justify" aria-label="justified" onClick={()=> setdisplayGroupPanel(!displayGroupPanel)} title="Display Column Grouping">
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
              showColumnLines={true}
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
            >
              <Selection mode="multiple"  />
              <Paging enabled={true} pageSize={displayPageSize} />
              <SearchPanel visible={true} />
              <GroupPanel visible={displayGroupPanel} />
              <FilterRow visible={displayFilterRow} />
              <FilterPanel visible={displayFilterPanel}/>
              <HeaderFilter visible={true}/>
              <ColumnChooser enabled={true} />

              <Export enabled={true}   />
              <Column name="DELETE" key="1" caption="" cellRender={renderMarkForDeleteStatus} width={25} visible={props.DeleteStatusColumnVisibility} />
              <Column name="CHECKER" key="2" caption="" cellRender={renderCheckerStatus} width={25} visible={props.CheckerStatusColumnVisibility} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}   />
              <Column name="ACTIVE" key="3" caption="" cellRender={renderActiveStatus} width={25} />
              <Column name="EDIT" key="4" caption="" cellRender={renderEditButton}  width={29} onClick={editIconClick}  />
              <Column name="CUSTOM" key="5" caption="" cellRender={renderCustomButton} visible={props.CustomField===true} onClick={editIconClick} width={28} />

              {props.columnNamesJSON.map(column => (
                  <Column
                    dataField={column.FunctionPointName}
                    caption={column.ColumnCaption}
                    key={column.FunctionPointName}
                  />
              ))}

            </DataGrid>
            <p style={{color:'grey',fontSize:'8pt',paddingTop:'3px'}}>Displaying a total list of {gridDataSource.length} record(s)</p>
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