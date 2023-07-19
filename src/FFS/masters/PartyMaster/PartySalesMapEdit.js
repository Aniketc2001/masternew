import { Box, CssBaseline, FormControlLabel, Paper, Stack, Tab, TextField, Typography, Tabs, Snackbar, Alert, Checkbox } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState, useEffect, useRef } from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import Divider from "@mui/material/Divider";
import { useLocation } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { alert, confirm } from 'devextreme/ui/dialog';
import BxButton from 'react-bootstrap/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import SelectBoxDropdown from "../../transactions/Booking/SelectBoxDropdown";
import PartyAddressSBRender from "./PartyAddressSBRender";
import MultivalSelectbox from "../../transactions/Booking/MultivalSelectbox";


export default function PartySalesMapEdit() {
  const m = new URLSearchParams(useLocation().search).get('m');
  var { id } = useParams();
  const clr = new URLSearchParams(useLocation().search).get('clr');
  const [openNotificationBar, setOpenNotificationBar] = useState(false); //Notification Bar Flag
  const [notificationBarMessage, setnotificationBarMessage] = useState(''); //Notification Message
  const [ancillaryData, setancillaryData] = useState(null);
  const [showAR, setShowAR] = useState(false);
  const [baseObj, setBaseObj] = useState(null);
  const [PartyId, setPartyId] = useState(null);
  const [partyAddressList, setPartyAddressList] = useState([]);
  const [openRejectDialog, setopenRejectDialog] = useState(false);
  const [rejectReason, setrejectReason] = useState("");
  const navigate = useNavigate();

  const hdr = {
    'mId': m
  };


  const handleCloseNotificationBar = () => {
    setOpenNotificationBar(false);
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
      setBaseObj({ ...baseObj, [e.target.name]: e.target.checked ? true : false });
    else
      setBaseObj({ ...baseObj, [e.target.name]: e.target.value });

    // console.log(e.target);
    // setbaseObj
  }


  useEffect(() => {
    getinitialVal();
    getancillaryData();
    setShowAR(clr === 'c');
  }, []);

  useEffect(() => {
    if (baseObj)
      getPartryAddress();
  }, [PartyId])

  const getinitialVal = () => {
    //    console.log("id", id);
    try {
      axios({
        method: 'get',
        url: 'PartySalesMap' + "/" + id,
        headers: hdr
      }).then((response) => {
        let x = response.data;
        x.Active = x.Active === 'Y' ? true : false;
        console.log('baseObj', x);
        setBaseObj(x);
        setPartyId(x.PartyId)

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
        url: 'PartySalesMap/AncillaryData',
        headers: hdr
      }).then((response) => {
        const x = response.data;
        setancillaryData(x);
        //console.log(response.data)
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


  const getPartryAddress = () => {
    try {
      axios({
        method: 'get',
        url: 'PartySalesMap/AddressesForParty/' + PartyId,
      }).then((response) => {
        const x = response.data.anc_addresses;
        // const partyAddress = x.filter(data=>data.PartyAddressName !== 'All Sites');
        console.log('party address', x);
        // console.log('filtered party address',partyAddress);
        setPartyAddressList(x);
      }).catch((error) => {
        //setancillaryData("no values");
        setPartyAddressList([]);
        if (error.response) {
          console.log("Error occured while retrieving ancillary data..");
        }
      })
    }
    catch (ex) {
    }
  }

  const cancelEntry = () => {
    navigate(-1);
  }


  const manageCheckBoxFlags = () => {
    const newbaseObj = {};
    for (const key in baseObj) {
      if (baseObj[key] === true || baseObj[key] === false)
        newbaseObj[key] = baseObj[key] ? 'Y' : 'N';
      else
        newbaseObj[key] = baseObj[key];
    }
    return (newbaseObj);
  }

  const validate = () => {
    const fields = [];
    if (baseObj.PartyId === null || baseObj.PartyId === 0) {
      fields.push('PartyId');
    }
    if (baseObj.ProductId === null) {
      fields.push('ProductId');
    }
    if (baseObj.PartyAddressId === null) {
      fields.push('PartyAddressId');
    }
    if (baseObj.SalesPersonId === null || baseObj.SalesPersonId === 0) {
      fields.push('SalesPersonId');
    }

    if (fields.length > 0) {
      var s = "";
      fields.forEach((item) => {
        var tmpItem = item.replace("Id", "");
        const message = `Invalid or blank data in ${tmpItem}<br/>`;
        s = s + message;
      });
      alert("Following fields have invalid data in them:<br/><br/>" + s, "Validation Check");
      return false;
    }

    return true;
  }


  const saveRecord = () => {
    if (!validate()) {
      return;
    }
    const newbaseObj = manageCheckBoxFlags();
    console.log('newBaseObj', newbaseObj)
    const vl = confirm('Confirm updation?', 'Confirmation Alert');
    vl.then((dialogResult) => {
      if (dialogResult) {
        axios({
          method: (id === "0" ? 'post' : 'put'),
          url: 'PartySalesMap',
          data: newbaseObj,
          headers: { "mId": m }
        }).then((response) => {
          console.log('party sales map', response.data)
          setnotificationBarMessage("Party sales map details saved successfully!");
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



  const deleteRecord = () => {
    const vl = confirm('Confirm delete?', 'Confirmation Alert');
    vl.then((dialogResult) => {
      if (dialogResult) {
        axios({
          method: 'delete',
          url: 'PartySalesMap' + "/" + id,
          headers: { "mId": m }
        }).then((response) => {
          navigate(-1);
        }).catch((error) => {
          console.log('error', error);
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
    //console.log(detailGridColumns);

    const vl = confirm('Confirm approval?', 'Confirmation Alert');
    vl.then((dialogResult) => {
      if (dialogResult) {
        axios({
          method: (baseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
          url: "PartySalesMap" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
          data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
          // headers: { "mId": m, "cact": 'A' }
          headers: { "mId": m }
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
      url: "PartySalesMap" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
      data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
      // headers: { "mId": m, "cact": 'R', "rmrk": rejectReason }
      headers: { "mId": m, "rmrk": rejectReason }
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


  return (

    <>
      {ancillaryData && baseObj ?
        <CssBaseline>
          <Box marginTop={0} >
            <Paper elevation={3} sx={{ paddingTop: 3, paddingLeft: 4, paddingBottom: 3, paddingRight: 4, fontFamily: 'Poppins' }}>
              <h2 style={{ paddingBottom: 0 }}>Party Sales Map</h2>
              <span>Manage party wise sales person mapping</span>
              <Grid container spacing={2} sx={{ paddingTop: 4 }}>
                <Grid item xs={12}>
                  <Stack direction='row' gap={2}>
                    <SelectBoxDropdown
                      dataSource={[]}
                      baseObj={baseObj}
                      setbaseObj={setBaseObj}
                      value={baseObj.PartyId}
                      initialText={baseObj.PartyName ? baseObj.PartyName : ""}
                      initialId={baseObj.PartyId ? baseObj.PartyId : ""}
                      dynamic={true}
                      setpropId={setPartyId}
                      apiName="party/filterparties"
                      listType="customers"
                      fieldName="partyname"
                      // data={{ name: "PartyId", label: "Party", displayExpr: "PartyName", valueExpr: "PartyId", searchExpr: "PartyName" }}
                      data={{ name: "PartyId", label: "Party", displayExpr: "CustomerName", valueExpr: "CustomerId", searchExpr: "CustomerName" }}
                    />
                    <SelectBoxDropdown
                      dataSource={ancillaryData.anc_products}
                      baseObj={baseObj}
                      setbaseObj={setBaseObj}
                      value={baseObj.ProductId}
                      data={{ name: "ProductId", label: "Products", displayExpr: "ProductName", valueExpr: "ProductId", searchExpr: "ProductName" }}
                    />
                    <MultivalSelectbox
                      dataSource={partyAddressList}
                      baseObj={baseObj}
                      setbaseObj={setBaseObj}
                      itemRenderJsx={PartyAddressSBRender}
                      value={baseObj.PartyAddressId}
                      data={{ name: "PartyAddressId", label: "Party Address", displayExpr: "PartyAddressName", valueExpr: "PartyAddressId", searchExpr: "PartyAddressName" }}
                    />
                    <SelectBoxDropdown
                      dataSource={ancillaryData.anc_salesPeople}
                      baseObj={baseObj}
                      setbaseObj={setBaseObj}
                      value={baseObj.SalesPersonId}
                      data={{ name: "SalesPersonId", label: "Sales Person", displayExpr: "SalesPersonName", valueExpr: "SalesPersonId", searchExpr: "SalesPersonName" }}
                    />
                  </Stack>
                  <Grid item xs={12} paddingTop={1}>
                    <FormControlLabel
                      control={<Checkbox checked={baseObj.Active} size="small" />}
                      label="Active"
                      sx={{ fontSize: '8pt' }}
                      value={baseObj.Active}
                      onChange={(evt) => onValChange(evt)}
                      name='Active'
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Stack direction='row' gap={1} marginTop={6}>
                {
                  showAR ?
                    <>
                      <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => approveRequest()}>
                        <i className={'bi-bag-check-fill'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                        Approve
                      </BxButton>
                      <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => rejectRequest()}>
                        <i className={'bi-bag-x-fill'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                        Reject
                      </BxButton>
                    </>
                    :
                    <>
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
                    </>
                }
                <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                  <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                  Back to List
                </BxButton>
              </Stack>
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
            </Paper>
          </Box >
        </CssBaseline >
        : <></>
      }
    </>

  )
}
