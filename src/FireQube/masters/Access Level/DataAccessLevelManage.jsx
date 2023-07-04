import * as React from 'react';
import '../../../shared/styles/dx-styles.css';
import { alert, confirm } from 'devextreme/ui/dialog';
import BxButton from 'react-bootstrap/Button';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
    Box, Paper, FormControl, FormGroup, InputLabel, Input, Typography, styled, TextField, MenuItem,
    Stack, Divider, FormControlLabel, Checkbox, Alert, Grid, Snackbar
} from '@mui/material';

import axios from 'axios';
import TreeView from 'devextreme-react/tree-view';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { DataGrid, Column, Editing, Paging, Lookup } from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react';
import MultiValSelectBox from './MultiValSelectBox';
import DataFilterSBRender from './DataFilterSBRender';


export default function DataAccessLevelManage(props) {
    const { id } = useParams();
    const m = new URLSearchParams(useLocation().search).get('m');
    //const APIName = new URLSearchParams(useLocation().search).get('a');
    const [menus, setMenus] = useState([]);
    const navigate = useNavigate();
    const [openNotificationBar, setOpenNotificationBar] = React.useState(false); //Notification Bar Flag
    const [notificationBarMessage, setnotificationBarMessage] = React.useState(''); //Notification Message
    const clr = new URLSearchParams(useLocation().search).get('clr');
    const [showAR, setShowAR] = useState(false);
    const [openRejectDialog, setopenRejectDialog] = React.useState(false);
    const [rejectReason, setrejectReason] = React.useState("");
    const [accLvlInfo, setAccLvlInfo] = React.useState("");
    const treeViewRef = React.createRef();
    const [initialmenus, setInitialMenus] = useState("");
    const [accessName, setAccessName] = useState(null);
    const [baseObj, setbaseObj] = useState([]);
    const [ancillaryData, setAncillaryData] = useState([]);
    const [firstTimeLoad, setfirstTimeLoad] = useState(0);
    const [filterConfigData, setfilterConfigData] = useState([]);


    const config = {
        "mId": m,
        "accLvlId": id
    };


    useEffect(() => {
        try {
            setShowAR(clr === 'c');
            getRecords();
            getAccessLevelInfo();
            // eslint-disable-next-line
        }
        catch (ex) {
        }
    }, []);

    useEffect(() => {
        console.log('refreshData', firstTimeLoad);
    }, [firstTimeLoad]);

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
                url: 'accessLevel/giveDataGrants',
                data: baseObj,
                headers: {"mId": m, "accLvlId": id, "cact" : 'A'}
              }).then((response) => {
                console.log('response',response.data);
                  setnotificationBarMessage("Record approved successfully!");
                  setOpenNotificationBar(true);                 
                  navigate(-1);
              }).catch((error) => {
                  console.log(error.response);
                  alert("Error occured while approving data.." + error.response.data,'Bad Request');  
              })
            }
        });
    }

    const rejectRequest = () => {
        const vl = confirm('Confirm rejection?', 'Confirmation Alert');
        vl.then((dialogResult) => {
            if (dialogResult) {
                setopenRejectDialog(true);
            }
        });
    }


    const rejectAction = () => {
        console.log('reject reason...');
        console.log(rejectReason);
        hideRejectDialog();

        axios({
            method: 'put',
            url: 'accessLevel/giveDataGrants',
            data: baseObj,
            headers: { "mId": m, "cact": 'R',"accLvlId": id, "rmrk": rejectReason }
        }).then((response) => {
            console.log('responde',response.data);
            setnotificationBarMessage("Record rejected successfully!");
            setOpenNotificationBar(true);
            navigate(-1);
        }).catch((error) => {
            if (error.response) {
                if (error.response.status === 417) {
                    alert("Error occured while rejecting data.." + error.response.data,'Bad Request');  
                }
            }
        })
    }



    const backtolist = () => {
        navigate(-1);
    }


    const saveRecord = () => {
        console.log('baseObj', baseObj);
        const vl = confirm('Confirm rights assignment?', 'Confirmation Alert');
        vl.then((dialogResult) => {
            if (dialogResult) {
                axios({
                    method: (id === "0" ? 'post' : 'put'),
                    url: 'accessLevel/giveDataGrants',
                    data: baseObj,
                    headers: config
                }).then((response) => {
                    console.log({ baseObj: baseObj, data: response.data });
                    setnotificationBarMessage(response.data);
                    setOpenNotificationBar(true);
                    navigate(-1);
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response);
                        alert("Error occured while approving data.." + error.response.data,'Bad Request');  
                    }
                })
            }
        });

    }


    const getRecords = () => {
        setfirstTimeLoad(firstTimeLoad + 1);
        axios({
            method: 'get',
            url: 'accessLevel/dataAccessGrants/' + id,
            headers: config
        }).then((response) => {
            const x = response.data;
            const x1 = response.data;
            console.log('intialVal', x);
            setbaseObj(x);
            handleAncillaryData(x);
            x.forEach((data,index)=>{
                console.log('data',data);
                if(data.DataFilterConfigId !== null){
                    getFilterConfigDetails(data.DataFilterConfigId)
                    .then((filterConfigDetails) => {
                        x1[index].FilterConfigDetails = filterConfigDetails;
                        setfilterConfigData(x1);
                    })
                    .catch((error) => {
                        console.log('Error occurred while fetching FilterConfigDetails');
                        console.log(error);
                    });
                   
                }
                else{
                    x1[index].FilterConfigDetails = null;
                    setfilterConfigData(x1);
                }
            })
        }).catch((error) => {   
            console.log('list err');
            console.log(error);
            if (error.response) {
                console.log("Error occured while fetching data. Error message - " + error.message);
            }
        })
    }

    const handleAncillaryData = async (x) => {
        const ancData = [];
        for (const record of x) {
            try {
                const data = await getAncillaryData(record.ModuleId);
                ancData.push(data);
            } catch (error) {
                console.error('Error occured while getting ancillaryData:', error);
            }
        }
        setAncillaryData(ancData);
    }


    const getAncillaryData = async (id) => {
        try {
            const response = await axios.get(`accessLevel/filteredAncillaryData/${id}`);
            const x = response.data;
            return x.anc_configs;
        } catch (error) {
            console.log(`Error fetching options for ID ${id}:`, error);
        }
    };


    const getAccessLevelInfo = () => {
        axios({
            method: 'get',
            url: 'accessLevel/accessLevelInfo',
            headers: config
        }).then((response) => {
            console.log('getaccesslevelinfo...', response);
            setAccessName(response.data.AccessLevelName);
            setAccLvlInfo(response.data);
        }).catch((error) => {
            console.log('list err');
            console.log(error);
            if (error.response) {
                console.log("Error occured while fetching data. Error message - " + error.message);
            }
        })
    }

    const getFilterConfigDetails = (id) => {
        return axios({
            method: 'get',
            url: `dataFilterConfig/` + id
        }).then((response) => {
            console.log('getFilterConfigDetails', response.data);
            const x = response.data;
            return x;
        }).catch((error) => {
            console.log('list err');
            console.log(error);
            if (error.response) {
                console.log("Error occured while fetching data. Error message - " + error.message);
            }
        })

    };


    const handleValueSelection = (index, ModuleId, DataFilterConfigId) => {
        const updatedBaseObj = [...filterConfigData];

        getFilterConfigDetails(DataFilterConfigId)
            .then((filterConfigDetails) => {
                updatedBaseObj[index].FilterConfigDetails = filterConfigDetails;
                setfilterConfigData(updatedBaseObj);
            })
            .catch((error) => {
                console.log('Error occurred while fetching FilterConfigDetails');
                console.log(error);
            });

        setfirstTimeLoad(firstTimeLoad + 1);

        console.log('revised filterd', DataFilterConfigId, filterConfigData);
    }

    return (
        baseObj.length > 0 && ancillaryData.length > 0 ?
            <Box
                component="form"
                sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    margin: 0, p: 3,
                    paddingTop: 2, minHeight: '89vh', minWidth: '90vh', backgroundColor: 'white'
                }}
                noValidate
                autoComplete="off"
                className="EditPageLayout"
            >
                <h2 className='PageTitle'>Manage Grants {accessName ? <b>- {accessName}</b> : <></>} </h2>
                <p className='PageSubTitle'>Grant and revoke function points to access levels</p>
                <br />
                <Grid container spacing={1} >
                    <Grid item xs={4} sx={{ paddingTop: 4 }}>
                        <FormControl>
                            {showAR ? (
                                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                                    <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => approveRequest()}>
                                        <i className={'bi-bag-check-fill'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                        Approve
                                    </BxButton>
                                    <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => rejectRequest()}>
                                        <i className={'bi-bag-x-fill'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                        Reject
                                    </BxButton>
                                    <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => backtolist()} >
                                        <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                        Back to List
                                    </BxButton>
                                </Stack>
                            ) : (clr === null) ? (
                                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />} >
                                    {accLvlInfo.AccessLevelCheckerStatus === "W" || accLvlInfo.AccessLevelCheckerStatus === "R" || accLvlInfo.GrantsCheckerStatus === "W" ? <></> :
                                        <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => saveRecord()}>
                                            <i className={'bi-save'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                            Save Access
                                        </BxButton>}
                                    <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => backtolist()} >
                                        <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                        Back to List
                                    </BxButton>
                                </Stack>
                            ) :
                                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                                    <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => backtolist()} >
                                        <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                        Back to List
                                    </BxButton>
                                </Stack>
                            }
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sx={{ marginTop: 2, paddingX: 1 }}>
                        <Grid container spacing={1}>
                            {
                                baseObj.length > 0 && ancillaryData.length > 0 ?
                                    baseObj.map((data, i) => {
                                        return <Grid item xs={3} sx={{ paddingBottom: 1 }}>
                                            <Paper elevation={3} sx={{ p: 2, height: 300 }}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <p style={{ marginBottom: 0, fontSize: '12pt', fontWeight: 'bold' }}><i className={'bi-funnel'} style={{ color: 'green', fontSize: '15pt', cursor: 'pointer' }} /> {data.ModuleName}</p>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <MultiValSelectBox
                                                            dataSource={ancillaryData[i] === undefined ? [] : ancillaryData[i]}
                                                            value={data.DataFilterConfigId}
                                                            propId={data.ModuleId}
                                                            baseObj={baseObj}
                                                            index={i}
                                                            handleValueSelection={handleValueSelection}
                                                            setbaseObj={setbaseObj}
                                                            data={{ name: "DataFilterConfigId", label: data.ModuleName, displayExpr: "FilterName", valueExpr: "DataFilterConfigId", searchExpr: "FilterName" }}
                                                            itemRenderJsx={DataFilterSBRender} />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ backgroundColor: 'azure', p: 1, fontSize: '8pt' }}>
                                                            {filterConfigData[i] && filterConfigData[i].FilterConfigDetails ? filterConfigData[i].FilterConfigDetails.Description : <></>}
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ backgroundColor: 'white', p: 1,paddingTop:0, fontSize: '8pt' }}>
                                                            {filterConfigData[i] && filterConfigData[i].FilterConfigDetails ?
                                                            <p style={{ marginBottom: 5, fontSize: '7pt', color:'darkblue' }}>Data Filter Criteria</p>:<></>}
                                                            <Box sx={{maxHeight:'15vh',overflow:'auto',border:'0px solid #efefef'}}>
                                                                {filterConfigData[i] && filterConfigData[i].FilterConfigDetails ?
                                                                    filterConfigData[i].FilterConfigDetails.DataFilterConditions.filter(item => item.FilterClause !== null).map(item => {
                                                                       return <div style={{paddingBottom:'10px',}}>
                                                                                <span style={{fontWeight:'bold'}}>{item.DisplayCaption} </span>
                                                                                <span style={{color:'blue'}}>{item.ConditionOperatorCode} </span> 
                                                                                <span>{item.FilterClause}</span>
                                                                             </div>
                                                                    } )
                                                                : <></>}
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    })
                                    :
                                    <></>
                            }
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {accLvlInfo.AccessLevelCheckerStatus === "W" || accLvlInfo.AccessLevelCheckerStatus === "R" || accLvlInfo.GrantsCheckerStatus === "W" ?
                            (showAR ? <></> :
                                <Alert severity="warning" variant="standard">
                                    Access Grants or Access Level are currently awaiting Checker Approval!
                                </Alert>
                            )
                            :
                            <></>
                        }

                    </Grid>
                </Grid>
                <br />
                <Snackbar
                    open={openNotificationBar}
                    onClose={handleCloseNotificationBar}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}

                >
                    <Alert onClose={handleCloseNotificationBar} severity="info" variant="filled" sx={{ width: '100%' }}>
                        {notificationBarMessage}
                    </Alert>
                </Snackbar>
                <Dialog open={openRejectDialog} onClose={hideRejectDialog} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle>Reject Request</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Specify reason for rejecting this request:<br /><br /><br />
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
                            <i className={'bi-terminal-x'} style={{ fontSize: '10pt', marginRight: '10px' }} />
                            Reject
                        </BxButton>
                        <BxButton
                            type="primary"
                            size="sm"
                            onClick={hideRejectDialog}
                            style={{ textTransform: "none" }}
                        >
                            <i className={'bi-x-square-fill'} style={{ fontSize: '10pt', marginRight: '10px' }} />
                            Close
                        </BxButton>
                    </DialogActions>
                </Dialog>
            </Box>
            : <></>
    );
}



