import { Box, Paper, Grid, FormControl, FormControlLabel, Checkbox, Stack, Divider, TextField, Snackbar, Alert } from "@mui/material";
import SelectBoxDropdown from "../FFS/transactions/Booking/SelectBoxDropdown";
import BxButton from "react-bootstrap/button"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { alert, confirm } from 'devextreme/ui/dialog';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

export default function VesselVoyagePortNew() {
    const m = new URLSearchParams(useLocation().search).get('m');
    const clr = new URLSearchParams(useLocation().search).get('clr');
    const { id } = useParams();
    const navigate = useNavigate();
    const [baseObj, setBaseObj] = useState({});
    const [ancillaryData, setancillaryData] = useState([]);
    const [notificationBarMessage, setnotificationBarMessage] = useState(''); //Notification Message
    const [openNotificationBar, setOpenNotificationBar] = useState(false); //Notification Bar Flag
    const [showAR, setShowAR] = useState(false);
    const [openRejectDialog, setopenRejectDialog] = useState(false);
    const [portId, setPortId] = useState({});
    const [portTerminalList, setPortTerminalList] = useState([]);
    const [rejectReason, setrejectReason] = useState("");
    const hdr = {
        'mId': m
    };

    useEffect(() => {
        getancillaryData();
        getInitialVal();
        setShowAR(clr === 'c');
        console.log("mid", m);
    }, []);

    useEffect(() => {
        if (portId) {
            getPortTerminal();
        }
    }, [portId]);


    const handleCloseNotificationBar = () => {
        setOpenNotificationBar(false);
    };

    const onValChange = (e) => {
        // console.log(e);
        if (e.target.type === 'checkbox')
            setBaseObj({ ...baseObj, [e.target.name]: e.target.checked ? "Y" : "N" });
        else
            setBaseObj({ ...baseObj, [e.target.name]: e.target.value });

        // console.log(e.target);
        // setbaseObj
    }
    const onDateValChange = (fieldName) => (value) => {
        console.log("base", baseObj.BerthDate);
        setBaseObj({ ...baseObj, [fieldName]: value });
    }

    const getInitialVal = () => {
        const url = `VesselVoyagePort/${id}`
        console.log("url", url);
        try {
            axios({
                method: 'get',
                url: url,
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getInitialVal", x);
                setPortId(x.PortId)
                setBaseObj(x);
            }).catch((error) => {
                if (error.response) {
                    console.log("Error occurred while retrieving details..", error);
                }
            });
        } catch (ex) {
            // Handle exception
        }
    };

    const getPortTerminal = () => {
        try {
            axios({
                method: 'get',
                url: 'Port/' + portId,
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getportterminal", x);
                setPortTerminalList(x.PortTerminals);
            }).catch((error) => {
                if (error.response) {
                    console.log("Error occurred while retrieving details..", error);
                }
            });
        } catch (ex) {
            // Handle exception
        }

    }


    const getancillaryData = () => {
        try {
            axios({
                method: 'get',
                url: 'VesselVoyagePort/ancillaryData',
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getancillarydata", x)

                setancillaryData(x);
                // setModuleId(x.LookupItemId);
            }).catch((error) => {
                setancillaryData("no values");
                if (error.response) {
                    console.log("Error occured while retrieving ancillary data..");
                }
            })
        }
        catch (ex) {

        }
    }
    const backtolist = () => {
        navigate(-1);
    }


    const validateForm = () => {
        const errors = [];
    
        if (baseObj.VesselId === null || baseObj.VesselId === 0) {
            errors.push("Vessel");
        }
    
        if (baseObj.PortId === null || baseObj.PortId === 0) {
            errors.push("Port");
        }
    
        if (baseObj.PortTerminalId === null || baseObj.PortTerminalId === 0) {
            errors.push("Port Terminal");
        }
    
        if (!baseObj.VoyageNumber) {
            errors.push("Voyage Number");
        }
    
        if (errors.length > 0) {
            alert('Following fields have invalid or blank data in them:</br></br>'+errors.join("<br/>"), "Validation Errors");
            return false;
        }
    
        return true;
    };
    

    const saveRecord = () => {

        console.log("baseobj", baseObj);
        if (!validateForm()) {
            return (false);
        }
        const vl = confirm('Confirm updation?', 'Confirmation Alert');
        vl.then((dialogResult) => {
            if (dialogResult) {
                let x = baseObj;
                console.log("saverecord x", x);
                axios({
                    method: (id === "0" ? 'post' : 'put'),
                    url: 'VesselVoyagePort',
                    data: x,
                    headers: { "mId": m }
                }).then((response) => {
                    setnotificationBarMessage("details saved successfully!");
                    setOpenNotificationBar(true);
                    navigate(-1);
                    console.log(response.data);
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response);
                        alert("Error occured while saving data.." + error.response.data, "DataFilterConfig Errors");
                    }
                })
            }
        });
    }

    const deleteRecord = () => {
        const vl = confirm('Confirm delete?', 'Confirmation Alert');
        vl.then((dialogResult) => {
            if (dialogResult) {
                axios({
                    method: 'delete',
                    url: 'VesselVoyagePort' + "/" + id,
                    headers: { "mId": m }
                }).then((response) => {
                    navigate(-1);
                }).catch((error) => {
                    if (error.response) {
                        if (error.response.status === 417) {
                            setnotificationBarMessage("Error occured while deleting data.." + error.response.data);
                            setOpenNotificationBar(true);
                        }
                    }
                })
            }
        });
    }


    const approveRequest = () => {


        const vl = confirm('Confirm approval?', 'Confirmation Alert');
        vl.then((dialogResult) => {
            if (dialogResult) {
                axios({
                    method: (baseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
                    url: "VesselVoyagePort" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
                    data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
                    headers: { "mId": m, "cact": 'A' }
                }).then((response) => {
                    setnotificationBarMessage("Record approved successfully!");
                    setOpenNotificationBar(true);
                    navigate(-1);
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response);
                        alert(error.response.data, "Error occured while approving party");
                    }
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
            method: (baseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
            url: "VesselVoyagePort" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
            data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
            headers: { "mId": m, "cact": 'R', "rmrk": rejectReason }
        }).then((response) => {
            setnotificationBarMessage("Record rejected successfully!");
            setOpenNotificationBar(true);
            navigate(-1);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                alert(error.response.data, "Error occured while rejecting party");
            }
        })
    }
    const hideRejectDialog = () => {
        setopenRejectDialog(false);
    }

    const onRejectValChange = (e) => {
        setrejectReason(e.target.value);
    }
    return (
        <>
            <Box>
                <Paper
                    elevation={3}
                    sx={{
                        paddingTop: 1,
                        paddingLeft: 3,
                        paddingBottom: 3,
                        paddingRight: 4,
                        fontFamily: 'Poppins',
                    }}
                >{ }
                    <h2 style={{ paddingBottom: 0, marginBottom: 5, marginTop: "8px" }}>Vessel Voyage Port</h2>
                    <span>Manage vessel voyage and port information</span>
                    <Grid container>
                        <Grid item xs={12} marginTop={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <SelectBoxDropdown
                                        dataSource={ancillaryData.anc_vessels}
                                        baseObj={baseObj}
                                        setbaseObj={setBaseObj}
                                        value={baseObj.VesselId}
                                        data={{
                                            name: "VesselId",
                                            label: "Vessel",
                                            displayExpr: "VesselName",
                                            valueExpr: "VesselId",
                                            searchExpr: "VesselName"
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <SelectBoxDropdown
                                        dataSource={ancillaryData.anc_ports}
                                        baseObj={baseObj}
                                        setbaseObj={setBaseObj}
                                        value={baseObj.PortId}
                                        setpropId={setPortId}
                                        data={{ name: "PortId", label: "Port", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <SelectBoxDropdown
                                        dataSource={portTerminalList}
                                        baseObj={baseObj}
                                        setbaseObj={setBaseObj}
                                        value={baseObj.PortTerminalId}
                                        data={{
                                            name: "PortTerminalId",
                                            label: "Port Terminal",
                                            displayExpr: "PortTerminalName",
                                            valueExpr: "PortTerminalId",
                                            searchExpr: "PortTerminalName"
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <SelectBoxDropdown
                                        dataSource={ancillaryData.anc_vesselServices}
                                        baseObj={baseObj}

                                        setbaseObj={setBaseObj}
                                        value={baseObj.VesselServiceId}
                                        data={{
                                            name: "VesselServiceId",
                                            label: "Vessel Service",
                                            displayExpr: "ServiceName",
                                            valueExpr: "VesselServiceId",
                                            searchExpr: "ServiceName"
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        sx={{ paddingRight: 3 }}
                                        variant="standard"
                                        label="Voyage Number"
                                        autoComplete="off"
                                        inputProps={{ maxLength: 25 }}
                                        name='VoyageNumber'
                                        value={baseObj.VoyageNumber ? baseObj.VoyageNumber : ''}
                                        onChange={(evt) => onValChange(evt)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>


                        </Grid>
                        <Grid item xs={12} marginTop={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <DatePicker
                                        label="Berth Date"
                                        format="dd/MM/yyyy"
                                        // sx={{fontSize:'9pt'}}
                                        renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                                        value={baseObj.BerthDate}
                                        onChange={onDateValChange('BerthDate')}
                                        name="BerthDate"
                                        variant="dialog" // or variant="inline"
                                        inputFormat="DD-MMM-YYYY"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <DatePicker
                                        label="Cut Off Date"
                                        format="dd/MM/yyyy"
                                        // sx={{fontSize:'9pt'}}
                                        renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                                        value={baseObj.CutOffDate}
                                        onChange={onDateValChange('CutOffDate')}
                                        name="BookingDate"
                                        variant="dialog" // or variant="inline"
                                        inputFormat="DD-MMM-YYYY"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <DatePicker
                                        label="ETA"
                                        format="dd/MM/yyyy"
                                        // sx={{fontSize:'9pt'}}
                                        renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                                        value={baseObj.Eta}
                                        onChange={onDateValChange('Eta')}
                                        name="BookingDate"
                                        variant="dialog" // or variant="inline"
                                        inputFormat="DD-MMM-YYYY"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <DatePicker
                                        label="ETD"
                                        format="dd/MM/yyyy"
                                        // sx={{fontSize:'9pt'}}
                                        renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                                        value={baseObj.Etd}
                                        onChange={onDateValChange('Etd')}
                                        name="BookingDate"
                                        variant="dialog" // or variant="inline"
                                        inputFormat="DD-MMM-YYYY"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        sx={{ paddingRight: 3 }}
                                        variant="standard"
                                        label="VVPC"
                                        autoComplete="off"
                                        inputProps={{ maxLength: 25 }}
                                        name='Vvpc'
                                        value={baseObj.Vvpc ? baseObj.Vvpc : ''}
                                        onChange={(evt) => onValChange(evt)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={12}>
                            <FormControl>
                                <FormControlLabel
                                    control={<Checkbox checked={baseObj.Active === "Y"} />}
                                    value={baseObj.Active}
                                    onChange={(evt) => onValChange(evt)}
                                    name="Active"
                                    label="Active"
                                    sx={{ marginTop: 1.5 }}
                                />
                            </FormControl>
                        </Grid>

                    </Grid>
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
                                <BxButton size="sm" style={{ textTransform: "none" }} onClick={backtolist} >
                                    <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                    Back to List
                                </BxButton>
                            </Stack>
                        ) : (clr === null && baseObj.CheckerStatus !== 'W') ? (
                            <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />} >

                                <BxButton variant="primary" size="sm" onClick={saveRecord} style={{ alignSelf: 'flex-end', marginTop: 10 }} >
                                    <i className="bi bi-x-square" style={{ marginRight: 10 }}></i>Save
                                </BxButton>
                                {(id !== "0" ?
                                    <BxButton size="sm" style={{ alignSelf: 'flex-end', marginTop: 10 }} onClick={() => deleteRecord()} >
                                        <i className={'bi-x-square-fill'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                        Delete
                                    </BxButton>
                                    : <></>
                                )}
                                <BxButton size="sm" style={{ alignSelf: 'flex-end', marginTop: 10 }} onClick={() => backtolist()} >
                                    <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                    Back to List
                                </BxButton>
                            </Stack>
                        ) :
                            <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                                {/* <BxButton variant="primary" size="sm" onClick={saveRecord} style={{ alignSelf: 'flex-end', marginTop: 10 }} >
                                    <i className="bi bi-x-square" style={{ marginRight: 10 }}></i>Save
                                </BxButton> */}
                                <></>
                                <BxButton size="sm" style={{ alignSelf: 'flex-end', marginTop: 10 }} onClick={() => backtolist()} >
                                    <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                    Back to List
                                </BxButton>
                            </Stack>
                        }
                    </FormControl>
                </Paper>
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
        </>
    )
}