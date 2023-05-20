import React, { useEffect, useState } from 'react';
import { Alert, Box, Paper, Snackbar, Stack, useMediaQuery, useTheme } from '@mui/material'
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GeneralInformationTab from './GeneralInformationTab';
import LineDetailsTab from './LineDetailsTab';
import BookingSummary from './BookingSummary';
import BxButton from "react-bootstrap/button"
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { alert, confirm } from 'devextreme/ui/dialog';

export default function Booking() {
  const m = new URLSearchParams(useLocation().search).get('m');
  const { id } = useParams();
  const navigate = useNavigate();
  const [ancillaryData, setancillaryData] = useState(null);
  const [baseObj, setbaseObj] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('Draft');  // for button visibility
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [customerName, setcustomerName] = useState('');
  const [commodity, setCmmodity] = useState('')
  const [shippingLine, setshippingLine] = useState('')
  const [commodityCategory, setCommodityCategory] = useState('')
  const [vesselVoyage, setvesselVoyage] = useState('');
  const [fpd, setFpd] = useState('');
  const [pol, setPol] = useState('');
  const [customerId, setcustomerId] = useState(null);
  const [productId, setproductId] = useState(null);
  const [parentvvpcId, setparentvvpcId] = useState(null);
  const [siteId, setsiteId] = useState(null);
  const [openNotificationBar, setOpenNotificationBar] = useState(false); //Notification Bar Flag
  const [notificationBarMessage, setnotificationBarMessage] = useState(''); //Notification Message
  const [customerAddressList, setcustomerAddressList] = useState([]);
  const [vesselVoyageList, setvesselVoyageList] = useState([]);
  const [salesPersonList, setsalesPersonList] = useState([]);
  

  const [polId,setpolId] = useState(null);


  const hdr = {
    'mId': m
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getSalesPerson();
  }, [siteId,productId]);

  useEffect(() => {
    getVesselVoyage();
  }, [polId]);

  useEffect(() => {
    getCustomerAddress();
  }, [customerId]);

  useEffect(() => {
    getinitialVal();
    getancillaryData();
    // eslint-disable-next-line
  }, []);

  const handleCloseNotificationBar = () => {
    setOpenNotificationBar(false);
  };

  const getVesselVoyage = () => {
    try {
      axios({
        method: 'get',
        url: 'booking/filteredancillarydata/vvpcs/' + polId
      }).then((response) => {
        const x = response.data.anc_results;
        console.log('vessel', x);
        setvesselVoyageList(x);
        // ancillaryData.anc_customerSites = x;
        //setancillaryData({ ...ancillaryData, anc_customerSites: x });

      }).catch((error) => {
        //setancillaryData("no values");
        setvesselVoyage(null);
        if (error.response) {
          console.log("Error occured while retrieving ancillary data..");
        }
      })
    }
    catch (ex) {
    }
  }

  const getSalesPerson = () => {
    try {
      var url = 'booking/filteredancillarydata/salespeople/' + customerId + "|" + productId + "|" + siteId;
      console.log(url);
      axios({
        method: 'get',
        url: 'booking/filteredancillarydata/salespeople/' + customerId + "|" + productId + "|" + siteId
      }).then((response) => {
        const x = response.data.anc_results;
        console.log("party sales",x);
        //ancillaryData.anc_salesPeople = x;
        //setancillaryData({ ...ancillaryData, anc_salesPeople: x });
        setsalesPersonList(x);
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


  const getCustomerAddress = () => {
    try {
      axios({
        method: 'get',
        url: 'booking/filteredancillarydata/customersites/' + customerId
      }).then((response) => {
        const x = response.data.anc_results;
        console.log('cust add', x);
        setcustomerAddressList(x);
        // ancillaryData.anc_customerSites = x;
        //setancillaryData({ ...ancillaryData, anc_customerSites: x });

      }).catch((error) => {
        //setancillaryData("no values");
        setcustomerAddressList(null);
        if (error.response) {
          console.log("Error occured while retrieving ancillary data..");
        }
      })
    }
    catch (ex) {
    }
  }

  const getinitialVal = () => {
    try {
      axios({
        method: 'get',
        url: `Booking/${id}`,
        headers: hdr
      }).then((response) => {
        let x = response.data;
        x.LineBLRequiredFlag = x.LineBLRequiredFlag === 'Y' ? true : false;
        x.PortTerminalId = 25;
        if (id === '0') {
          x.CreatedDate = '01-01-2023 10:10:10 PM';
          x.ModifiedDate = '01-01-2023 10:10:10 PM';
          x.BookingInventories = [];
        }
        console.log('baseObj', x);
        setbaseObj(x);
        
        setproductId(x.ProductId);

        //Customer Site
        setcustomerId(x.CustomerId);

        //Sales Person
        setsiteId(x.CustomerSiteId);

        //Vessel Voyage
        setpolId(x.PolId);
        setparentvvpcId(x.VesselVoyagePortId);

        //Set Summary Headers
        setcustomerName(x.CustomerName);
        setPol(x.PolName);
        setCommodityCategory(x.CommodityCategoryName);
        setCmmodity(x.CommodityName);
        setvesselVoyage(x.VesselVoyagePortName);
        setBookingStatus(x.StatusCode);
        setFpd(x.FpdName);
        setshippingLine(x.ShippingLineName);
        if(x.StatusId === null){
          setBookingStatus('DRAFT')
        }

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
        url: 'Booking/AncillaryData',
        headers: hdr
      }).then((response) => {
        const x = response.data;
        x.anc_customers = [];
        x.anc_customerSites = [];
        x.anc_shippers = [];
        x.anc_shippingLines = [];
        x.anc_consignees = [];
        x.anc_chas = [];
        x.anc_osas = [];
        setancillaryData(x);
        console.log(response.data)
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


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const manageCheckBoxFlags = () => {
    const newbaseObj = {};

    for (const key in baseObj) {
      if (baseObj[key] === true || baseObj[key] === false) {
        newbaseObj[key] = baseObj[key] ? 'Y' : 'N';
      }
      else {
        newbaseObj[key] = baseObj[key];
      }
    }

    return (newbaseObj);
  }

  // const saveRecord = (uact) => {
  //   const newbaseObj = manageCheckBoxFlags();
  //   console.log('newObj', newbaseObj)
  //   console.log('mId', module)
  //   setBookingStatus(uact);
  //   axios({
  //     method: (id === "0" ? 'post' : 'put'),
  //     url: 'Booking',
  //     data: newbaseObj,
  //     headers: {
  //       "mId": m,
  //       "uact": uact
  //     }
  //   }).then((response) => {
  //     // setBookingStatus(uact);
  //     console.log('draft', response.data)
  //   }).catch((error) => {
  //     console.log(error)
  //     if (error.response) {
  //     }
  //   })
  // }

  const saveRecord = (uact) => {
    if (uact == "CONFIRMED" || uact == "READY" || uact == "FINALIZED")
      if (!validateForm()) {
        return (false);
      }
    const newbaseObj = manageCheckBoxFlags();
    console.log('newObj', newbaseObj);
    console.log('mId', module);

   
      //setBookingStatus(uact);
      const vl = confirm('Confirm updation?', 'Confirmation Alert');
      vl.then((dialogResult) => {
        if (dialogResult) {
          axios({
            method: (id === "0" ? 'post' : 'put'),
            url: 'Booking',
            data: newbaseObj,
            headers: {
              "mId": m,
              "uact": uact
            }
          }).then((response) => {
            setBookingStatus(uact);
            setnotificationBarMessage("Booking details saved as " +uact+" successfully!");
            setOpenNotificationBar(true);
            const x = response.data;
            console.log('draft', response.data);
            setbaseObj({...baseObj,BookingId:x.BookingId,BookingReference:x.BookingReference});
            if(uact === "DRAFT"){
              return;
            }
            navigate(-1);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
              setnotificationBarMessage("Error occurred while saving data: " + error.response.data);
              setOpenNotificationBar(true);
            }
          });
        }
      });
    

  };



  function validateForm(uact) {
    // Check if the required fields are empty
    if (!baseObj.ProductId) {
      alert("Please specify product type", "Booking Validation")
      return false;
    }
    if (!baseObj.BookingTypeId) {
      alert("Please specify booking type", "Booking Validation");
      return false;
    }
    if (!baseObj.BookingOfficeId) {
      alert("Please specify booking office", "Booking Validation");
      return false;
    }
    if (!baseObj.BookingDate) {
      alert("Please specify booking date", "Booking Validation");
      return false;
    }
    if (!baseObj.DeliveryModeId) {
      alert("Please specify delivery mode", "Booking Validation");
      return false;
    }
    if (!baseObj.StuffingTypeId) {
      alert("Please specify stuffing type", "Booking Validation");
      return false;
    }
    if (!baseObj.StuffingLocationId) {
      alert("Please specify stuffing location", "Booking Validation");
      return false;
    }
    if (!baseObj.Remarks) {
      alert("Please specify remarks", "Booking Validation");
      return false;
    }
    if (!baseObj.CargoTypeId) {
      alert("Please specify cargo type", "Booking Validation");
      return false;
    }
    if (!baseObj.CommodityCategoryId) {
      alert("Please specify commodity category", "Booking Validation");
      return false;
    }
    if (!baseObj.CommodityId) {
      alert("Please specify commodity", "Booking Validation");
      return false;
    }
    if (!baseObj.WeightUnitId) {
      alert("Please specify weight unit", "Booking Validation");
      return false;
    }
    if (!baseObj.GrossWeight) {
      alert("Please specify gross weight", "Booking Validation");
      return false;
    }
    if (!baseObj.VolumeUnitId) {
      alert("Please specify volume unit", "Booking Validation");
      return false;
    }
    if (!baseObj.Volume) {
      alert("Please specify volume", "Booking Validation");
      return false;
    }
    if (!baseObj.ImoclassId) {
      alert("Please specify imo class", "Booking Validation");
      return false;
    }
    if (!baseObj.ImounnumberId) {
      alert("Please specify imo un number", "Booking Validation");
      return false;
    }
    if (!baseObj.PackagingGroup) {
      alert("Please specify packaging group", "Booking Validation");
      return false;
    }
    if (!baseObj.CustomerId) {
      alert("Please specify customer", "Booking Validation");
      return false;
    }
    if (!baseObj.CustomerSiteId) {
      alert("Please specify customer site", "Booking Validation");
      return false;
    }
    if (!baseObj.ShipperId) {
      alert("Please specify shipper", "Booking Validation");
      return false;
    }

    if (!baseObj.ShippingLineId) {
      alert("Please specify shipping line", "Booking Validation");
      return false;
    }
    if (!baseObj.ConsigneeId) {
      alert("Please specify consignee", "Booking Validation");
      return false;
    }
    if (!baseObj.ChaId) {
      alert("Please specify custom house agent (CHA)", "Booking Validation");
      return false;
    }
    if (!baseObj.SalesPersonId) {
      alert("Please specify sales person", "Booking Validation");
      return false;
    }
    if (!baseObj.OsaId) {
      alert("Please specify overseas agent (OSA)", "Booking Validation");
      return false;
    }
    if (!baseObj.PorId) {
      alert("Please specify place of receipt (POR)", "Booking Validation");
      return false;
    }
    if (!baseObj.PolId) {
      alert("Please specity port of loading (POL)", "Booking Validation");
      return false;
    }
    if (!baseObj.PodId) {
      alert("Please specify port of delivery (POD)", "Booking Validation");
      return false;
    }
    if (!baseObj.FpdId) {
      alert("Please Specify (fpd)", "Booking Validation");
      return false;
    }
    if (!baseObj.ModeOfTransportId) {
      alert("Please specify mode of transport (MOT)", "Booking Validation");
      return false;
    }
    return true;
  }


  const cancelEntry = () => {
    navigate(-1);
  }


  return (
    <>
      {
        baseObj && ancillaryData ?
          <Box sx={{ fontFamily: 'poppins' }}>
            <Box>
              <Paper elevation={5} sx={{ p: 3, paddingBottom: 0, height: '90vh' }}>
                <BookingSummary
                  customerName={customerName}
                  bookingStatus={bookingStatus}
                  initialVal={baseObj}
                  ancillaryData={ancillaryData}
                  commodity={commodity}
                  commodityCategory={commodityCategory}
                  vesselVoyage={vesselVoyage}
                  shippingLine={shippingLine}
                  fpd={fpd}
                  pol={pol}
                />
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} textColor="secondary" variant={`${isSmallScreen ? "fullWidth" : "standard"}`} indicatorColor="secondary" aria-label="booking tab">
                      <Tab accessKey='g' label="General Information"  {...a11yProps(0)} />
                      <Tab accessKey='l' label="Line Details" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                  {
                    value === 0 ?
                      <div>
                        <GeneralInformationTab setshippingLine={setshippingLine} salesPersonList={salesPersonList} setpolId={setpolId} setPol={setPol} setFpd={setFpd} customerAddressList={customerAddressList} setCommodityCategory={setCommodityCategory} setCmmodity={setCmmodity} setsiteId={setsiteId} setcustomerName={setcustomerName} setproductId={setproductId} setcustomerId={setcustomerId} baseObj={baseObj} setbaseObj={setbaseObj} ancillaryData={ancillaryData} />
                      </div>
                      : value === 1 ?
                        <div>
                          <LineDetailsTab vesselVoyageList={vesselVoyageList} setvesselVoyage={setvesselVoyage} ancillaryData={ancillaryData} baseObj={baseObj} setbaseObj={setbaseObj} />
                        </div>
                        :

                        <></>
                  }
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
                </Box>
                <Box sx={{ marginTop: 1 }}>
                  <Stack direction='row' flexWrap='wrap' gap={1} >
                    {
                      bookingStatus === 'Draft' || bookingStatus === 'DRAFT' ?
                        <>
                          <BxButton variant="secondary" onClick={() => saveRecord('DRAFT')} size='sm'>  <i className="bi bi-card-heading" style={{ marginRight: 10 }} ></i>Save as Draft</BxButton>
                          <BxButton variant="primary" onClick={() => saveRecord('READY')} size='sm'>  <i className="bi bi-save" style={{ marginRight: 10 }} ></i>Booking Ready</BxButton>
                          <BxButton variant="primary" onClick={() => saveRecord('CONFIRMED')} size='sm'>  <i className="bi bi-check-circle" style={{ marginRight: 10 }} ></i>Confirm</BxButton>
                          <BxButton variant="primary" onClick={() => saveRecord('FINALIZED')} size='sm'>  <i className="bi bi-hand-thumbs-up" style={{ marginRight: 10 }} ></i>Finalize</BxButton>
                          {
                            id !== '0' ?
                              <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
                              : <></>
                          }
                        </> :
                        bookingStatus === 'READY' ?
                          <>
                            <BxButton variant="primary" onClick={() => saveRecord('CONFIRMED')} size='sm'>  <i className="bi bi-check-circle" style={{ marginRight: 10 }} ></i>Confirm</BxButton>
                            <BxButton variant="primary" onClick={() => saveRecord('FINALIZED')} size='sm'>  <i className="bi bi-hand-thumbs-up" style={{ marginRight: 10 }} ></i>Finalize</BxButton>
                            <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
                          </> :
                          bookingStatus === 'CONFIRMED' ?
                            <>
                              <BxButton variant="primary" onClick={() => saveRecord('FINALIZED')} size='sm'>  <i className="bi bi-hand-thumbs-up" style={{ marginRight: 10 }} ></i>Finalize</BxButton>
                              <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
                            </> :
                            bookingStatus === 'FINALIZED' ?
                              <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
                              :
                              bookingStatus === 'CANCELLED' ?
                                <>
                                  <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
                                </>
                                :
                                <></>
                    }
                    <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => cancelEntry()} >
                      <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                      Back to List
                    </BxButton>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Box>
          :
          <></>
      }
    </>
  )
}