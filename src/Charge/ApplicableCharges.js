import { CheckBox, DateBox } from "devextreme-react";
import { DataGrid, Column, Form, Editing, Paging, SearchPanel, Lookup, Button, FormItem } from "devextreme-react/data-grid";
import { Box, Checkbox, Divider, FormControl, FormControlLabel, Grid, Paper, Stack, TextField, Snackbar, Alert } from "@mui/material";
import BxButton from "react-bootstrap/button"
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { alert, confirm } from 'devextreme/ui/dialog';
import SelectBoxDropdown from '../FFS/transactions/Booking/SelectBoxDropdown';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import axios from "axios";

export default function ApplicableCharges() {

    const [ancillaryData, setancillaryData] = useState([]);
    const m = new URLSearchParams(useLocation().search).get('m');
    const clr = new URLSearchParams(useLocation().search).get('clr');
    const { id } = useParams();
    const [baseObj, setBaseObj] = useState(null);
    const [moduleId, setModuleId] = useState(null);
    const navigate = useNavigate();
    const [notificationBarMessage, setnotificationBarMessage] = useState(''); //Notification Message
    const [openNotificationBar, setOpenNotificationBar] = useState(false); //Notification Bar Flag
    const [showAR, setShowAR] = useState(false);
    const [openRejectDialog, setopenRejectDialog] = useState(false);
    const [rejectReason, setrejectReason] = useState("");
    const [refresh, setRefresh] = useState(false);
    const dataGridRef = useRef();
    const [shippingLine, setShippingLine] = useState([]);
    const [shippingLineName, setShippingLineName] = useState('');
    const [shippingLineId, setShippingLineId] = useState(null);

    const hdr = {
        'mId': m
    };

    useEffect(() => {
        getancillaryData();
        getInitialVal();
        getShippingLine();
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

    const getInitialVal = () => {
        console.log("id", id);
        const url = 'ApplicableCharge' + "/" + id;
        console.log("url", url);
        try {
            axios({
                method: 'get',
                url: url,
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getInitialVal", x);
             

                console.log("getInitialVal2", x);
                setBaseObj(x);
                setShippingLine(x.ShippingLineName);
                setShippingLineId(x.ShippingLineId);
                if (id === "0") {
                    x.ApplicableCharges = [];
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
                url: 'ApplicableCharge' + '/ancillaryData',
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

    const getShippingLine = () => {
        try {
            axios({
                method: 'get',
                url: 'party/filterPartiesWithBlankSelector/shippinglines/partyname/searchtext',
                headers: hdr
            }).then((response) => {
                let x = response.data;
                console.log("getShippingLine", x)

                setShippingLine(x);
            }).catch((error) => {
                setShippingLine("no values");
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

        if (baseObj.ApplicableChargeFactorCode === null || baseObj.ApplicableChargeFactorCode === "") {
            errors.push("Applicable Charge Factor Code");
        }

        if (baseObj.ApplicableForId === null) {
            errors.push("Applicable For");
        }

        if (baseObj.ProductId === null) {
            errors.push("Product");
        }
        if (baseObj.BookingTypeId === null) {
            errors.push("Booking Type");
        }
        if (baseObj.ShippingLineId === null) {
            errors.push("Shipping Line");
        }
        if (baseObj.SectorId === null) {
            errors.push("Sector");
        }
        if (baseObj.ContainerSizeTypeId === null) {
            errors.push("Container Size Type");
        }
        if (baseObj.CargoTypeId === null) {
            errors.push("Cargo Type");
        }
        if (baseObj.CommodityCategoryId === null) {
            errors.push("Commodity Category");
        }
        if (baseObj.CommodityId === null) {
            errors.push("Commodity");
        }
        if (baseObj.CargoTypeId === null) {
            errors.push("Cargo Type");
        }
        if (baseObj.PorId === null) {
            errors.push("Por");
        }
        if (baseObj.PolId === null) {
            errors.push("Pol");
        }
        if (baseObj.PodId === null) {
            errors.push("Pod");
        }
        if (baseObj.FpdId === null) {
            errors.push("Fpd");
        }


        if (errors.length > 0) {
            alert('Following fields have invalid or blank data in them:</br></br>' + errors.join("<br/>"), "Validation Errors");
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
                    url: 'ApplicableCharge',
                    data: x,
                    headers: { "mId": m }
                }).then((response) => {
                    setnotificationBarMessage("Applicable Charge details saved successfully!");
                    setOpenNotificationBar(true);
                    navigate(-1);
                    console.log(response.data);
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response);
                        alert("Error occured while saving data.." + error.response.data, "Applicable Charge Errors");
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
                    url: "ApplicableCharge" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
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
                        alert(error.response.data, "Error occured while approving Applicable Charge");
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
            url: "ApplicableCharge" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
            data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
            headers: { "mId": m, "cact": 'R', "rmrk": rejectReason }
        }).then((response) => {
            setnotificationBarMessage("Record rejected successfully!");
            setOpenNotificationBar(true);
            navigate(-1);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                alert(error.response.data, "Error occured while rejecting Applicable Charge");
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
    const setancds = (ancchild, ds) => {
        //console.log('setting anc ds...',ancchild,ds);
        setShippingLine({ ...shippingLine, [ancchild]: ds });
    }

    const renderDeleteStatus = (cellData) => {
        //console.log("celldata",cellData);
        return (
            <div>
                {cellData.data.MarkedForDelete === "Y" ? <i className={'bi-flag-fill'} style={{ color: 'red', fontSize: '10pt', marginRight: '5px' }} title="Marked for deletion" /> : <></>}
            </div>
        );
    }

    const markApplicableChargeRecordDelete = (e) => {
        const updatedData = baseObj.ApplicableCharges.map(row => {
            console.log(row);
            if (row["ApplicableChargeId"] === e.row.data["ApplicableChargeId"]) {
 
                var fg = row.MarkedForDelete === "Y" ? "N" : "Y";
                return { ...row, MarkedForDelete: fg };
           
            }
            return row;
        });

        console.log(updatedData);
        baseObj.ApplicableCharges = updatedData;
        setRefresh(!refresh);
    }

    const handleValidations = (fieldName, value, baseObj) => {
        if (fieldName === 'ValidFrom' && value > baseObj.ValidTill) {
          alert("'Valid From' should be less than 'Valid Till'");
        } else if (fieldName === 'ValidTill' && value < baseObj.ValidFrom) {
          alert("'Valid Till' should be greater than 'Valid From'");
        }
      };

      
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
                        <h2 style={{ paddingBottom: 0, marginBottom: 5, marginTop: "8px" }}>Applicable Charge</h2>
                        <span>Configure various conditions along with charges applicable in each conditions</span>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} marginTop={2}>
                                        <h6 style={{ fontSize: "10pt" }}>General Info</h6>
                                    </Grid>
                                    <Grid item marginBottom={1}>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Code"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            name='ApplicableChargeFactorCode'
                                            value={baseObj.ApplicableChargeFactorCode ? baseObj.ApplicableChargeFactorCode : ''}
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container gap={2}>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_applicableFors}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ApplicableForId}
                                            data={{
                                                name: "ApplicableForId",
                                                label: "Applicable For",
                                                displayExpr: "ApplicableForName",
                                                valueExpr: "ApplicableForId",
                                                searchExpr: "ApplicableForName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_products}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ProductId}
                                            data={{
                                                name: "ProductId",
                                                label: "Product",
                                                displayExpr: "ProductName",
                                                valueExpr: "ProductId",
                                                searchExpr: "ProductName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_bookingTypes}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.BookingTypeId}
                                            data={{
                                                name: "BookingTypeId",
                                                label: "Booking Type",
                                                displayExpr: "BookingTypeName",
                                                valueExpr: "BookingTypeId",
                                                searchExpr: "BookingTypeName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        {/* <SelectBoxDropdown
                                            dataSource={shippingLine.anc_results}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ShippingLineId}
                                            data={{
                                                name: "ShippingLineId",
                                                label: "Shipping Line",
                                                displayExpr: "ShippingLineName",
                                                valueExpr: "ShippingLineId",
                                                searchExpr: "ShippingLineName"
                                            }}
                                        /> */}

                                        <SelectBoxDropdown
                                            dataSource={shippingLine.anc_results}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ShippingLineId}
                                            initialText={baseObj.ShippingLineName ? baseObj.ShippingLineName : ""}
                                            initialId={baseObj.ShippingLineId ? baseObj.ShippingLineId : ""}
                                            dynamic={true}
                                            setpropName={setShippingLineName}
                                            setpropId={setShippingLineId}
                                            ancobjectName={shippingLine.anc_results}
                                            setancds={setancds}
                                            ancchild="anc_results"
                                            apiName="party/filterPartiesWithBlankSelector"
                                            listType="shippinglines"
                                            fieldName="partyname"
                                            autoFocus
                                            data={{ name: "ShippingLineId", label: "Shipping line", displayExpr: "ShippingLineName", valueExpr: "ShippingLineId", searchExpr: "ShippingLineName" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_sectors}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.SectorId}
                                            data={{
                                                name: "SectorId",
                                                label: "Sector",
                                                displayExpr: "SectorName",
                                                valueExpr: "SectorId",
                                                searchExpr: "SectorName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item xs={12} marginTop={2}>
                                    <h6 style={{ fontSize: "10pt" }}>Cargo</h6>
                                </Grid>
                                <Grid container gap={2}>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_conSiTys}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ContainerSizeTypeId}
                                            data={{
                                                name: "ContainerSizeTypeId",
                                                label: "Container Size Type",
                                                displayExpr: "ContainerSiTy",
                                                valueExpr: "ContainerSizeTypeId",
                                                searchExpr: "ContainerSiTy"
                                            }}
                                        />
                                    </Grid>

                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_cargoTypes}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.CargoTypeId}
                                            data={{ name: "CargoTypeId", label: "Cargo Type", displayExpr: "CargoTypeName", valueExpr: "CargoTypeId", searchExpr: "CargoTypeName" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_commodityCategories}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.CommodityCategoryId}
                                            data={{
                                                name: "CommodityCategoryId",
                                                label: "Commodity Category",
                                                displayExpr: "CommodityCategoryName",
                                                valueExpr: "CommodityCategoryId",
                                                searchExpr: "CommodityCategoryName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_commodities}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.CommodityId}
                                            data={{
                                                name: "CommodityId",
                                                label: "Commodity",
                                                displayExpr: "CommodityName",
                                                valueExpr: "CommodityId",
                                                searchExpr: "CommodityName"
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item xs={12} marginTop={2}>
                                    <h6 style={{ fontSize: "10pt" }}>Route</h6>
                                </Grid>
                                <Grid container gap={2}>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ports}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.PorId}
                                            data={{ name: "PorId", label: "POR", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ports}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            // setpropName={setPol}
                                            // setpropId={setpolId}
                                            value={baseObj.PolId}
                                            data={{ name: "PolId", label: "POL", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ports}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            // setpropId={setpodId}
                                            value={baseObj.PodId}
                                            data={{ name: "PodId", label: "POD", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ports}
                                            baseObj={baseObj}
                                            // setpropName={setFpd}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.FpdId}
                                            data={{ name: "FpdId", label: "FPD", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Remarks"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            value={baseObj.Remarks}
                                            name='Remarks'
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth
                                        />
                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                        <div>
                            <h6 style={{ marginTop: "15px", borderBottom: "1px solid black", fontSize: "10pt" }}>Composite of</h6>
                            <DataGrid
                                id="grid-container"
                                dataSource={baseObj.ApplicableCharges}
                                keyExpr="ApplicableChargeId"
                                ref={dataGridRef}
                                showBorders={true}
                                width="100%"
                                showRowLines={true}
                                showColumnLines={true}
                                useIcons={true}
                                rowAlternationEnabled={true}
                                allowColumnResizing={true}
                                onInitNewRow={(e) => {
                                    var rows = dataGridRef.current.instance.getVisibleRows();
                                    var visibleRows = rows.filter(function (row) {
                                        return row.rowType === "data";
                                    });
                                    var rowCount = visibleRows.length + 1;
                                    let totalCount = -1 * rowCount;
                                    e.data.ApplicableChargeId = totalCount;
                                    e.data.MarkedForDelete = 'N';

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
                                <Column dataField="ChargeId" width={250} caption="Charge" >
                                    <Lookup dataSource={ancillaryData.anc_charges} displayExpr="ChargeName" valueExpr="ChargeId" />
                                </Column>
                                <Column
                                    dataField="ValidFrom"
                                    width={250}
                                    caption="Valid From"
                                    editCellRender={(props) => (
                                        <DateBox
                                            defaultValue={props.value}
                                            displayFormat="dd-MMM-yyyy"
                                            onValueChanged={(e) => {
                                                props.setValue(e.value);
                                                handleValidations('ValidFrom', e.value, props.row.data);
                                            }}
                                        />
                                    )}
                                />
                                <Column
                                    dataField="ValidTill"
                                    width={250}
                                    caption="Valid To"
                                    editCellRender={(props) => (
                                        <DateBox
                                            defaultValue={props.value}
                                            displayFormat="dd-MMM-yyyy"
                                            onValueChanged={(e) => {
                                                props.setValue(e.value);
                                                handleValidations('ValidTill', e.value, props.row.data);
                                            }}
                                        />
                                    )}
                                />
                                <Column dataField="CanApply" width={250} caption="Can Apply" editCellRender={renderCheckbox} />
                                <Column type="buttons" width={100} >
                                    <Button name="FWdelete" text="Delete1" hint="Delete Record" onClick={markApplicableChargeRecordDelete} >
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
                </Box >
                : <></>
            }
        </>
    )
}