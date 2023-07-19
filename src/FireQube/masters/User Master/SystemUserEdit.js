import {
  Box,
  CssBaseline,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Snackbar,
  Alert,
  Divider
} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../../shared/styles/dx-styles.css";
import { useLocation } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import BxButton from "react-bootstrap/button";
import UserDataGrid from "./UserDataGrid";
import UserAvatar from "./UserAvatar";
import { confirm, alert } from "devextreme/ui/dialog";
import SelectBoxDropdown from "../../../FFS/transactions/Booking/SelectBoxDropdown";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { getFormattedDate } from "../../../shared/scripts/common";


export default function SystemUserEdit() {
  const navigate = useNavigate();
  const m = new URLSearchParams(useLocation().search).get("m");
  var { id } = useParams();
  const clr = new URLSearchParams(useLocation().search).get("clr");
  const [showAR, setShowAR] = useState(false);
  const [openRejectDialog, setopenRejectDialog] = React.useState(false);
  const [rejectReason, setrejectReason] = React.useState("");
  const [baseObj, setBaseObj] = useState(null);
  const [ancillaryData, setAncillaryData] = useState("");
  const [changePass, setchangePass] = useState(false);
  const [pass, setPass] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  const [openNotificationBar, setOpenNotificationBar] = useState(false);
  const [notificationBarMessage, setnotificationBarMessage] = useState("");
  const [helperText, sethelperText] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    getAncillaryData();
    getinitialVal();
    setShowAR(clr === "c");
  }, []);

  const validateForm = () => {
    const errors = [];

    if (!baseObj.FirstName) {
      errors.push("First Name");
    }
    if (!baseObj.LastName) {
      errors.push("Last Name");
    }

    if (!baseObj.LoginId) {
      errors.push("Login ID");
    }
    if (!baseObj.EmailId) {
      errors.push("EmailId");
    }
    if (baseObj.DepartmentId == 0 || baseObj.DepartmentId == null) {
      errors.push("Department Name");

    }
    if (baseObj.BranchId == 0 || baseObj.BranchId == null) {
      errors.push("Branch Name");
    }
    if (baseObj.SpecialClassificationId == 0 || baseObj.SpecialClassificationId == null) {
      errors.push("Special Classification");
    }
    if(baseObj.SystemUserApps.length <= 0){
      errors.push("Selected Apps and Access Levels");
    } else{
      const temp = baseObj.SystemUserApps.filter((data) => data.DefaultAppFlag === 'Y');
      if(temp.length <= 0){
        errors.push("No default/primary app specified"); 
      }
    }

    if (changePass || id === "0") {
      if (!pass) {
        errors.push(`${id === '0' ? 'Password' : 'New Password'}`);
      } else if (!confirmPass) {
        errors.push("Confirm Password");
      } else if (pass !== confirmPass) {
        errors.push("Password does not match");
      }
    }

    if (errors.length > 0) {
      alert('Following fields have invalid or blank data in them:</br></br>' + errors.join("<br>"), "Validation Error");
      return false;
    }
    return true;
  };


  const hdr = {
    mId: m,
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
    if (e.target.type === "checkbox")
      setBaseObj({
        ...baseObj,
        [e.target.name]: e.target.checked ? true : false,
      });
    else setBaseObj({ ...baseObj, [e.target.name]: e.target.value });
  };

  const handleCheckBox = (e) => {
    if (e.target.checked) setchangePass(true);
    else setchangePass(false);
  };

  const manageCheckBoxFlags = () => {
    const newbaseObj = {};
    for (const key in baseObj) {
      if (baseObj[key] === true || baseObj[key] === false)
        newbaseObj[key] = baseObj[key] ? "Y" : "N";
      else newbaseObj[key] = baseObj[key];
    }
    return newbaseObj;
  };

  const handleOnBlur = () => {
    // if(!pass){
    //   setError(false);
    //   sethelperText('');
    // } else
    if (pass !== confirmPass) {
      setError(true);
      sethelperText('Password does not match');
    } else if (pass === confirmPass) {
      setBaseObj({ ...baseObj, LoginPassword: pass });
      setError(false);
      sethelperText('');
    }
  };


  const getinitialVal = () => {

    try {
      axios({
        method: "get",
        url: "SystemUser" + "/" + id,
        headers: hdr,
      })
        .then((response) => {
          let x = response.data;
          x.Active = x.Active === "Y" ? true : false;
          x.IsLocked = x.IsLocked === "Y" ? true : false;
          x.IsLoggedIn = x.IsLoggedIn === "Y" ? true : false;

          if(x.LastLoginDate !== '' ||x.LastLoginDate !== null)
            x.LastLoginDate = getFormattedDate(new Date(x.LastLoginDate));

          if(x.LastPasswordChangedDate !== '' ||x.LastPasswordChangedDate !== null)
            x.LastPasswordChangedDate = getFormattedDate(new Date(x.LastPasswordChangedDate));
          
          if(x.LockedDate !== '' ||x.LockedDate !== null)
            x.LockedDate = getFormattedDate(new Date(x.LockedDate));  

          if (id === "0") {
            x.SystemUserApps = [];
            x.LastLoginDate = null;
            x.LastPasswordChangedDate = null;
            x.InvalidAttempts = 0;
            x.IsLocked = "N";
            x.LockedDate = null;
            x.IsLoggedIn = "N";
          }
          console.log("getInitialVal", x);
          console.log("IsLoggedIn", x.IsLoggedIn);
          setBaseObj(x);

        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 417) {
              console.log("Error occured while getting record..");
            }
          }
        });
    } catch (ex) { }
  };


  const saveRecord = () => {
    console.log("baseobj", baseObj);
    if (!validateForm()) {
      return;
    }
    const vl = confirm("Confirm updation?", "Confirmation Alert");
    vl.then((dialogResult) => {
      if (dialogResult) {
        let x = manageCheckBoxFlags();
        console.log("x", x);
        axios({
          method: id === "0" ? "post" : "put",
          url: "SystemUser",
          data: x,
          headers: { mId: m },
        })
          .then((response) => {
            setnotificationBarMessage("Saved Data Successfully");
            setOpenNotificationBar(true);
            navigate(-1);
          })
          .catch((error) => {
            console.log("error", error);
            setnotificationBarMessage(
              "Error occurring while saving data " + error.response.data
            );
            setOpenNotificationBar(true);
          });
      }
    });
  };

  const getAncillaryData = () => {
    try {
      axios({
        method: "get",
        url: "SystemUser/AncillaryData/",
        headers: hdr,
      })
        .then((response) => {
          var x = response.data;
          console.log("getAncillaryData", x);
          setAncillaryData(x);
        })
        .catch((error) => {
          setAncillaryData("no values");
          if (error.response) {
            console.log("Error occured while retrieving getAncillaryData data..");
          }
        });
    } catch (ex) { }
  };



  const approveRequest = () => {
    //console.log(detailGridColumns);

    const vl = confirm('Confirm approval?', 'Confirmation Alert');
    vl.then((dialogResult) => {
      if (dialogResult) {
        axios({
          method: (baseObj.MarkedForDelete === 'Y' ? 'delete' : 'put'),
          url: "SystemUser" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
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
            alert(error.response.data, "Error occured while approving user");
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
          url: "SystemUser" + "/" + id,
          headers: { "mId": m }
        }).then((response) => {
          navigate(-1);
        }).catch((error) => {
          if (error.response) {
            console.log(error.response);
            alert(error.response.data, "Errors occured while deleting user");
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
      url: "SystemUser" + (baseObj.MarkedForDelete === 'Y' ? '/' + id : ''),
      data: (baseObj.MarkedForDelete === 'Y' ? null : baseObj),
      headers: { "mId": m, "cact": 'R', "rmrk": rejectReason }
    }).then((response) => {
      setnotificationBarMessage("Record rejected successfully!");
      setOpenNotificationBar(true);
      navigate(-1);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        alert(error.response.data, "Error occured while rejecting user");
      }
    })
  }

  const backtolist = () => {
    navigate(-1);
  };


  return (
    <>
      {baseObj && ancillaryData ? (
        <CssBaseline>
          <Box marginTop={0}>
            <Paper
              elevation={3}
              sx={{
                paddingTop: 3,
                paddingLeft: 4,
                paddingBottom: 2,
                paddingRight: 4,
                fontFamily: "Poppins",
              }}
            >
              <h2 style={{ paddingBottom: 0, marginBottom: 0 }}>System User</h2>
              <span>Manage the users who have access to the system </span>
              <Grid container spacing={2} marginTop={1}>
                <Grid item xs={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        variant="standard"
                        label="First Name"
                        required
                        onChange={(evt) => onValChange(evt)}
                        value={baseObj.FirstName}
                        autoComplete="off"
                        name="FirstName"
                        inputProps={{ maxLegnth: 25 }}
                        id="FirstName"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        required
                        variant="standard"
                        label="Last Name"
                        onChange={(evt) => onValChange(evt)}
                        value={baseObj.LastName}
                        autoComplete="off"
                        name="LastName"
                        inputProps={{ maxLegnth: 25 }}
                        id="LastName"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        variant="standard"
                        label="Login Id"
                        required
                        onChange={(evt) => onValChange(evt)}
                        value={baseObj.LoginId}
                        autoComplete="off"
                        name="LoginId"
                        inputProps={{ maxLegnth: 25 }}
                        id="LoginId"
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        variant="standard"
                        label="Email Id"
                        required
                        onChange={(evt) => onValChange(evt)}
                        value={baseObj.EmailId}
                        autoComplete="off"
                        name="EmailId"
                        inputProps={{ maxLegnth: 25 }}
                        id="EmailId"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <SelectBoxDropdown
                        dataSource={ancillaryData.anc_departments}
                        baseObj={baseObj}
                        setbaseObj={setBaseObj}
                        value={baseObj.DepartmentId}
                        data={{
                          name: "DepartmentId",
                          label: "Department Name",
                          displayExpr: "DepartmentName",
                          valueExpr: "DepartmentId",
                          searchExpr: "DepartmentName",
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <SelectBoxDropdown
                        dataSource={ancillaryData.anc_branches}
                        baseObj={baseObj}
                        setbaseObj={setBaseObj}
                        value={baseObj.BranchId}
                        data={{
                          name: "BranchId",
                          label: "Branch Name",
                          displayExpr: "BranchName",
                          valueExpr: "BranchId",
                          searchExpr: "BranchName",
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <SelectBoxDropdown
                        dataSource={ancillaryData.anc_specialClassifications}
                        baseObj={baseObj}
                        setbaseObj={setBaseObj}
                        value={baseObj.SpecialClassificationId}
                        data={{
                          name: "SpecialClassificationId",
                          label: "Special Classification",
                          displayExpr: "LookupItemName",
                          valueExpr: "LookupItemId",
                          searchExpr: "LookupItemName",
                        }}
                      />
                    </Grid>
                    {id !== "0" ? (
                      <>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            variant="standard"
                            label="Last Login Date"
                            value={
                              baseObj.LastLoginDate ? baseObj.LastLoginDate : ""
                            }
                            name="LastLoginDate"
                            readOnly
                            disabled
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            variant="standard"
                            label="Last Password Changed Date"
                            value={
                              baseObj.LastPasswordChangedDate
                                ? baseObj.LastPasswordChangedDate
                                : ""
                            }
                            name="LastPasswordChangedDate"
                            readOnly
                            disabled
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            variant="standard"
                            label="Invalid Attempts"
                            value={baseObj.InvalidAttempts}
                            name="InvalidAttempts"
                            readOnly
                            disabled
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            variant="standard"
                            label="Locked Date"
                            value={baseObj.LockedDate}
                            name="LockedDate"
                            readOnly
                            disabled
                          />
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}
                    <Grid item xs={8}>
                      <Grid container spacing={2}>
                        {changePass || id === "0" ? (
                          <>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                variant="standard"
                                label={id === '0' ? 'Password' : 'New Password'}
                                required
                                onChange={e => setPass(e.target.value)}
                                value={pass}
                                autoComplete="off"
                                name="LoginPassword"
                                inputProps={{ maxLength: 25 }}
                                type="password"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                variant="standard"
                                label="Confirm Password"
                                required
                                onChange={e => setconfirmPass(e.target.value)}
                                value={confirmPass}
                                onBlur={handleOnBlur}
                                autoComplete="off"
                                name="ConfirmPassword"
                                inputProps={{ maxLength: 25 }}
                                type="password"
                                error={error}
                                helperText={helperText}
                              />
                            </Grid>
                          </>
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack direction="row">
                        <FormControlLabel
                          control={
                            <Checkbox checked={baseObj.Active} size="small" />
                          }
                          label="Active"
                          sx={{ fontSize: "8pt" }}
                          value={baseObj.Active}
                          onChange={(evt) => onValChange(evt)}
                          name="Active"
                        />
                        {id !== "0" ? (
                          <>
                            <FormControlLabel
                              control={
                                <Checkbox checked={changePass} size="small" />
                              }
                              label="Change Password"
                              sx={{ fontSize: "8pt" }}
                              value={changePass}
                              onChange={(evt) => handleCheckBox(evt)}
                              name="changePass"
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Grid container>
                    <Grid item marginTop={2} marginRight={5}>
                      <UserAvatar baseObj={baseObj} setBaseObj={setBaseObj} />
                      <p style={{textAlign:'center',fontSize:'8pt'}}>Click here to upload image</p>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Stack marginTop={1}>
                <h5 style={{ marginBottom: 0 }}>Assign Apps and Access Levels</h5>
              </Stack>
              <hr marginBottom={1} marginTop={1} />
              <UserDataGrid
                baseObj={baseObj}
                setBaseObj={setBaseObj}
                ancillaryData={ancillaryData}
              />

              {showAR ? (
                <Stack spacing={0.2} sx={{ marginTop: 2 }} direction="row" divider={<Divider orientation="vertical" flexItem />}>
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
                </Stack>)
                : (clr === null) ? (
                  <Stack direction="row" flex="wrap" gap={1} marginTop={2}>
                    <BxButton variant="primary" size="sm" onClick={saveRecord}>
                      <i className="bi bi-save" style={{ marginRight: 10 }}></i>Save
                    </BxButton>
                    {
                      id !== '0' ?
                        <BxButton variant="primary" size="sm" onClick={deleteRecord}>
                          <i className={'bi-x-square-fill'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />Delete
                        </BxButton>
                        :
                        <></>
                    }
                    <BxButton variant="primary" size="sm" onClick={backtolist}>
                      <i
                        className="bi-arrow-right-square"
                        style={{ marginRight: 10 }}
                      ></i>
                      Back to List
                    </BxButton>
                  </Stack>
                )
                  :
                  <Box sx={{marginTop:2}}>
                    <BxButton variant="primary" size="sm" onClick={backtolist}>
                      <i
                        className="bi-arrow-right-square"
                        style={{ marginRight: 10 }}
                      ></i>
                      Back to List
                    </BxButton>
                  </Box>
              }
              <Snackbar
                open={openNotificationBar}
                onClose={handleCloseNotificationBar}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  onClose={handleCloseNotificationBar}
                  severity="info"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
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
          </Box>
        </CssBaseline>
      ) : (
        <></>
      )}
    </>
  );
}
