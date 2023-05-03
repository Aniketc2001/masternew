import * as React from 'react';

import '../../shared/styles/dx-styles.css';
import { alert, confirm  } from 'devextreme/ui/dialog';
import BxButton  from 'react-bootstrap/Button';
import { useNavigate,useLocation, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { 
    Box, Paper, FormControl, FormGroup, InputLabel, Input, Typography,  styled, TextField, MenuItem,
    Stack, Divider, FormControlLabel, Checkbox, Alert, Grid, Snackbar
  } from '@mui/material';

import axios from 'axios';
import TreeView from 'devextreme-react/tree-view';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';


export default function AccessLevelManage(props) {
  const {id} = useParams();
  const m = new URLSearchParams(useLocation().search).get('m');
  //const APIName = new URLSearchParams(useLocation().search).get('a');
  const [menus, setMenus] = useState([]); 
  const navigate = useNavigate();
  const [openNotificationBar, setOpenNotificationBar] = React.useState(false); //Notification Bar Flag
  const [notificationBarMessage, setnotificationBarMessage] = React.useState(''); //Notification Message
  const clr = new URLSearchParams(useLocation().search).get('clr');
  const [showAR, setShowAR] = useState(false);
  const [openRejectDialog,setopenRejectDialog] = React.useState(false);
  const [rejectReason,setrejectReason] = React.useState("");

  const treeViewRef = React.createRef();

  const config = {
    headers: {
      "mId": m
  }};


  useEffect(() => {
    try{
        setShowAR(clr === 'c');
        getRecords();
    }
    catch(ex){
    }
  }, []);
   
  const handleCloseNotificationBar = () => {
    setOpenNotificationBar(false);
  };

  const hideRejectDialog = () => {
    setopenRejectDialog(false);
  }

  const onRejectValChange = (e) => {
    setrejectReason(e.target.value);
  }

  const approveRequest = () => {
    const vl = confirm('Confirm approval?','Confirmation Alert');
    vl.then((dialogResult) => {
        if(dialogResult){
          axios({
            method: 'put',
            url: 'accesslevel/accessgrants/' + id,
            data: null,
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

    axios({
      method:  'put',
      url: 'accesslevel/accessgrants/' + id,
      data: null,
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


  const backtolist = () => {
    navigate(-1);
  }

  const buildTreeData = (nodes) => {
    const tmpData = nodes.map(item => {
        if(item.IsParent==="Y"){
            console.log(item);
            let fps = buildTreeChildData(item.Items);
            return({menuName: item.MenuName , items: fps,  access: item.Access, parent: 'Y', nodeType: 'Group', MenuIcon: item.MenuIcon });
        }
    })

    console.log('tmpdata...');
    console.log(tmpData);

    setMenus(tmpData);
  }

  const buildTreeChildData = (nodes) => {
    const tmpData = nodes.map(item => {
        try{
            let readRights = buildRightsData(item.ReadAccess);
            let writeRights = buildRightsData(item.WriteAccess);
            let viewRights = buildRightsData(item.ViewAccess);

            let viewMenu = {menuName :'Page Access', items: viewRights, nodeType: 'AccessGroup'};
            let readMenu = {menuName :'List Columns Access', items: readRights, nodeType: 'AccessGroup'};
            let writeMenu = {menuName :'Function Points Access', items: writeRights, nodeType: 'AccessGroup'};

            return({menuName: item.MenuName, items: [viewMenu, readMenu, writeMenu], access: item.Access, nodeType: 'Menu', MenuIcon: item.MenuIcon})
        }
        catch(ex){}       
    })

    return (tmpData);
  }

  const filterNodesByColumn = (nodes) => {
    const tmpNodes = []
    nodes.forEach(grpnodes => {
      if (grpnodes.items) {
        console.log(grpnodes.items);
        grpnodes.items.forEach(appnodes => {
            if(appnodes.items){
                appnodes.items.forEach(accgrpnodes => {
                    accgrpnodes.items.forEach(accnodes => {
                        tmpNodes.push({
                            items: {'FunctionPointId': accnodes.FunctionPointId, 'Selected' : accnodes.selected }
                        });
    
                    });
                });
            }
        })
      }
    });
  
    return tmpNodes;
  }
  

  const expandNodes = () => {
    treeViewRef.current.instance.expandAll();
  };

  const collapseNodes = () => {
    treeViewRef.current.instance.collapseAll();
  };
  
  
  
  const saveData = () => {
    const FunctionPointNodes = filterNodesByColumn(menus);
    console.log(FunctionPointNodes);

    const vl = confirm('Confirm rights assignment?','Confirmation Alert');
    vl.then((dialogResult) => {
        if(dialogResult){
          axios({
              method: (id === "0" ? 'post' : 'put'),
              url: 'accessLevel/setGrants',
              data: FunctionPointNodes,
              headers: {"mId": m}
          }).then((response) => {
              navigate(-1);
          }).catch((error) => {
              if(error.response){
                  console.log(error.response);
                  setnotificationBarMessage("Error occured while saving data.." + error.response.data);
                  setOpenNotificationBar(true);            
              }
          })
        }
    });
  
  }

  const buildRightsData = (nodes) => {
    const tmpData = nodes.map(item => {
        return({menuName: item.FunctionPointName, selected: item.Access === "Assigned" ? true : false , initialAccess: item.Access, type: 'FunctionPoints', FunctionPointId: item.FunctionPointId,  nodeType: 'FunctionPoints'  })       
    })

    console.log('tmpdata',tmpData);
    return (tmpData);
  }


  const getRecords = () => {
    axios({
      method: 'get',
      url: 'accesslevel/accessgrants/' + id, 
      headers: config
    }).then((response) => {
      console.log('original',response.data);
      buildTreeData(response.data);
    }).catch((error) => {
      console.log('list err');
      console.log(error);
      if(error.response) {
        console.log("Error occured while fetching data. Error message - " + error.message);
      }
  })
}

// Define the template for each node
const nodeTemplate = (item) => {
    return (
      <div>
        <b>{item.text} </b>
      </div>
    );
  };

  return(
    menus?
    <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          fontFamily: 'Poppins',
          fontSize: 12,
          margin:0, p: 3,
          paddingTop: 2, minHeight:'85vh', minWidth:'90vh',  backgroundColor: 'white' 
        }}
        noValidate
        autoComplete="off"
        className="EditPageLayout"
    >
      <h2 className='PageTitle'>Manage Grants</h2>
      <p className='PageSubTitle'>Grant and revoke function points to access levels</p>
      <br />
      <Grid container spacing={1} >
          <Grid item xm={1} >
            <BxButton
              variant="primary"
              size="sm"
              style={{ textTransform: "none"}}
              onClick={expandNodes}
            >
              <i className={'bi-diagram-3'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Expand all
            </BxButton>
          </Grid>       
          <Grid item xm={1} >
            <BxButton
              variant="primary"
              size="sm"
              style={{ textTransform: "none"}}
              onClick={collapseNodes}
            >
              <i className={'bi-diagram-2'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Collapse all
            </BxButton>
          </Grid>
          <Grid item xs={4} spacing={2} sx={{paddingTop:4}}>
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
                  <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => backtolist()} >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Back to List
                  </BxButton>                    
                </Stack>
              ) : (clr === null) ? (
                 <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />} >
                    <BxButton size="sm" style={{ textTransform: "none"}} onClick={() => saveData()}>
                      <i className={'bi-save'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Save Access
                    </BxButton>      
                    <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => backtolist()} >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Back to List
                    </BxButton>                    
                </Stack>
              ) :
                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                  <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => backtolist()} >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                      Back to List
                  </BxButton>                    
                </Stack>
              }
            </FormControl>
          </Grid>          

      </Grid>
      <br/>
      <div style={{overflow:'auto',height:'67vh'}}>
      <TreeView
            id="treeview"
            ref={treeViewRef}
            items={menus}
            sx={{fontFamily:'Poppins',fontSize:'10pt'}}
            selectNodesRecursive={true}
            selectByClick={false}
            showCheckBoxesMode={'selectAll'}
            selectionMode={'multiple'}
            itemRender={renderTreeViewItem}
            searchEnabled={false}
            searchMode='startswith'
            searchExpr={'menuName'}
            fontSize={8}
            fontFamily='Poppins'
            nodeTemplate={nodeTemplate}
          />        
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
        </div>
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
    :<></>      
  );
}

function renderTreeViewItem(item) {
  if(item.nodeType === "Group")
    return (<><i className={item.MenuIcon} style={{color:'black', fontSize: '10pt',marginRight:'10px'}}/><b>{item.menuName}</b></>);
  else if(item.nodeType === "Menu")
  return (<><i className={item.MenuIcon} style={{color:'purple', fontSize: '10pt',marginRight:'10px'}}/>{item.menuName}</>);
  else if(item.nodeType === "AccessGroup")
    return (<><i className={'bi-bookmarks-fill'} style={{color:'paleyellow', fontSize: '10pt',marginRight:'10px'}}/><span style={{color:'darkplum', fontStyle:'italic'}}>{item.menuName}</span></>);
  else if(item.nodeType === "FunctionPoints")
  return (<><i className={'bi-patch-check-fill'} style={{color:'lightred', fontSize: '10pt',marginRight:'10px'}}/>{item.menuName}</>);

}

