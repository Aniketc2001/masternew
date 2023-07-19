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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Rate(props) {

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

    const [shippingLineName, setShippingLineName] = useState('');
    const [shippingLineId, setShippingLineId] = useState(null);


    const [ratePartyName, setRatePartyName] = useState('');
    const [ratePartyId, setRatePartyId] = useState(null);

    const [Customer, setCustomerName] = useState('');
    const [CustomerId, setCustomerId] = useState(null);

    const hdr = {
        'mId': m
    };

    useEffect(() => {
        getancillaryData();
        getInitialVal();
        // getRateParty();
        setShowAR(clr === 'c');
        console.log("mid", m);
        console.log("props", props);
    }, [])

    const onValChange = (e) => {
        // console.log(e);
        if (e.target.type === 'checkbox')
            setBaseObj({ ...baseObj, [e.target.name]: e.target.checked ? "Y" : "N" });
        else
            setBaseObj({ ...baseObj, [e.target.name]: e.target.value });

    }

    const onDateValChange = (fieldName) => (value) => {
        setBaseObj({ ...baseObj, [fieldName]: value });

        if (fieldName === 'ValidFrom' && value > baseObj.ValidTill) {
            alert("'Valid From' should be less than 'Valid Till'");
            return;
        }

        if (fieldName === 'ValidTill' && value < baseObj.ValidFrom) {
            alert("'Valid Till' should be greater than 'Valid From'");
            return;
        }
    };


    const handleNumeric = (e) => {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    }


    const handleCloseNotificationBar = () => {
        setOpenNotificationBar(false);
    };

    const getInitialVal = () => {
        console.log("id", id);
        const url = 'Rate' + "/" + id;
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
                // x.DataFilterConditions.map(data => {
                //     data.MarkedForDelete = "N";
                //     if (data.DataFilterConditionId === null) {
                //         data.DataFilterConditionId = ctr;
                //         ctr = ctr - 1;
                //         data.FilterClause = "";
                //     }
                // });
                x.RateFactorString = " ";
                x.RateFactorWeight = " ";
                // x.Remarks = " ";
                console.log("getInitialVal2", x);
                setBaseObj(x);
                setShippingLineName(x.ShippingLineName);
                setShippingLineId(x.ShippingLineId);
                setRatePartyName(x.PartyName)

                if (typeof x.PartyId === 'null')
                    setRatePartyId(x.PartyId);

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
                url: 'Rate' + '/ancillaryData',
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

        if (baseObj.RateCode === "") {
            errors.push("Rate Code");
        }

        if (baseObj.ChargeId === null) {
            errors.push("Charge");
        }

        if (baseObj.PartyId === null) {
            errors.push("Rate Party");
        }
        if (baseObj.ShippingLineId === null) {
            errors.push("Shipping Line");
        }
        if (baseObj.LineServiceContractId === null) {
            errors.push("Line Service Contract");
        }
        if (baseObj.CustomerId === null) {
            errors.push("Booking Party");
        }
        if (baseObj.ShipperId === null) {
            errors.push("Shipper");
        }
        if (baseObj.ConsigneeId === null) {
            errors.push("Consignee");
        }
        if (baseObj.OsaId === null) {
            errors.push("Osa");
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
        if (baseObj.StuffingTypeId === null) {
            errors.push("Stuffing Type");
        }
        if (baseObj.BookingTypeId === null) {
            errors.push("Booking Type");
        }
        if (baseObj.PorId === null) {
            errors.push("Por");
        }
        if (baseObj.PolId === null) {
            errors.push("Pol");
        }
        if (baseObj.Pot1Id === null) {
            errors.push("Pot1");
        }
        if (baseObj.PodId === null) {
            errors.push("Pod");
        }
        if (baseObj.FpdId === null) {
            errors.push("Fpd");
        }
        if (baseObj.FromRange === "") {
            errors.push("From Range")
        }
        if (baseObj.ToRange === "") {
            errors.push("To Range")
        }
        if (baseObj.ValidFrom === null) {
            errors.push("Valid From")
        }
        if (baseObj.ValidTill === null) {
            errors.push("Valid Till")
        }
        if (baseObj.CurrencyId === null) {
            errors.push("Currency")
        }
        if (baseObj.RateFormula === "") {
            errors.push("Rate Formula")
        }

        if (Number(baseObj.FromRange) === 0) {

            errors.push("Please specify 'From range'");
        } else if (Number(baseObj.ToRange) === 0) {

            errors.push("Please specify 'To Range'");
        } else if (Number(baseObj.ToRange) < Number(baseObj.FromRange)) {

            errors.push("'To Range' should be greater than 'From Range'");
        }


        if (errors.length > 0) {
            alert('Following fields have invalid or blank data in them:</br></br>' + errors.join("</br>"), "Validation Errors");
            return false;
        }

        return true;
    };


    const saveRecord = () => {
        var m1 = m.replace(' ', '+');
        console.log("base", baseObj);
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
                    url: 'Rate',
                    data: x,
                    headers: { "mId": m1 }
                }).then((response) => {
                    setnotificationBarMessage("Rate details saved successfully!");
                    setOpenNotificationBar(true);
                    navigate(-1);
                    console.log(response.data);
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response);
                        alert("Error occured while saving data.." + error.response.data, "Rate Errors");
                    }
                })
            }
        });
    }

    // ------------arpprove reject----------------------------------------------------------------------------------------------

    const approveRequest = () => {
        //console.log(detailGridColumns);
        var m1 = m.replace(' ', '+');
        const vl = confirm('Confirm approval?', 'Confirmation Alert');
        vl.then((dialogResult) => {
            if (dialogResult) {
                axios({
                    method: (baseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
                    url: "Rate" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
                    data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
                    headers: { "mId": m1, "cact": 'A' }
                }).then((response) => {
                    //navigate("/" + props.listPageName +  "?m=" + m);
                    setnotificationBarMessage("Record approved successfully!");
                    setOpenNotificationBar(true);
                    navigate(-1);
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response);
                        alert(error.response.data, "Error occured while approving Rate");
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
            url: "Rate" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
            data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
            headers: { "mId": m, "cact": 'R', "rmrk": rejectReason }
        }).then((response) => {
            setnotificationBarMessage("Record rejected successfully!");
            setOpenNotificationBar(true);
            navigate(-1);
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                alert(error.response.data, "Error occured while rejecting Rate");
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

    const setancds = (ancchild, ds) => {
        //console.log('setting anc ds...',ancchild,ds);
        // setShippingLine({ ...shippingLine, [ancchild]: ds });
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
                        <h2 style={{ paddingBottom: 0, marginBottom: 5, marginTop: "8px" }}>Rate</h2>
                        <span>Manage tariff for charges based on various applicable factors</span>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid item xs={12} marginTop={2}>
                                    <h6 style={{ fontSize: "10pt" }}>Parties</h6>
                                </Grid>
                                <Grid container gap={2}>
                                    <Grid item xs={2}>
                                        <TextField

                                            variant="standard"
                                            label="Rate Code"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            name='RateCode'
                                            value={baseObj.RateCode ? baseObj.RateCode : ''}
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_charges}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ChargeId}
                                            data={{
                                                name: "ChargeId",
                                                label: "Charge",
                                                displayExpr: "ChargeName",
                                                valueExpr: "ChargeId",
                                                searchExpr: "ChargeName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={[]}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.PartyId}
                                            initialText={baseObj.PartyName ? baseObj.PartyName : ""}
                                            initialId={baseObj.PartyId ? baseObj.PartyId : ""}
                                            dynamic={true}
                                            setpropName={setRatePartyName}
                                            setpropId={setRatePartyId}
                                            ancobjectName={[]}
                                            setancds={setancds}
                                            ancchild="anc_results"
                                            apiName="party/filterparties"
                                            listType="all"
                                            fieldName="partyname"
                                            autoFocus
                                            data={{ name: "PartyId", label: "Rate Party", displayExpr: "PartyName", valueExpr: "PartyId", searchExpr: "PartyName" }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={[]}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ShippingLineId}
                                            initialText={baseObj.ShippingLineName ? baseObj.ShippingLineName : ""}
                                            initialId={baseObj.ShippingLineId ? baseObj.ShippingLineId : ""}
                                            dynamic={true}
                                            // setpropName={setShippingLineName}
                                            // setpropId={setShippingLineId}
                                            ancobjectName={[]}
                                            setancds={setancds}
                                            ancchild="anc_results"
                                            apiName="party/filterPartiesWithBlankSelector"
                                            listType="shippinglines"
                                            fieldName="partyname"
                                            autoFocus
                                            data={{ name: "ShippingLineId", label: "Shipping line", displayExpr: "ShippingLineName", valueExpr: "ShippingLineId", searchExpr: "ShippingLineName" }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_serviceContracts}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.LineServiceContractId}
                                            data={{
                                                name: "LineServiceContractId",
                                                label: "Line Service Contract",
                                                displayExpr: "ServiceContractNumber",
                                                valueExpr: "LineServiceContractId",
                                                searchExpr: "ServiceContractNumber"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={[]}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.CustomerId}
                                            initialText={baseObj.CustomerName ? baseObj.CustomerName : ""}
                                            initialId={baseObj.CustomerId ? baseObj.CustomerId : ""}
                                            dynamic={true}
                                            // setpropName={setCustomerName}
                                            // setpropId={setCustomerId}
                                            ancobjectName={[]}
                                            setancds={setancds}
                                            ancchild="anc_results"
                                            apiName="party/filterPartiesWithBlankSelector"
                                            listType="customers"
                                            fieldName="partyname"
                                            autoFocus
                                            data={{ name: "CustomerId", label: "Booking Party", displayExpr: "CustomerName", valueExpr: "CustomerId", searchExpr: "CustomerName" }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={[]}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ShipperId}
                                            initialText={baseObj.ShipperName ? baseObj.ShipperName : ""}
                                            initialId={baseObj.ShipperId ? baseObj.ShipperId : ""}
                                            dynamic={true}
                                            // setpropName={setCustomerName}
                                            // setpropId={setCustomerId}
                                            ancobjectName={[]}
                                            setancds={setancds}
                                            ancchild="anc_results"
                                            apiName="party/filterPartiesWithBlankSelector"
                                            listType="shippers"
                                            fieldName="partyname"
                                            autoFocus
                                            data={{ name: "ShipperId", label: "Shipper", displayExpr: "ShipperName", valueExpr: "ShipperId", searchExpr: "ShipperName" }}
                                        />
                                    </Grid>
                                    <Grid item >
                                        <SelectBoxDropdown
                                            dataSource={[]}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.ConsigneeId}
                                            initialText={baseObj.ConsigneeName ? baseObj.ConsigneeName : ""}
                                            initialId={baseObj.ConsigneeId ? baseObj.ConsigneeId : ""}
                                            dynamic={true}
                                            // setpropName={setCustomerName}
                                            // setpropId={setCustomerId}
                                            ancobjectName={[]}
                                            setancds={setancds}
                                            ancchild="anc_results"
                                            apiName="party/filterPartiesWithBlankSelector"
                                            listType="consignees"
                                            fieldName="partyname"
                                            autoFocus
                                            data={{ name: "ConsigneeId", label: "Consignee", displayExpr: "ConsigneeName", valueExpr: "ConsigneeId", searchExpr: "ConsigneeName" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={[]}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.OsaId}
                                            initialText={baseObj.OsaName ? baseObj.OsaName : ""}
                                            initialId={baseObj.OsaId ? baseObj.OsaId : ""}
                                            dynamic={true}
                                            // setpropName={setCustomerName}
                                            // setpropId={setCustomerId}
                                            ancobjectName={[]}
                                            setancds={setancds}
                                            ancchild="anc_results"
                                            apiName="party/filterPartiesWithBlankSelector"
                                            listType="osas"
                                            fieldName="partyname"
                                            autoFocus
                                            data={{ name: "OsaId", label: "OSA", displayExpr: "OsaName", valueExpr: "OsaId", searchExpr: "OsaName" }}
                                        />
                                    </Grid>
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
                            <Grid item xs={12}>
                                <Grid item xs={12} marginTop={2}>
                                    <h6 style={{ fontSize: "10pt" }}>Cargo</h6>
                                </Grid>
                                <Grid container gap={2}>
                                    <Grid item xs={2}>
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

                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_cargoTypes}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.CargoTypeId}
                                            data={{ name: "CargoTypeId", label: "Cargo Type", displayExpr: "CargoTypeName", valueExpr: "CargoTypeId", searchExpr: "CargoTypeName" }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
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
                                    <Grid item xs={2}>
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
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_stuffingTypes}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.StuffingTypeId}
                                            data={{
                                                name: "StuffingTypeId",
                                                label: "Stuffing Type",
                                                displayExpr: "StuffingTypeName",
                                                valueExpr: "StuffingTypeId",
                                                searchExpr: "StuffingTypeName"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
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
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item xs={12} marginTop={2}>
                                    <h6 style={{ fontSize: "10pt" }}>Route</h6>
                                </Grid>
                                <Grid container gap={2}>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ports}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.PorId}
                                            data={{ name: "PorId", label: "POR", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
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
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ports}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            // setpropId={setpodId}
                                            value={baseObj.Pot1Id}
                                            data={{ name: "Pot1Id", label: "POT1", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ports}
                                            baseObj={baseObj}
                                            // setpropName={setFpd}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.PodId}
                                            data={{ name: "PodId", label: "POD", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_ports}
                                            baseObj={baseObj}
                                            // setpropName={setFpd}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.FpdId}
                                            data={{ name: "FpdId", label: "FPD", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item xs={12} marginTop={2}>
                                    <h6 style={{ fontSize: "10pt" }}>Rate</h6>
                                </Grid>
                                <Grid container gap={2}>
                                    <Grid item>
                                        <TextField sx={{ paddingRight: 3 }}
                                            variant="standard" label="From Range" onChange={(evt) => onValChange(evt)}
                                            name="FromRange" value={baseObj.FromRange}
                                            autoComplete="off"
                                            inputProps={{ maxLength: 20 }}
                                            onKeyPress={(evt) => handleNumeric(evt)}

                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField sx={{ paddingRight: 3 }}
                                            variant="standard" label="To Range" onChange={(evt) => onValChange(evt)}
                                            name="ToRange" value={baseObj.ToRange}
                                            autoComplete="off"
                                            inputProps={{ maxLength: 20 }}
                                            onKeyPress={(evt) => handleNumeric(evt)}

                                        />
                                    </Grid>
                                    <Grid item>
                                        <DatePicker
                                            label="Valid From"
                                            format="dd/MM/yyyy"
                                            // sx={{fontSize:'9pt'}}
                                            renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                                            value={baseObj.ValidFrom}
                                            onChange={onDateValChange('ValidFrom')}
                                            name="ValidFrom"
                                            variant="dialog" // or variant="inline"
                                            inputFormat="DD-MMM-YYYY"

                                        />
                                    </Grid>
                                    <Grid item>
                                        <DatePicker
                                            label="Valid Till"
                                            format="dd/MM/yyyy"
                                            // sx={{fontSize:'9pt'}}
                                            renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                                            value={baseObj.ValidTill}
                                            onChange={onDateValChange('ValidTill')}
                                            name="ValidTill"
                                            variant="dialog" // or variant="inline"
                                            inputFormat="DD-MMM-YYYY"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <SelectBoxDropdown
                                            dataSource={ancillaryData.anc_currencies}
                                            baseObj={baseObj}
                                            setbaseObj={setBaseObj}
                                            value={baseObj.CurrencyId}
                                            data={{ name: "CurrencyId", label: "Currency", displayExpr: "CurrencyName", valueExpr: "CurrencyId", searchExpr: "CurrencyName" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            sx={{ paddingRight: 3 }}
                                            variant="standard"
                                            label="Rate/Formula"
                                            autoComplete="off"
                                            inputProps={{ maxLength: 25 }}
                                            name='RateFormula'
                                            value={baseObj.RateFormula ? baseObj.RateFormula : ''}
                                            onChange={(evt) => onValChange(evt)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <FormControl sx={{ marginTop: "3px" }}>
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