import React, { useState, useEffect, useRef } from 'react';
import { Checkbox, FormControl, FormControlLabel, Grid, Paper, TextField, Stack, Snackbar, Alert, Divider } from '@mui/material';
import { Box } from '@mui/material';
import { DataGrid, Column, Lookup, Paging, SearchPanel, Editing, Form, Button, FormItem } from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react';
import { ProductionQuantityLimitsSharp } from '@mui/icons-material';
import axios from 'axios';
import { matchPath, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import BxButton from "react-bootstrap/button"
import { alert, confirm } from 'devextreme/ui/dialog';
import SelectBoxDropdown from  '../../FFS/transactions/Booking/SelectBoxDropdown'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';


export default function DataFilter() {

    const [ancillaryData, setancillaryData] = useState([]);
    const m = new URLSearchParams(useLocation().search).get('m');
    const clr = new URLSearchParams(useLocation().search).get('clr');
    const { id } = useParams();
    const [baseObj, setBaseObj] = useState(null);
    const [moduleId, setModuleId] = useState(null);
    const [fieldData, setFieldData] = useState({ FilterCode: '', FilterName: '', Description: '' })
    const navigate = useNavigate();
    const [notificationBarMessage, setnotificationBarMessage] = useState(''); //Notification Message
    const [openNotificationBar, setOpenNotificationBar] = useState(false); //Notification Bar Flag
    const [showAR, setShowAR] = useState(false);
    const [openRejectDialog, setopenRejectDialog] = useState(false);
    const [rejectReason, setrejectReason] = useState("");
    const [refresh, setRefresh] = useState(false);
    const dataGrid = useRef(null);

    const hdr = {
        'mId': m
    };

    useEffect(() => {
        getancillaryData();
        getInitialVal();
        // getModuleDetails();
        setShowAR(clr === 'c');
        console.log("mid", m);
    }, [])

    const onValChange = (e) => {
        // console.log(e);
        if (e.target.type === 'checkbox')
            setBaseObj({ ...baseObj, [e.target.name]: e.target.checked ? "Y" : "N" });
        else
            setBaseObj({ ...baseObj, [e.target.name]: e.target.value });

        // console.log(e.target);
        // setbaseObj
    }

    const handleCloseNotificationBar = () => {
        setOpenNotificationBar(false);
    };



    const getancillaryData = () => {
        try {
            axios({
                method: 'get',
                url: 'datafilterconfig' + '/ancillaryData',
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getancillarydata", x)

                setancillaryData(x);
                setModuleId(x.LookupItemId);
                console.log("moduleid", moduleId);
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

    const getInitialVal = () => {
        const url = `DataFilterConfig/${id}`
        console.log("url", url);
        try {
            axios({
                method: 'get',
                url: url,
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getInitialVal", x);
                x.CreatedDate = '2023-06-27T09:30:00';
                x.ModifiedDate = '2023-06-27T09:30:00';
                var ctr = -100;
                x.DataFilterConditions.map(data => {
                    data.MarkedForDelete = "N";
                    if (data.DataFilterConditionId === null) {
                        data.DataFilterConditionId = ctr;
                        ctr = ctr - 1;
                        data.FilterClause = "";
                    }
                });

                console.log("getInitialVal2", x);
                setBaseObj(x);
                if (id === "0") {
                    x.DataFilterConditions = [];
                }
            }).catch((error) => {
                if (error.response) {
                    console.log("Error occurred while retrieving details..", error);
                }
            });
        } catch (ex) {
            // Handle exception
        }
    };

    const getDictionary = () => {
        try {
            axios({
                method: 'get',
                url: 'DataFilterConfig/getDictionary' + "/" + moduleId,
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getDictionary", x);
                var ctr = -1;
                x.DataFilterConditions.map(data => {
                    data.MarkedForDelete = "N";
                    data.DataFilterConditionId = ctr;
                    ctr = ctr - 1;
                    data.FilterClause = "";
                });
                console.log("getDictionary2", x);
                x.CreatedDate = '2023-06-27T09:30:00';
                x.ModifiedDate = '2023-06-27T09:30:00';
                setBaseObj({ ...baseObj, DataFilterConditions: x.DataFilterConditions });

            }).catch((error) => {
                if (error.response) {
                    if (error.response.status === 417) {
                        console.log("Error occured while deleting record..");
                    }
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
        var msg = "";
        if (baseObj.FilterCode === null || baseObj.FilterCode === "") {
            msg = msg + "Invalid filter code!" + "<br/>";
        }

        if (baseObj.FilterName === null || baseObj.FilterName === "") {
            msg = msg + "Invalid filter name!" + "<br/>";
        }

        if (baseObj.Description === null || baseObj.Description === "") {
            msg = msg + "Invalid description!" + "<br/>";
        }

        if (baseObj.ModuleId === null || baseObj.ModuleId === 0) {
            msg = msg + "Please select a valid Module!" + "<br/>";
        }

        if (msg !== "") {
            alert(msg, "Data Filter Config Validation Errors");
            return false;
        }
        return true;
    }

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
                    url: 'DataFilterConfig',
                    data: x,
                    headers: { "mId": m }
                }).then((response) => {
                    setnotificationBarMessage("Datafilter details saved successfully!");
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


    // --------------------------------------------------multivalrender-----

    function Multivalrender(props) {
        const handleChange = (e) => {
            props.setValue(e.value);
            // Set the ConditionOperatorId in baseObj
            props.data.ConditionOperatorId = e.value;
            setBaseObj({ ...baseObj });
        };

        const itemRender = (data) => {
            const helpText = data.OperatorHelpText.replace('/\n/g', '\u200B\n'); // Replace newlines with zero-width space + newline

            return (
                <div>
                    <div style={{ fontWeight: 'bold', fontFamily: 'poppins', fontSize: '10pt' }}>{data.Operator}</div>
                    <div style={{ fontSize: '8pt', fontFamily: 'poppins', whiteSpace: 'pre-line' }}>{helpText}</div>
                </div>
            );
        };

        return (
            <SelectBox
                dataSource={props.dataSource}
                displayExpr="Operator"
                valueExpr="ConditionOperatorId"
                value={props.value}
                onValueChanged={handleChange}
                itemRender={itemRender}
            />
        );
    }

    // --------------------------------------------------multivalrender---

    const approveRequest = () => {
        //console.log(detailGridColumns);

        const vl = confirm('Confirm approval?', 'Confirmation Alert');
        vl.then((dialogResult) => {
            if (dialogResult) {
                axios({
                    method: (baseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
                    url: "DataFilterConfig" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
                    data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
                    headers: { "mId": m, "cact": 'A' }
                }).then((response) => {
                    //navigate("/" + props.listPageName +  "?m=" + m);
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
            url: "DataFilterConfig" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
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

    const renderDeleteStatus = (cellData) => {
        // console.log("celldata",cellData);
        return (
            <div>
                {cellData.data.MarkedForDelete === "Y" ? <i className={'bi-flag-fill'} style={{ color: 'red', fontSize: '10pt', marginRight: '5px' }} title="Marked for deletion" /> : <></>}
            </div>
        );
    }

    const markConditionRecordDelete = (e) => {
        dataGrid.current.instance.deleteRow(e.row.rowIndex);
    };

    const markSavedConditionRecordDelete = (e) => {
        const updatedData = baseObj.DataFilterConditions.map(row => {
            console.log(row);
            if (row["DataFilterConditionId"] === e.row.data["DataFilterConditionId"]) {
                var fg = row.MarkedForDelete === "Y" ? "N" : "Y";
                return { ...row, MarkedForDelete: fg };
            }
            return row;
        });

        console.log(updatedData);
        baseObj.DataFilterConditions = updatedData;
        setRefresh(!refresh);
    }

    return (
        <>
            {baseObj ?
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
                    >
                        <h2 style={{ paddingBottom: 0, marginBottom: 5, marginTop: "8px" }}>Data Filter Config</h2>
                        <span>Define and manage data retrieval filter criteria for Modules</span>
                        <Grid container>
                            <Grid item xs={12} sx={{ marginTop: 3 }}>
                                <Grid container>
                                    <Grid item xs={2} >
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Datafilter Code"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            name='FilterCode'
                                            value={baseObj.FilterCode}
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth

                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Datafilter Name"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            value={baseObj.FilterName}
                                            name='FilterName'
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Datafilter Description"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 100 }}
                                            value={baseObj.Description}
                                            name='Description'
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={1.5}>
                                        {id === '0' ?
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_modules}
                                                baseObj={baseObj}
                                                setpropId={setModuleId}
                                                setbaseObj={setBaseObj}
                                                value={baseObj.ModuleId}
                                                data={{
                                                    name: "ModuleId",
                                                    label: "Datafilter Module",
                                                    displayExpr: "LookupItemName",
                                                    valueExpr: "LookupItemId",
                                                    searchExpr: "LookupItemName"
                                                }}
                                            /> :
                                            <TextField
                                                sx={{ paddingRight: 3 }}
                                                variant="standard"
                                                label="Datafilter Module"
                                                autoComplete="off"
                                                inputProps={{ maxLength: 25 }}
                                                value={baseObj.ModuleName}
                                                name='LookupItemName'
                                                onChange={(evt) => onValChange(evt)}
                                                readOnly
                                            />}
                                    </Grid>
                                    {
                                        id === '0' ?
                                            <BxButton
                                                size="sm"
                                                onClick={getDictionary}
                                                style={{ alignSelf: 'flex-end', marginTop: 10, marginLeft: 10 }}
                                           
                                            >
                                                <i className="bi bi-box-arrow-right" style={{ color: 'white', marginRight: 10 }}></i>Get Dictionary
                                            </BxButton>
                                            :
                                            <></>
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                    <FormControl>
                                        <FormControlLabel
                                            control={<Checkbox checked={baseObj.Active === "Y"} />}
                                            value={baseObj.Active}
                                            onChange={(evt) => onValChange(evt)}
                                            name="Active"
                                            label="Active"
                                            sx={{ marginTop: 2 }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <DataGrid
                            id="grid-container"
                            dataSource={baseObj.DataFilterConditions}
                            key="DataFilterConditionId"
                            showBorders={true}
                            width="100%"
                            ref={dataGrid}
                            showRowLines={true}
                            showColumnLines={true}
                            useIcons={true}
                            rowAlternationEnabled={true}
                            allowColumnResizing={true}
                            onInitNewRow={(e) => {
                                e.data.MarkedForDelete = 'N';
                                e.data.ModifiedDate = '2023-06-27T09:30:00';
                                e.data.CreatedDate = '2023-06-27T09:30:00';
                            }}
                        >
                            <Paging enabled={true} pageSize={7} />
                            <SearchPanel visible={true} />
                            <Editing mode="batch" newRowPosition="last" allowUpdating={true} allowDeleting={true}>
                                <Form colCount={1} colSpan={2}></Form>
                            </Editing>
                            <Column caption="" cellRender={renderDeleteStatus} width={35} visible={true}>
                                <FormItem visible={false} />
                            </Column>

                            <Column dataField="FieldName" width={250} caption="Datafield name">
                                {/* <Lookup dataSource={[]} displayExpr="DataFieldName" valueExpr="DataFieldNameId" /> */}
                            </Column>
                            <Column dataField="ConditionOperatorId" caption="Condition" width={500} editCellRender={(props) => (
                                <Multivalrender
                                    dataSource={ancillaryData.anc_conditionOperators}
                                    data={props.data}
                                    setValue={props.setValue}
                                    value={props.value}
                                />
                            )}>
                                <Lookup dataSource={ancillaryData.anc_conditionOperators} displayExpr="Operator" valueExpr="ConditionOperatorId" />
                            </Column>
                            <Column dataField="FilterClause" caption="Datafield value" width={200}></Column>
                            {id === '0' ?
                                <Column type="buttons" width={100} >
                                    <Button name="FWdelete" text="Delete1" hint="Delete Record" onClick={markConditionRecordDelete} >
                                        <i className={'bi-trash3-fill'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
                                    </Button>
                                </Column>
                                :
                                <Column type="buttons" width={100} >
                                    <Button name="FWdelete" text="Delete1" hint="Delete Record" onClick={markSavedConditionRecordDelete} >
                                        <i className={'bi-trash3-fill'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
                                    </Button>

                                </Column>}
                        </DataGrid>
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
                                    <></>
                                    <BxButton size="sm" style={{ alignSelf: 'flex-end', marginTop: 10 }} onClick={() => backtolist()} >
                                        <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                        Back to List
                                    </BxButton>
                                </Stack>
                            ) :
                                <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                                    <BxButton variant="primary" size="sm" onClick={saveRecord} style={{ alignSelf: 'flex-end', marginTop: 10 }} >
                                        <i className="bi bi-x-square" style={{ marginRight: 10 }}></i>Save
                                    </BxButton>
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
                : <></>}
        </>
    );
}
