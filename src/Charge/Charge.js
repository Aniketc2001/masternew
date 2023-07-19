import { CheckBox } from "devextreme-react";
import { DataGrid, Column, Form, Editing, Paging, SearchPanel, Lookup, Button, FormItem } from "devextreme-react/data-grid";
import { Box, Checkbox, Divider, FormControl, FormControlLabel, Grid, Paper, Stack, TextField, Snackbar, Alert } from "@mui/material";
import BxButton from "react-bootstrap/button"
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { alert, confirm } from 'devextreme/ui/dialog';
import SelectBoxDropdown from "../FFS/transactions/Booking/SelectBoxDropdown";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import axios from "axios";
import { RequiredRule } from "devextreme-react/form";
export default function Charge() {

    const [ancillaryData, setancillaryData] = useState([]);
    const m = new URLSearchParams(useLocation().search).get('m');
    const clr = new URLSearchParams(useLocation().search).get('clr');
    const { id } = useParams();
    const [baseObj, setBaseObj] = useState(null);
    const navigate = useNavigate();
    const [notificationBarMessage, setnotificationBarMessage] = useState(''); //Notification Message
    const [openNotificationBar, setOpenNotificationBar] = useState(false); //Notification Bar Flag
    const [showAR, setShowAR] = useState(false);
    const [openRejectDialog, setopenRejectDialog] = useState(false);
    const [rejectReason, setrejectReason] = useState("");
    const [refresh, setRefresh] = useState(false);
    const dataGridRef = useRef();
    const dsActive = [{ id: 'Y', text: 'Yes' }, { id: 'N', text: 'No' }];


    const hdr = {
        'mId': m
    };

    useEffect(() => {
        getancillaryData();
        getInitialVal();
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

    const handleNumeric = (e) => {
        const charCode = e.which ? e.which : e.keyCode;
        const inputValue = e.target.value + String.fromCharCode(charCode);

        if (
            charCode !== 46 &&
            charCode > 31 &&
            (charCode < 48 || charCode > 57 || parseInt(inputValue) > 250)
        ) {
            e.preventDefault();
        }
    };



    const handleCloseNotificationBar = () => {
        setOpenNotificationBar(false);
    };

    const getInitialVal = () => {
        console.log("id", id);
        const url = 'Charge' + "/" + id;
        console.log("url", url);
        try {
            axios({
                method: 'get',
                url: url,
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getInitialVal", x);
                // x.CreatedDate = '2023-06-27T09:30:00';
                // x.ModifiedDate = '2023-06-27T09:30:00';
                // var ctr = -100;
                // x.CompositeCharges.map(data => {
                //     if (data.Active !== "Y") {
                //         data.Active ="Y";
                //     }
                // });

                console.log("getInitialVal2", x);
                setBaseObj(x);
                if (id === "0") {
                    x.CompositeCharges = [];
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

    const getancillaryData = () => {
        try {
            axios({
                method: 'get',
                url: 'Charge' + '/ancillaryData',
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getancillarydata", x)

                setancillaryData(x);
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

        if (baseObj.ChargeCode === null || baseObj.ChargeCode === "") {
            errors.push("Charge Code");
        }

        if (baseObj.ChargeName === null || baseObj.ChargeName === "") {
            errors.push("Charge Name");
        }

        if (baseObj.ChargeCategoryId === null || baseObj.ChargeCategoryId === "") {
            errors.push("Charge Category");
        }
        if (baseObj.ChargeTypeId === null || baseObj.ChargeTypeId === "") {
            errors.push("Charge Type");
        }
        if (baseObj.ChargeBasisId === null || baseObj.ChargeBasisId === "") {
            errors.push("Charge Basis");
        }
        if (baseObj.ChargeLevelId === null || baseObj.ChargeLevelId === "") {
            errors.push("Charge Level");
        }
        if (baseObj.HsnSacCode === null || baseObj.HsnSacCode === "") {
            errors.push("HSN SAC Code");
        }
        if (baseObj.InterstateBasisId === null || baseObj.InterstateBasisId === "") {
            errors.push("Interstate Basis");
        }

        if (errors.length > 0) {
            alert('Following fields have invalid or blank data in them:</br></br>' + errors.join("<br/>"), "Validation Errors");
            return false;
        }

        return true;
    };


    const saveRecord = () => {


        // baseObj.CompositeCharges.map(data => {
        //     if (data.ChargeId !== baseObj.ChargeId)
        //         data.ChargeId = baseObj.ChargeId;
        //     return data;
        // });

        console.log("baseobj2", baseObj);

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
                    url: 'Charge',
                    data: x,
                    headers: { "mId": m }
                }).then((response) => {
                    setnotificationBarMessage("Charge details saved successfully!");
                    setOpenNotificationBar(true);
                    navigate(-1);
                    console.log(response.data);
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response);
                        alert("Error occured while saving data.." + error.response.data, "Charge Errors");
                    }
                })
            }
        });
    }

    // ------------arpprove reject----------------------------------------------------------------------------------------------

    const approveRequest = () => {
        //console.log(detailGridColumns);

        const vl = confirm('Confirm approval?', 'Confirmation Alert');
        vl.then((dialogResult) => {
            if (dialogResult) {
                axios({
                    method: (baseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
                    url: "Charge" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
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
                        alert(error.response.data, "Error occured while approving Charge");
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
            url: "Charge" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
            data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
            headers: { "mId": m, "cact": 'R', "rmrk": rejectReason }
        }).then((response) => {
            setnotificationBarMessage("Record rejected successfully!");
            setOpenNotificationBar(true);
            navigate(-1);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                alert(error.response.data, "Error occured while rejecting Charge");
            }
        })
    }
    const hideRejectDialog = () => {
        setopenRejectDialog(false);
    }

    const onRejectValChange = (e) => {
        setrejectReason(e.target.value);
    }

    // ------------arpprove reject----------------------------------------------------------------------------------------------
    function renderCheckbox(cellData) {
        const handleChange = (e) => {
            console.log("Evalue", e.value);
            cellData.setValue(e.value ? 'Y' : 'N');
        };

        return (
            <CheckBox
                defaultValue={cellData.data.Active === 'Y'}
                onValueChanged={handleChange}
            />
        );
    }

    const renderDeleteStatus = (cellData) => {
        //console.log("celldata",cellData);
        return (
            <div>
                {cellData.data.MarkedForDelete === "Y" ? <i className={'bi-flag-fill'} style={{ color: 'red', fontSize: '10pt', marginRight: '5px' }} title="Marked for deletion" /> : <></>}
            </div>
        );
    }

    const markChargeRecordDelete = (e) => {
        const updatedData = baseObj.CompositeCharges.map(row => {
            console.log(row);
            if (row["CompositeChargeId"] === e.row.data["CompositeChargeId"]) {
                //if(parseInt(row["PartyAddressId"]) < 0){
                var fg = row.MarkedForDelete === "Y" ? "N" : "Y";
                return { ...row, MarkedForDelete: fg };
                //}
                //else{
                //  dataGrid.current.instance.deleteRow([e.row.rowIndex]);
                //}
            }
            return row;
        });

        console.log(updatedData);
        //setBaseObj({...baseObj, PartyAddresses: updatedData});
        baseObj.CompositeCharges = updatedData;
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
                        <h2 className='PageTitle' style={{ paddingBottom: 0, marginBottom: 5, marginTop: "8px" }}>Charge</h2>
                        <p className='PageSubTitle'>Define and manage charge definition used in the tariff</p>
                        <Grid container gap={1}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} marginTop={2}>
                                        <h6 style={{ fontSize: "10pt" }}>General Info</h6>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Charge Code"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            name='ChargeCode'
                                            value={baseObj.ChargeCode ? baseObj.ChargeCode : ''}
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Charge Name"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            name='ChargeName'
                                            value={baseObj.ChargeName ? baseObj.ChargeName : ''}
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField sx={{ paddingRight: 3 }}
                                            variant="standard" label="Display Order" onChange={(evt) => onValChange(evt)}
                                            name="DisplayOrder" value={baseObj.DisplayOrder}
                                            autoComplete="off"
                                            inputProps={{ maxLength: 20 }}
                                            onKeyPress={(evt) => handleNumeric(evt)}

                                        />
                                    </Grid>
                                    <Grid item xs={2}>
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
                            </Grid>
                            <Grid item xs={12}>

                                <Grid container gap={2}>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ChargeCategory}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ChargeCategoryId}
                                            data={{
                                                name: "ChargeCategoryId",
                                                label: "Charge Category",
                                                displayExpr: "LookupItemName",
                                                valueExpr: "LookupItemId",
                                                searchExpr: "LookupItemName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ChargeType}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ChargeTypeId}
                                            data={{
                                                name: "ChargeTypeId",
                                                label: "Charge Type",
                                                displayExpr: "LookupItemName",
                                                valueExpr: "LookupItemId",
                                                searchExpr: "LookupItemName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ChargeBasis}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ChargeBasisId}
                                            data={{
                                                name: "ChargeBasisId",
                                                label: "Charge Basis",
                                                displayExpr: "LookupItemName",
                                                valueExpr: "LookupItemId",
                                                searchExpr: "LookupItemName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ChargeLevel}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ChargeLevelId}
                                            data={{
                                                name: "ChargeLevelId",
                                                label: "Charge Level",
                                                displayExpr: "LookupItemName",
                                                valueExpr: "LookupItemId",
                                                searchExpr: "LookupItemName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormControl>
                                            <FormControlLabel
                                                control={<Checkbox checked={baseObj.IsCummulateRate === "Y"} />}
                                                value={baseObj.IsCummulateRate}
                                                onChange={(evt) => onValChange(evt)}
                                                name="IsCummulateRate"
                                                label="Is Commulative Rate"
                                                sx={{ marginTop: 1.5 }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item>

                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item xs={12} marginTop={2}>
                                    <h6 style={{ fontSize: "10pt" }}>Tax Info</h6>
                                </Grid>
                                <Grid container gap={2}>
                                    <Grid item xs={2}>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="HSC SAC Code"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            name='HsnSacCode'
                                            value={baseObj.HsnSacCode ? baseObj.HsnSacCode : ''}
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_InterstateBasis}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.InterstateBasisId}
                                            data={{
                                                name: "InterstateBasisId",
                                                label: "Interstate Basis",
                                                displayExpr: "LookupItemName",
                                                valueExpr: "LookupItemId",
                                                searchExpr: "LookupItemName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormControl>
                                            <FormControlLabel
                                                control={<Checkbox checked={baseObj.IsTaxable === "Y"} />}
                                                value={baseObj.IsTaxable}
                                                onChange={(evt) => onValChange(evt)}
                                                name="IsTaxable"
                                                label="Is Taxable"
                                                sx={{ marginTop: 1.5 }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormControl>
                                            <FormControlLabel
                                                control={<Checkbox checked={baseObj.IsInterState === "Y"} />}
                                                value={baseObj.IsInterState}
                                                onChange={(evt) => onValChange(evt)}
                                                name="IsInterState"
                                                label="Is Interstate"
                                                sx={{ marginTop: 1.5 }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item xs={12} marginTop={2}>
                                    <h6 style={{ fontSize: "10pt" }}>Derived Info <span style={{ fontSize: "8pt" }}>(Read only)</span> </h6>

                                </Grid>
                                <Grid container gap={2}>
                                    <Grid item xs={2}>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Charge Compute Tree"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            name='ChargeComputeTree'
                                            fullWidth
                                            disabled={true}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Charge Compute Order"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            name='ChargeComputeOrder'
                                            fullWidth
                                            disabled={true}
                                        />
                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                        <div>
                            <h6 style={{ marginTop: "15px", borderBottom: "1px solid black", fontSize: "10pt" }}>Composite of</h6>
                            <DataGrid
                                id="grid-container"
                                dataSource={baseObj.CompositeCharges}
                                keyExpr="CompositeChargeId"
                                ref={dataGridRef}
                                showBorders={true}
                                width="100%"
                                showRowLines={true}
                                showColumnLines={true}
                                rowAlternationEnabled={true}
                                allowColumnResizing={true}
                                onInitNewRow={(e) => {
                                    var rows = dataGridRef.current.instance.getVisibleRows();
                                    var visibleRows = rows.filter(function (row) {
                                        return row.rowType === "data";
                                    });
                                    var rowCount = visibleRows.length + 1;
                                    let totalCount = -1 * rowCount;
                                    e.data.CompositeChargeId = totalCount;
                                    e.data.MarkedForDelete = 'N';
                                    e.data.ModifiedDate = '2023-06-27T09:30:00';
                                    e.data.CreatedDate = '2023-06-27T09:30:00';
                                    // e.data.ChargeId = 0;
                                    e.data.CreatedBy = 0;
                                    e.data.ModifiedBy = 0;
                                    // e.data.Active ="Y";

                                }}
                            >

                                <Paging enabled={true} pageSize={7} />
                                <SearchPanel visible={true} />
                                <Editing mode="batch" newRowPosition="last" allowAdding={true} allowUpdating={true} allowDeleting={true}>
                                    <Form colCount={1} colSpan={2}></Form>
                                </Editing>
                                <Column caption="" cellRender={renderDeleteStatus} width={35} visible={true}>
                                    <FormItem visible={false} />
                                </Column>
                                <Column dataField="ParentChargeId" width={250} caption="Charge" >
                                    <Lookup dataSource={ancillaryData.anc_charges} displayExpr="ChargeName" valueExpr="ChargeId" />
                                    {/* <RequiredRule /> */}
                                </Column>
                                <Column dataField="Active" width={250} caption="Active"  >
                                    <Lookup
                                        dataSource={dsActive}
                                        displayExpr="text"
                                        valueExpr="id"
                                    />
                                </Column>
                                <Column type="buttons" width={100} >
                                    <Button name="FWdelete" text="Delete1" hint="Delete Record" onClick={markChargeRecordDelete} >
                                        <i className={'bi-trash3-fill'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
                                    </Button>

                                </Column>
                            </DataGrid>
                        </div>
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
                                        <i className="bi-save" style={{ marginRight: 10 }}></i>Save
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
                                        <i className="bi-save" style={{ marginRight: 10 }}></i>Save
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
    )
}