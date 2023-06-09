import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Box, Paper, FormControl, FormGroup, InputLabel, Input, Typography,  styled, TextField, MenuItem,
  Stack, Divider, FormControlLabel, Checkbox, Alert, Grid, Snackbar, Autocomplete, CssBaseline
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

import { alert, custom, confirm  } from 'devextreme/ui/dialog';
import { SelectBox } from 'devextreme-react/select-box';

import { getUrlToRedirectPostCheckerAction  } from '../../shared/scripts/globalfuncs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { getFormattedDate } from '../../shared/scripts/common';
import BxButton  from 'react-bootstrap/Button';

import '../../shared/styles/dx-styles.css';
import DataGrid, {
  Column,  Editing, Grouping, SearchPanel, GroupPanel, Popup, Paging, Lookup,
  Form, FilterRow, HeaderFilter, Export, ColumnChooser, Font, Selection, Toolbar, ToolbarItem, Item, Button
} from 'devextreme-react/data-grid';


export default function EditPageLayout(props) {
  const navigate = useNavigate();
  const {id} = useParams();
  const [metadata, setMetaData] = useState([]);     
  const [baseObj, setbaseObj] = useState(props.initialVal);     //InitialVal
  const m = new URLSearchParams(useLocation().search).get('m');
  const clr = new URLSearchParams(useLocation().search).get('clr');
  const [showAR, setShowAR] = useState(false);
  const [ancillaryData,setancillaryData] = useState(props.ancillaryData);   
  const redirectTo = getUrlToRedirectPostCheckerAction(clr, "/" + props.listPageName +  "?m=" + m);
  const [openNotificationBar, setOpenNotificationBar] = React.useState(false); //Notification Bar Flag
  const [notificationBarMessage, setnotificationBarMessage] = React.useState(''); //Notification Message
  const [openRejectDialog,setopenRejectDialog] = React.useState(false);
  const [rejectReason,setrejectReason] = React.useState("");
  const [detailGridColumns, setdetailGridColumns] = useState(props.detailGridColumns); 
  const [detailGridFieldName, setdetailGridFieldName] = useState(props.detailGridFieldName);
  const [detailKeyFieldName, setdetailKeyFieldName] = useState(props.detailKeyFieldName);

  const dataGrid = useRef(null);


  const hdr = {
    'mId': m
  };
  
  useEffect(() => {
    try{
    dataGrid.current.instance.refresh();
    }
    catch(ex){}
  }, [detailGridColumns]);

  useEffect(() => {
    console.log('printing m value ' + m + " clr " + clr + " id " + id);
    console.log(baseObj);
    getMetaData();
    getBaseData();
    setShowAR(clr === 'c');
    // eslint-disable-next-line
  }, []);

  const handleCloseNotificationBar = () => {
    setOpenNotificationBar(false);
  };

  const getMetaData =  () => {
    try {
      //let response =  axios.get("menu/fieldmetadata?mId=" + m, []);
      //setMetaData(response.data);

      axios({
        method: 'get',
        url: "menu/fieldmetadata",
        headers: hdr
      }).then((response) => {
        console.log('getting metadata...');
        let retval = response.data.filter(item => item.ForChild==='N');
        setMetaData(retval);
        console.log(retval);
      }).catch((error) => {
        if(error.response) {
          console.log("Error occured while fetching data. Error message - " + error.message);
        }
      })

      
    } catch (error) {
      console.log("Error occured while departments data. Error message - " + error.message);
    }
  }

  const getBaseData = () => {
        axios({
            method: 'get',
            url: props.APIName + "/" + id,
            headers: {"mId": m}
        }).then((response) => {
            let x = response.data;

            for (const key in x) {
              if(x[key] === 'Y' || x[key] === 'N'){
                console.log('transforming x....',key);
                x[key] = x[key] === 'Y' ? true: false;
              }
            }  

            //x.Active = x.Active === 'Y' ? true : false;
            console.log(x);
            setbaseObj(x);
        }).catch((error) => {
            if(error.response){
                if(error.response.status === 417) {
                    console.log("Error occured while approving record..");
                }
            }
        })

  }

  const onACValChange = (e,v,f) => {
    console.log('Auto...',e,v,f);
    setbaseObj({...baseObj, [f]: v[f]});
    console.log(baseObj,f,v[f]); 
  }

  const handleValueChange = (e) => {
    //console.log('New value:', e, e.component.option("name"),e.value);
    let valueExpr = e.component.option("name");
    setbaseObj({...baseObj, [valueExpr]: e.value});
  };

  const onValChange = (e) => {
    //console.log(e.target,e.target.type,e.target.name,e.target.value);
    if(e.target.type === 'checkbox'){
      //console.log(e.target);
      setbaseObj({...baseObj, [e.target.name]: e.target.checked ? true : false});
    }
    else{
      setbaseObj({...baseObj, [e.target.name]: e.target.value});
    }
    //console.log(e.target);
  }

  const onRejectValChange = (e) => {
    setrejectReason(e.target.value);
  }

  const onDateValChange = (fieldName) => (value) => {
    setbaseObj({...baseObj, [fieldName]: value});
  }

  const approveRequest = () => {
    //console.log(detailGridColumns);

    const newbaseObj = manageCheckBoxFlags();
    console.log('during approve...new base obj...',newbaseObj,"baseObj...",baseObj);

    const vl = confirm('Confirm approval?','Confirmation Alert');
    vl.then((dialogResult) => {
        if(dialogResult){
          axios({
            method: (newbaseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
            url: props.APIName + (newbaseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
            data: (newbaseObj.MarkedForDelete === 'Y' ? null : baseObj),
            headers: {"mId": m, "cact" : 'A'}
          }).then((response) => {
              //navigate("/" + props.listPageName +  "?m=" + m);
              setnotificationBarMessage("Record approved successfully!");
              setOpenNotificationBar(true);                 
              navigate(-1);
          }).catch((error) => {
              if(error.response){
                  if(error.response.status === 417) {
                    setnotificationBarMessage("Error occured while approving data.." + error.response.data);
                    setOpenNotificationBar(true);   
                  }
              }
          })
        }
    });
  }

  const deleteRecord = () => {
    const vl = confirm('Confirm delete?','Confirmation Alert');
    vl.then((dialogResult) => {
        if(dialogResult){
          axios({
              method: 'delete',
              url: props.APIName + "/" + id,
              headers: {"mId": m}
          }).then((response) => {
              navigate(-1);
          }).catch((error) => {
              if(error.response) {
                  if(error.response.status === 417) {
                    setnotificationBarMessage("Error occured while deleting data.." + error.response.data);
                    setOpenNotificationBar(true);   
                  }
              }
          })
        }
      });
  }

  const rejectRequest = () => {
    const vl = confirm('Confirm rejection?','Confirmation Alert');
    vl.then((dialogResult) => {
        if(dialogResult){
          setopenRejectDialog(true);
        }
      });
  }


  const rejectAction = () => {
    console.log('reject reason...');
    console.log(rejectReason);
    hideRejectDialog();
    
    const newbaseObj = manageCheckBoxFlags();
    console.log('during approve...new base obj...',newbaseObj,"baseObj...",baseObj);

    axios({
      method: (newbaseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
      url: props.APIName + (newbaseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
      data: (newbaseObj.MarkedForDelete === 'Y' ? null : newbaseObj),
      headers: {"mId": m, "cact" : 'R', "rmrk" : rejectReason }
    }).then((response) => {
        setnotificationBarMessage("Record rejected successfully!");
        setOpenNotificationBar(true);   
        navigate(-1);
    }).catch((error) => {
        if(error.response){
            if(error.response.status === 417) {
              setnotificationBarMessage("Error occured while rejecting data.." + error.response.data);
              setOpenNotificationBar(true);   
            }
        }
    })
  }

  const cancelEntry =  () => {
      navigate(-1);
  }

  const saveRecord = () => {
    try{
      dataGrid.current.instance.saveEditData();
    }
    catch(ex){
    }


    if(!validateForm()){
      return(false);
    }
    
    if(detailGridColumns)
      console.log(detailGridColumns);

    const newbaseObj = manageCheckBoxFlags();
    
    if(detailGridFieldName)
      newbaseObj[detailGridFieldName] = detailGridColumns;

    console.log('new base obj...',newbaseObj,"baseObj...",baseObj);


    const vl = confirm('Confirm updation?','Confirmation Alert');
    vl.then((dialogResult) => {
        if(dialogResult){
          axios({
              method: (id === "0" ? 'post' : 'put'),
              url: props.APIName,
              data: newbaseObj,
              headers: {"mId": m}
          }).then((response) => {
              navigate(-1);
          }).catch((error) => {
              if(error.response){
                  console.log(error.response);
                  alert(error.response.data,"Error occured while saving data");
                  //setnotificationBarMessage("Error occured while saving data.." + error.response.data);
                  //setOpenNotificationBar(true);            
              }
          })
        }
    });
  }

  const manageCheckBoxFlags = () => {
    const newbaseObj = {};
    let value = "";
    let keynm = "";


    for (const key in baseObj) {
      if(baseObj[key] === true || baseObj[key] === false){
        newbaseObj[key] = baseObj[key] ? 'Y': 'N';
      }
      else{
        newbaseObj[key] = baseObj[key];
      }
    }

    return(newbaseObj);
  }

  const validateForm = () => {
    const filteredData = metadata.filter(item => item.IsMandatory === 'Y');
    var fg = true;
    var errmsg = "";

    filteredData.map(item => {
      var valmsg = item.ValidationMessage;
      console.log(item.TableFieldName,baseObj[item.TableFieldName]);
      if(baseObj[item.TableFieldName] === "" || baseObj[item.TableFieldName] === null || baseObj[item.TableFieldName] === 0 ){
        console.log('adding to validation...',item.TableFieldName,baseObj[item.TableFieldName]);
        
        if(valmsg === "" || valmsg === null)
          valmsg = "Invalid data";
        
        fg = false;
        errmsg = errmsg + "<b>" + item.DisplayCaption + "</b><br/>" + valmsg + "<br/><br/>";    
      }

    });

    if(!fg)
    alert(errmsg,"Data Validation Errors");

    return(fg);
  }

  const renderControl = (column) => {
    console.log(column);
    if(column.ControlType==="Text Field" || column.ControlType==="Numeric Field"  ){
        return(
            <TextField onChange={(evt) => onValChange(evt)} label={column.DisplayCaption} required={column.IsMandatory=='Y'?true:false} 
            title={baseObj[`${column.TableFieldName}`] }
             variant="standard" name={column.TableFieldName} value={baseObj[`${column.TableFieldName}`] } autoComplete="off" sx={{width:200}}  inputProps={{ maxLength: `${column.MaxLength}`, readOnly: (column.IsReadOnly==='Y'?true:false)  }} />
        );
    }
    else if(column.ControlType==="Text Area"){
        return(
            <TextField onChange={(evt) => onValChange(evt)} label={column.DisplayCaption} variant="standard" name={column.TableFieldName} title={column.HelpText}  value={baseObj[`${column.TableFieldName}`] } autoComplete="off" sx={{width:`${column.ControlWidth}`}}  inputProps={{ maxLength: `${column.MaxLength}`,  readOnly: (column.IsReadOnly==='Y'?true:false)   }} maxRows={4} multiline />
        )
    }
    else if(column.ControlType==="Password"){
      return(
          <TextField onChange={(evt) => onValChange(evt)} label={column.DisplayCaption} variant="standard" name={column.TableFieldName} title={column.HelpText}  type="password" value={baseObj[`${column.TableFieldName}`] } autoComplete="off" sx={{width:`${column.ControlWidth}`}}  inputProps={{ maxLength: `${column.MaxLength}`, readOnly: (column.IsReadOnly==='Y'?true:false)   }}  />
      )
    }    
    else if(column.ControlType==="Date Picker"){
      if(column.IsReadOnly==='N'){
        return(
                <DatePicker 
                label={column.DisplayCaption} 
                renderInput = {(params) => <TextField variant="standard" {...params} />}
                value={baseObj[`${column.TableFieldName}`] }
                onChange={onDateValChange(column.TableFieldName)} 
                name={column.TableFieldName} 
                inputProps={{  readOnly: (column.IsReadOnly==='Y'?true:false) }}
                />
        );
      }
      else{
        var dt = new Date(baseObj[`${column.TableFieldName}`]);
        var fdt = "";

        if(baseObj[`${column.TableFieldName}`]!=="")
          fdt = getFormattedDate(dt);
          
        return(
             <TextField onChange={(evt) => onValChange(evt)} label={column.DisplayCaption} required={column.IsMandatory=='Y'?true:false} 
             title={baseObj[`${column.TableFieldName}`] }
             variant="standard" name={column.TableFieldName} value={fdt } autoComplete="off" sx={{width:200}}  inputProps={{ maxLength: `${column.MaxLength}`, readOnly: (column.IsReadOnly==='Y'?true:false)  }} />
        );
      }
    }
    else if(column.ControlType==="Check Box"){
        return(
            <FormControl variant="standard">
              <FormControlLabel control={<Checkbox  checked={baseObj[`${column.TableFieldName}`]} title={column.HelpText}  onChange={(evt) => onValChange(evt)} name={column.TableFieldName}/>} label={column.DisplayCaption} />
            </FormControl>            
        )
    }
    else if(column.ControlType==="DropdownT"){
        if(!ancillaryData)
          return;

        const ancobj = column.AncillaryObject;
        const ancobjarr =  ancillaryData[ancobj]; //eval('ancillaryData.' + ancobj);

        console.log('ancillary obj...',ancobjarr);

        let displayFieldName = column.TableFieldName.replace('Id','Code');
        let valueFieldName = column.TableFieldName;

        if(displayFieldName === '')
          displayFieldName = column.AncillaryObjectValueField;
          
        if(valueFieldName === '')
          valueFieldName = column.AncillaryObjectKeyField;
          
        //console.log('index position ...'  + valueFieldName.indexOf("Parent") + ' **  ' + column.TableFieldName); 
        if(valueFieldName.indexOf("Parent") < 0) {
          try{
            if(!ancobjarr[0].hasOwnProperty(column.TableFieldName)){
              //console.log( column.TableFieldName + ' property not found inside ancobj');  
              displayFieldName = "LookupItemCode";
              valueFieldName = "LookupItemId";
            }
          }
          catch(ex){}
        }

        displayFieldName = displayFieldName.replace('Parent','');
        valueFieldName = valueFieldName.replace('Parent','');

        return(
          <TextField label={column.DisplayCaption} variant="standard" title={column.HelpText}  
          select value={baseObj[`${column.TableFieldName}`]}
          inputProps={{  readOnly: baseObj[`${column.TableFieldName}`] === 'Y'  }} 
          onChange={(evt) => onValChange(evt)} name={column.TableFieldName}>
          {
            // eslint-disable-next-line
            ancobjarr?
            ancobjarr.map((app) => (
              <MenuItem key={app[`${valueFieldName}`]}  value={app[`${valueFieldName}`]}>{app[`${displayFieldName}`]}</MenuItem>
            ))
            :<></>
          }
        </TextField>
        )
    }
    else if(column.ControlType==="DropdownAC"){
      if(!ancillaryData)
        return;

      const ancobj = column.AncillaryObject;
      const ancobjarr =  ancillaryData[ancobj]; //eval('ancillaryData.' + ancobj);

      console.log('ancillary obj...',ancobjarr);

      let displayFieldName = column.TableFieldName.replace('Id','Code');
      let valueFieldName = column.TableFieldName;

      if(displayFieldName === '')
        displayFieldName = column.AncillaryObjectValueField;
        
      if(valueFieldName === '')
        valueFieldName = column.AncillaryObjectKeyField;
        
      if(valueFieldName.indexOf("Parent") < 0) {
        try{
          if(!ancobjarr[0].hasOwnProperty(column.TableFieldName)){
            //console.log( column.TableFieldName + ' property not found inside ancobj');  
            displayFieldName = "LookupItemCode";
            valueFieldName = "LookupItemId";
          }
        }
        catch(ex){}
      }

      displayFieldName = displayFieldName.replace('Parent','');
      valueFieldName = valueFieldName.replace('Parent','');

      console.log('params ', displayFieldName, valueFieldName);

      return(
        <FormControl variant="standard">
        <Autocomplete disablePortal options={ancobjarr} 
        getOptionLabel={(option) => option[displayFieldName]} 
        autoHighlight  
        title={column.HelpText} 
        name={column.TableFieldName} 
        value={baseObj[valueFieldName]===0?null:baseObj[valueFieldName]}
        onChange={(evt,newval) => onACValChange(evt,newval,column.TableFieldName )}
        renderInput={(params) => <TextField {...params} label={column.DisplayCaption}  variant="standard" title={column.HelpText}  />} >
        isOptionEqualToValue={(option, value) => option.value === value}
        </Autocomplete>
        </FormControl>
      )
  }
  else if(column.ControlType==="Dropdown"){
    if(!ancillaryData)
      return;

    const ancobj = column.AncillaryObject;
    const ancobjarr =  ancillaryData[ancobj]; //eval('ancillaryData.' + ancobj);

    const selectBoxStyles = {
        height: '55px',
        paddingTop: '18px',
        paddingBottom: '1px' // Set the padding top to move the text down
    };

    console.log('ancillary obj...',ancobjarr);

    let displayFieldName = column.AncillaryObjectValueField;
    let valueFieldName = column.AncillaryObjectKeyField;
  
    return(
      <FormControl variant="outlined"  >
        <SelectBox dataSource={ancobjarr}
                  name={column.TableFieldName}
                  displayExpr={displayFieldName}
                  valueExpr={valueFieldName}
                  value={baseObj[column.TableFieldName] }
                  searchEnabled={true}
                  searchMode='contains'
                  searchExpr={displayFieldName}
                  searchTimeout={200}
                  minSearchLength={0}
                  showDataBeforeSearch={true}
                  label={column.DisplayCaption}
                  labelMode='floating'
                  showSelectionControls={false}
                  stylingMode='underlined'
                  height='55px'
                  className='select-box-text'
                  onValueChanged={handleValueChange}
                  />
      </FormControl>
    )
}

  }

  const renderDeleteStatus = (cellData) => {
    return (
      <div>
            {cellData.data.MarkedForDelete==="Y" ?<i className={'bi-flag-fill'} style={{color:'red', fontSize: '10pt', marginRight: '5px'}} title="Marked for deletion" />:<></>}
      </div>
    );
  }

  const markRecordDelete = (e) => {
    const updatedData = detailGridColumns.map(row => {
      if (row[detailKeyFieldName] === e.row.data[detailKeyFieldName]) {
        if(row[detailKeyFieldName] !== 0){
          var fg =  row.MarkedForDelete === "Y"?"N":"Y";
          return { ...row, MarkedForDelete: fg };
        }
        else{
          dataGrid.current.instance.deleteRow([row.key]);
        }
      }
      return row;
    });

    setdetailGridColumns(updatedData);
  }

  const renderDropDownCell = (data) => {
    return(
      <>
      {data.text===""?<span style={{color:'darkgray'}}>Select data...</span>:data.text}
      </>
    )
  }

  const renderTextBox = (data) => {
    console.log(data);
    return(
      <>
      {data.text===""?<span style={{color:'darkgray'}}>Type here...</span>:data.text}
      </>
    )
  }


  const renderGridColumn = (column) => {
   // console.log('rendering columns....');
   // console.log(column);
   if(column.ShowField==="Y")
   {
      if(column.AncillaryObject){
        return(
            <Column dataField={column.TableFieldName} caption={column.DisplayCaption} width={column.ControlWidth} cellRender={renderDropDownCell} >
              <Lookup dataSource={ancillaryData[`${column.AncillaryObject}`]} displayExpr={column.AncillaryObjectValueField} valueExpr={column.AncillaryObjectKeyField} />
            </Column>
        );
      }
      else{
          return(
        <Column dataField={column.TableFieldName} caption={column.DisplayCaption} width={column.ControlWidth} cellRender={renderTextBox}/>
        );
      }
    }
  }

  const hideRejectDialog = () => {
    setopenRejectDialog(false);
  }

  return (
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          fontFamily: 'Poppins',
          fontSize: 12,
          margin:0, p: 0
        }}
        noValidate
        autoComplete="off"
        className="EditPageLayout"
      >
      <Paper elevation={6} sx={{ p: 4, paddingTop: 4 }}>
      <h2 className='PageTitle'>{props.title}</h2>
      <p className='PageSubTitle'>{props.subTitle}</p>
      <br />
      <Grid container spacing={1} noValidate={false}>
          {metadata?
          <>
            <Grid item spacing={1}>
              {metadata.map(column => (
                  column.ShowField === "Y" && column.ControlType !== "Check Box"?renderControl(column):<></>
              ))}
            </Grid>
            <Grid item spacing={1} xs={12}>
              {metadata.map(column => (
                  column.ShowField === "Y" && column.ControlType === "Check Box"?renderControl(column) :<></>
              ))}
            </Grid>
          </>
          :<></>
          }

          {detailGridColumns && props.showDetails?
            <Box sx={{paddingTop:3}}>
            <h5 style={{borderBottom:'1px solid lightgray'}}><b>{props.detailGridTitle}</b></h5>
            <DataGrid
             ref={dataGrid}
             width="80%"
             dataSource={detailGridColumns}
             keyExpr={props.detailKeyFieldName}
             showBorders={true}
             showRowLines={true}
             showColumnLines={true}
             highlightChanges={true}
             rowAlternationEnabled={true}
             useIcons={true}
             onInitNewRow={(e) => {
                var rows = dataGrid.current.instance.getVisibleRows();
                var visibleRows = rows.filter(function(row){
                    return row.rowType === "data";
                });
                var rowCount = visibleRows.length + 1;
                let totalCount = -1 * rowCount;
                e.data[detailKeyFieldName] = totalCount;
                e.data.Active='Y';
                e.data.CheckerStatus='W';
                e.data.MarkedForDelete='N';
                e.data.CheckerQueueId = 0;
                e.data.CheckerStatus = 'W';
                e.data.CreatedBy = 0;
                e.data.CreatedDate = "01-01-2021";
                e.data.ModifiedBy = 0;
                e.data.ModifiedDate = "01-01-2021";
                e.data.MarkedForDelete = 'N';                
            }}
            >
                <Paging enabled={true} 
                  pageSize={7}
                />
                <SearchPanel visible={true} />
                <Editing
                  mode="batch"
                  newRowPosition={'last'}
                  allowUpdating={true}
                  allowAdding={true}
                  allowDeleting={true}/>

                  <Column caption="" cellRender={renderDeleteStatus} width={35}/>

                  {props.detailGridColumnConfiguration.map(column => (
                      renderGridColumn(column)
                  ))}
                  <Column type="buttons" width={60} >
                      <Button name="FWdelete" text="Delete1"  hint="Delete Record" onClick={markRecordDelete} >
                          <i className={'bi-trash3-fill'} style={{color:'indigo', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} />
                      </Button>
                
                  </Column>
            </DataGrid>
            </Box>
          :<></>}
          <Grid item xs={12} spacing={1} sx={{paddingTop:10,paddingBottom:3}}>
          <FormControl>
              { baseObj.MarkedForDelete ? (
              <Alert severity="error" variant="filled">
                Entry marked for deletion. Awaiting check..
              </Alert> ) : <></>}
            </FormControl>
          </Grid>
          <Grid item xs={12} spacing={2} sx={{paddingTop:4}}>
            <FormControl>
              { showAR ? (
                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                  <BxButton size="sm" style={{ textTransform: "none"}} onClick={() => approveRequest()}>
                      <i className={'bi-bag-check-fill'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Approve
                  </BxButton> 
                  <BxButton size="sm" style={{ textTransform: "none"}} onClick={() => rejectRequest()}>
                      <i className={'bi-bag-x-fill'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Reject
                  </BxButton>
                  <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Back to List
                  </BxButton>                    
                </Stack>
              ) : (clr === null && baseObj.CheckerStatus !== 'W') ? (
                 <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />} >
                    <BxButton size="sm" style={{ textTransform: "none"}} onClick={() => saveRecord()}>
                      <i className={'bi-save'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Save
                    </BxButton>
                    {(id !== "0" ?
                    <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => deleteRecord()} >
                      <i className={'bi-x-square-fill'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                       Delete
                    </BxButton>
                    : <></>
                    )}                    
                    <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Back to List
                    </BxButton>                    
                </Stack>
              ) :
                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                  <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Back to List
                  </BxButton>                    
                </Stack>
              }
            </FormControl>
          </Grid>
        </Grid>  
        <Snackbar
                open={openNotificationBar}
                onClose={handleCloseNotificationBar}
                autoHideDuration={3000}
                anchorOrigin={{vertical:'bottom', horizontal:'center'}}
            >
                 <Alert onClose={handleCloseNotificationBar} severity="info" variant="filled" sx={{ width: '100%' }}>
                    {notificationBarMessage}
                </Alert>
        </Snackbar>
      </Paper>
      <Dialog open={openRejectDialog} onClose={hideRejectDialog} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Reject Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Specify reason for rejecting this request:<br/><br/><br/>
          </DialogContentText>
          <TextField
            onChange={(evt) => onRejectValChange(evt)}
            autoFocus
            margin="dense"
            name="rejectReason"
            id="rejectReason"
            value={rejectReason}
            label="Specify reject reasons"
            fullWidth
            variant="standard"
            autoComplete='off'
          />
        </DialogContent>
        <DialogActions>
            <BxButton
              type="primary"
              size="sm"
              onClick={rejectAction}
              style={{ textTransform: "none" }}
            >
              <i className={'bi-terminal-x'} style={{ fontSize: '10pt', marginRight: '10px'}} />
              Reject
            </BxButton>          
            <BxButton
              type="primary"
              size="sm"
              onClick={hideRejectDialog}
              style={{ textTransform: "none" }}
            >
              <i className={'bi-x-square-fill'} style={{ fontSize: '10pt', marginRight: '10px'}} />
              Close
            </BxButton>          
        </DialogActions>
      </Dialog>      
      </Box>
      
     
  )
}
