import { Box, CssBaseline, FormControlLabel, Paper, Stack, Tab, TextField, Typography, Tabs, Snackbar, Alert } from "@mui/material";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect, useRef } from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import Divider from "@mui/material/Divider";
//import { TabContext, TabList, TabPanel } from "@mui/lab";
import '../../../shared/styles/dx-styles.css';
import PropTypes from 'prop-types';
import { useLocation } from "react-router-dom";
import PartyAddressEdit from "./PartyAddressEdit";
import PartyCommunication from "./PartyCommunication";
import PartySalesMap from "./PartySalesMap";
import RebateParty from "./RebateParty";
import { useParams, useNavigate } from "react-router-dom";
import { alert, confirm } from 'devextreme/ui/dialog';
import BxButton from 'react-bootstrap/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import PartyContact from './PartyContact';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function PartyMaster() {
  const navigate = useNavigate();
  const m = new URLSearchParams(useLocation().search).get('m');
  const [openNotificationBar, setOpenNotificationBar] = useState(false); //Notification Bar Flag
  const [notificationBarMessage, setnotificationBarMessage] = useState(''); //Notification Message
  const [initialVal, setinitialVal] = useState(null);
  const [ancillaryData, setancillaryData] = useState(null);
  const { id } = useParams();
  const clr = new URLSearchParams(useLocation().search).get('clr');
  const [showAR, setShowAR] = useState(false);
  const [baseObj, setBaseObj] = useState(null);
  const [openRejectDialog, setopenRejectDialog] = useState(false);
  const [rejectReason, setrejectReason] = useState("");
  const partyCodeRef = useRef(null);
  const partyNameRef = useRef(null);


  const hdr = {
    'mId': m
  };

  const handleCloseNotificationBar = () => {
    setOpenNotificationBar(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };




  const hideRejectDialog = () => {
    setopenRejectDialog(false);
  }

  const onRejectValChange = (e) => {
    setrejectReason(e.target.value);
  }

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
    if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  }


  useEffect(() => {
    getinitialVal();
    getancillaryData();
    setShowAR(clr === 'c');
  }, []);

  const getinitialVal = () => {
    console.log("id", id);
    try {
      axios({
        method: 'get',
        url: 'Party' + "/" + id,
        headers: hdr
      }).then((response) => {
        let x = response.data;
        console.log(x);

        if (id === "0") {
          x.CreatedDate = '01-01-2023 10:10:10 PM';
          x.ModifiedDate = '01-01-2023 10:10:10 PM';
          x.PartyCommunications = [];
          x.PartyAddresses = [];
          x.RebateParties = [];
          x.PartySalesMaps = [];
        }

        setBaseObj(x);

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

  const getancillaryData = () => {
    try {
      axios({
        method: 'get',
        url: 'Party' + '/ancillaryData',
        headers: hdr
      }).then((response) => {
        console.log(response.data)
        setancillaryData(response.data);
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


  const approveRequest = () => {
    //console.log(detailGridColumns);

    const vl = confirm('Confirm approval?', 'Confirmation Alert');
    vl.then((dialogResult) => {
      if (dialogResult) {
        axios({
          method: (baseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
          url: "Party" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
          data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
          headers: { "mId": m, "cact": 'A' }
        }).then((response) => {
          //navigate("/" + props.listPageName +  "?m=" + m);
          setnotificationBarMessage("Record approved successfully!");
          setOpenNotificationBar(true);
          navigate(-1);
        }).catch((error) => {
          if (error.response) {
            if (error.response.status === 417) {
              setnotificationBarMessage("Error occured while approving data.." + error.response.data);
              setOpenNotificationBar(true);
            }
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
          url: "Party" + "/" + id,
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
      url: "Party" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
      data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
      headers: { "mId": m, "cact": 'R', "rmrk": rejectReason }
    }).then((response) => {
      setnotificationBarMessage("Record rejected successfully!");
      setOpenNotificationBar(true);
      navigate(-1);
    }).catch((error) => {
      if (error.response) {
        if (error.response.status === 417) {
          setnotificationBarMessage("Error occured while rejecting data.." + error.response.data);
          setOpenNotificationBar(true);
        }
      }
    })
  }

  const validateForm = () => {
    //data validations
    if (baseObj.PartyCode === null || baseObj.PartyCode === "") {
      alert("Invalid party code!", "Party validation");
      partyCodeRef.current.focus();
      return false;
    }

    if (baseObj.PartyName === null || baseObj.PartyName === "") {
      alert("Invalid party name!", "Party validation");
      partyNameRef.current.focus();
      return false;
    }

    //check datagrid PartyAddresses
    const filteredAddressesData = baseObj.PartyAddresses.filter(row => row.SiteCode === null && row.SiteName === null && row.PinCode === null);
    console.log('filteredaddress', filteredAddressesData);
    if (filteredAddressesData.length > 0) {
      setValue(1);
      alert('Party address contains invalid rows!', 'Party Address Validation');
      return false;
    }

    //check datagrid PartyContacts
    let errmsg = "";
    const filteredAddressesDataMap = baseObj.PartyAddresses.map(addresssrow => {
      const filteredContactsData = addresssrow.PartyContacts.filter(row => row.ContactName === null && row.EmailId === null && row.MobileNumber === null);
      if (filteredContactsData.length > 0) {
        setValue(1);
        errmsg = errmsg + "Site: " + addresssrow.SiteName + "(" + addresssrow.SiteCode + ') contains invalid contact details,<br/>';
        return false;
      }
    });

    if (filteredAddressesDataMap.length !== baseObj.PartyAddresses.length) {
      alert(errmsg, "Party contacts validation");
      setValue(1);
      return false;
    }

    //check datagrid PartyCommunications
    const filteredCommunicationData = baseObj.PartyCommunications.filter(row => row.TriggerPointId === null && row.ToEmailIds === null);
    console.log('filteredCommunicationData', filteredCommunicationData);
    if (filteredCommunicationData.length > 0) {
      setValue(2);
      alert('Party communication contains invalid rows!', 'Party Communication Validation');
      return false;
    }

    //check datagrid RebateParties
    const filteredRebateData = baseObj.RebateParties.filter(row => row.RebatePartyName === null && row.Pan === null && row.Tan === null);
    if (filteredRebateData.length > 0) {
      setValue(3);
      alert('Rebate party contains invalid rows!', 'Rebate Party Validation');
      return false;
    }
    //check datagrid PartySalesMaps
    const filteredSalesMapData = baseObj.PartySalesMaps.filter(row => row.ProductId === null && row.PartyAddressId === null && row.SalesPersonId === null);
    if (filteredSalesMapData.length > 0) {
      setValue(4);
      alert('Party salesperson mapping contains invalid rows!', 'Party Salesperson mapping Validation');
      return false;
    }



    return true;
  }

  const cancelEntry = () => {
    navigate(-1);
  }

  const saveDraft = () => {
    console.log("baseobj", baseObj);
    if (!validateForm()) {
      return (false);
    }

    const vl = confirm('Confirm Save as draft?', 'Confirmation Alert');
    vl.then((dialogResult) => {
      if (dialogResult) {
        //setBaseObj(...baseObj,{DraftFlag: "A"});
        let x = baseObj;
        x.DraftFlag = "D";
        console.log("x", x);
        axios({
          method: (id === "0" ? 'post' : 'put'),
          url: 'Party',
          data: x,
          headers: { "mId": m }
        }).then((response) => {
          setnotificationBarMessage("Party details saved successfully!");
          setOpenNotificationBar(true);
          navigate(-1);
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            setnotificationBarMessage("Error occured while saving data.." + error.response.data);
            setOpenNotificationBar(true);
          }
        })
      }
    });
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
        x.DraftFlag = "F";
        console.log("x", x);
        axios({
          method: (id === "0" ? 'post' : 'put'),
          url: 'Party',
          data: x,
          headers: { "mId": m }
        }).then((response) => {
          setnotificationBarMessage("Party details saved successfully!");
          setOpenNotificationBar(true);
          navigate(-1);
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            setnotificationBarMessage("Error occured while saving data.." + error.response.data);
            setOpenNotificationBar(true);
          }
        })
      }
    });
  }

  const handlePartyAddressChange = (newPartyAddressData) => {
    setBaseObj(prevState => {
      // create a copy of the baseObj and update the child object
      const updatedBaseObj = { ...prevState };
      updatedBaseObj.PartyAddresses = newPartyAddressData;
      return updatedBaseObj;
    });
  }



  return (

    <>
      {baseObj ?
        <CssBaseline>
          <Box marginTop={1} >
            <Paper elevation={3} sx={{ paddingTop: 5, paddingLeft: 4, paddingBottom: 3, paddingRight: 4, fontFamily: 'Poppins' }}>
              <h2 style={{ paddingBottom: 0, marginBottom: 0 }}>Party</h2>
              <span>Manage details of parties and associated types</span>
              <Grid container spacing={2} sx={{ paddingTop: 2 }}>
                <Grid item xs={12}>
                  <div className="btn-secondary">
                    <Grid container spacing={2} sx={{}} >
                      <Grid item padding={1}>
                        <TextField sx={{ paddingRight: 3, paddingBottom: 2 }}
                          variant="standard"
                          label="Party Code"
                          onChange={(evt) => onValChange(evt)}
                          required
                          name="PartyCode"
                          value={baseObj.PartyCode}
                          autoComplete="off"
                          inputProps={{ maxLength: 25 }}
                          id="PartyCode"
                          inputRef={partyCodeRef}
                        />

                        <TextField sx={{ paddingRight: 3 }}
                          variant="standard"
                          label="Party Name"
                          onChange={(evt) => onValChange(evt)}
                          required
                          name="PartyName"
                          value={baseObj.PartyName}
                          autoComplete="off"
                          inputProps={{ maxLength: 25 }}
                          inputRef={partyNameRef}
                        />

                        <TextField sx={{ paddingRight: 3 }}
                          variant="standard"
                          label="Pan"
                          onChange={(evt) => onValChange(evt)}
                          name="Pan"
                          value={baseObj.Pan}
                          autoComplete="off"
                          inputProps={{ maxLength: 25 }}
                        />

                        <TextField sx={{ paddingRight: 3 }}
                          variant="standard"
                          label="Tan"
                          onChange={(evt) => onValChange(evt)}
                          name="Tan"
                          value={baseObj.Tan}
                          autoComplete="off"
                          inputProps={{ maxLength: 25 }}
                        />

                        <TextField sx={{ paddingRight: 3 }}
                          variant="standard"
                          label="EFZ Certificate Number"
                          onChange={(evt) => onValChange(evt)}
                          name="EfzCertificateNumber"
                          value={baseObj.EfzCertificateNumber}
                          autoComplete="off"
                          inputProps={{ maxLength: 25 }}
                        />

                        <TextField sx={{ paddingRight: 3 }}
                          variant="standard"
                          label="TDS Exemption Number"
                          onChange={(evt) => onValChange(evt)}
                          name="TdsExceptionNumber"
                          value={baseObj.TdsExceptionNumber}
                          autoComplete="off"
                          inputProps={{ maxLength: 25 }}
                        />

                        <TextField sx={{ paddingRight: 3 }}
                          variant="standard"
                          label="TDS Percentage"
                          onChange={(evt) => onValChange(evt)}
                          name="TdsPercentage"
                          value={baseObj.TdsPercentage}
                          autoComplete="off"
                          inputProps={{
                            maxLength: 25
                          }}
                          onKeyPress={(evt) => handleNumeric(evt)}
                        />

                        <TextField sx={{ paddingRight: 3 }}
                          variant="standard"
                          label="Credit Number Of Days"
                          onChange={(evt) => onValChange(evt)}
                          type="numnber"
                          name="CreditNumberOfDays"
                          value={baseObj.CreditNumberOfDays}
                          autoComplete="off"
                          inputProps={{ maxLength: 25 }}
                          onKeyPress={(evt) => handleNumeric(evt)}
                        />

                        <TextField sx={{ paddingRight: 3 }}
                          variant="standard" label="Credit Amount" onChange={(evt) => onValChange(evt)}
                          name="CreditAmount" value={baseObj.CreditAmount}
                          autoComplete="off"
                          inputProps={{ maxLength: 25 }}
                          onKeyPress={(evt) => handleNumeric(evt)}
                        />


                        <TextField
                          onChange={(evt) => onValChange(evt)} value={baseObj.Remarks}
                          name="Remarks" autoComplete="off"
                          label="Remarks"
                          variant="standard"

                        />
                        <FormControl>
                          <FormControlLabel
                            control={<Checkbox checked={baseObj.Active === "Y"} />}
                            value={baseObj.active}
                            onChange={(evt) => onValChange(evt)}
                            name="Active"
                            label="Active"
                            sx={{ marginTop: 2, marginLeft: 1 }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                {/* 
                <Divider orientation="vertical" flexItem sx={{ marginTop: 2, marginRight: 2, borderRightWidth: 1, borderColor: 'black' }} /> */}
                <Grid item xs={12} >


                  <Tabs sx={{ bgcolor: "whitesmoke" }}
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab label="Party & Types" {...a11yProps(0)} />
                    <Tab label="Address & Contacts" {...a11yProps(1)} />
                    <Tab label="Communication" {...a11yProps(2)} />
                    <Tab label="Rebate Party" {...a11yProps(3)} />
                    <Tab label="Party Sales Map" {...a11yProps(4)} />
                  </Tabs>

                  <TabPanel value={value} index={0}>
                    <Grid container spacing={2} >
                      <Grid item xs={6} >
                        <p style={{ fontWeight: "bold", margin: 0, marginLeft: 17 }} >Types Of Party</p>
                        <Grid container spacing={4}>
                          <Grid item sx={{ marginLeft: 2 }}>
                            <Stack spacing={0}>
                              <FormControl sx={{ p: 0 }} >
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsCustomer === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsCustomer"
                                  label="Customer"
                                />
                              </FormControl>
                              <FormControl sx={{ p: 0 }} >
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsCha === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name='IsCha'
                                  label="CHA"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsConsignee === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsConsignee"
                                  label="Consignee" />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsForwarder === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsForwarder"
                                  label="Forwarder"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>

                          <Grid item sx={{ marginLeft: 2 }}>
                            <Stack>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsBillingParty === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsBillingParty"
                                  label="Billing Party"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsLine === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsLine"
                                  label="Line"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsOsa === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsOsa"
                                  label="OSA"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsServiceProvider === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsServiceProvider"
                                  label="Service Provider"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item sx={{ marginLeft: 2 }}>
                            <Stack spacing={0}>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsShipper === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsShipper"
                                  label="Shipper"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsRebateParty === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsRebateParty"
                                  label="Rebate Party"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.IsNotifyParty === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="IsNotifyParty"
                                  label="Notify Party"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={5} sx={{ borderLeft: "1px solid darkgray" }}>
                        <p style={{ fontWeight: "bold", margin: 0, marginLeft: 31 }} >Other Infomation </p>
                        <Grid container >
                          <Grid item sx={{ marginLeft: 4 }}>
                            <Stack spacing={0} >
                              <FormControl variant="standard">
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.TdsExemptedFlag === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="TdsExemptedFlag"
                                  label="TDS Exempted"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.EconomicFreeZoneFlag === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="EconomicFreeZoneFlag"
                                  label="Economic Free Zone"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.PdcAcceptableFlag === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="PdcAcceptableFlag"
                                  label="PDC Acceptable"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item sx={{ marginLeft: 4 }}>
                            <Stack>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.RebateFlag === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="RebateFlag"
                                  label="Rebate"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.SpecialEconomicZoneFlag === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="SpecialEconomicZoneFlag"
                                  label="Special Economic Zone"
                                />
                              </FormControl>
                              <FormControl>
                                <FormControlLabel
                                  control={<Checkbox checked={baseObj.LetterUndertakingFlag === "Y"} />}
                                  onChange={(evt) => onValChange(evt)}
                                  name="LetterUndertakingFlag"
                                  label="Letter Undertaking"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={1} >
                    {baseObj ? <PartyAddressEdit ancillaryData={ancillaryData} partyAddressData={baseObj.PartyAddresses} baseObj={baseObj} setBaseObj={setBaseObj} onPartyAddressChange={handlePartyAddressChange} /> : <></>}

                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    {baseObj ? <PartyCommunication ancillaryData={ancillaryData} baseObj={baseObj} partyCommunicationData={baseObj.PartyCommunications} /> : <></>}
                  </TabPanel>

                  <TabPanel value={value} index={3}>
                    {baseObj ? <RebateParty ancillaryData={ancillaryData} baseObj={baseObj} rebatePartyData={baseObj.RebateParties} /> : <></>}
                  </TabPanel>

                  <TabPanel value={value} index={4}>
                    {baseObj ? <PartySalesMap ancillaryData={ancillaryData} baseObj={baseObj} partySalesMapData={baseObj.PartySalesMaps} /> : <></>}
                  </TabPanel>

                </Grid>

                <Grid item xs={12} spacing={2} sx={{ paddingTop: 4 }}>
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
                        <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                          <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                          Back to List
                        </BxButton>
                      </Stack>
                    ) : (clr === null && baseObj.CheckerStatus !== 'W') ? (
                      <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />} >
                        {baseObj.DraftFlag !== 'L' ? <BxButton size="sm" variant="secondary" style={{ textTransform: "none" }} onClick={() => saveDraft()} >
                          <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                          Save as draft
                        </BxButton> : <></>}
                        <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => saveRecord()}>
                          <i className={'bi-save'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                          Save
                        </BxButton>
                        {(id !== "0" ?
                          <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => deleteRecord()} >
                            <i className={'bi-x-square-fill'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                            Delete
                          </BxButton>
                          : <></>
                        )}
                        <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                          <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                          Back to List
                        </BxButton>
                      </Stack>
                    ) :
                      <Stack spacing={0.2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                        <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                          <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
        </CssBaseline >
        : <></>}
    </>

  )
}
