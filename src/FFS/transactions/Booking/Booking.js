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

export default function Booking(props) {
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
  const [BookingId,setBookingId] = useState(id);
  const [reloadFlag,setreloadFlag] = useState(false);
  const [polId,setpolId] = useState(null);

  const hdr = {
    'mId': m
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //reload inventories during draft save
  useEffect(() => {
    if(baseObj)
      reloadInventory(BookingId);
  }, [reloadFlag]);

  useEffect(() => {
    if(baseObj)
      getSalesPerson();
  }, [siteId,productId]);

  useEffect(() => {
    if(baseObj)
      getVesselVoyage();
  }, [polId]);

  useEffect(() => {
    if(baseObj)
      getCustomerAddress();
  }, [customerId]);

  useEffect(() => {
    console.log('setsidebar...',props);
    props.setOpen(false);
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
        setvesselVoyageList(null);
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
        //console.log("party sales",x);
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


  const reloadInventory = (bId) => {
    try {
      axios({
        method: 'get',
        url: `Booking/${bId}`,
        headers: hdr
      }).then((response) => {
        let x = response.data;
        setbaseObj({...baseObj, BookingInventories: x.BookingInventories});
      }).catch((error) => {
        console.log("reloadInventory err:",error);
      })
    }
    catch (ex) {

    }

  }

  const getinitialVal = () => {
    try {
      axios({
        method: 'get',
        url: `Booking/${BookingId}`,
        headers: hdr
      }).then((response) => {
        let x = response.data;
        x.LineBLRequiredFlag = x.LineBLRequiredFlag === 'Y' ? true : false;
        console.log('b1');
        if (BookingId === '0') {
          x.CreatedDate = '01-01-2023 10:10:10 PM';
          x.ModifiedDate = '01-01-2023 10:10:10 PM';
          x.BookingDate = new Date();
          x.BookingInventories = [];
        }
        console.log('b2');
        console.log('baseObj', x);
        setbaseObj(x);
        
        setproductId(x.ProductId);

        //Customer Site
        setcustomerId(x.CustomerId);

        //Sales Person
        setsiteId(x.CustomerSiteId);

        console.log('b3');

        //Vessel Voyage
        setpolId(x.PolId);
        setparentvvpcId(x.VesselVoyagePortId);

        console.log('b4');

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


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
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

  const saveRecord = (uact) => {
    if(!validate(uact)){
      return(false);
    }
    const newbaseObj = manageCheckBoxFlags();
    console.log('newObj', newbaseObj);
    console.log('mId', module);
    console.log('uact',uact);
    
    //setBookingStatus(uact);
    const vl = confirm('Confirm updation?', 'Confirmation Alert');
    vl.then((dialogResult) => {
      if (dialogResult) {
        axios({
          method: (BookingId === "0" ? 'post' : 'put'),
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
          var tId = x.BookingId;
          console.log(x);

          if(tId){
            setBookingId(tId);
            setbaseObj({...baseObj, BookingId: tId,BookingReference: x.BookingReference});
          }

          if(uact === "DRAFT"){
            setreloadFlag(true);
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


  const validate =(uact) =>{
    var fields = [];
    if(uact==="DRAFT"){
      fields = ["ProductId","BookingOfficeId","BookingReference","BookingDate",
      "ShippingLineId","CustomerId","ShipperId","ConsigneeId","PorId","PolId","PodId",
      "FpdId","CargoTypeId"];
    }
    else if(uact==="READY"){
      fields = ["ProductId","BookingOfficeId","BookingReference","BookingDate",
      "StuffingTypeId","ShippingLineId","CustomerId","CustomerSiteId","SalesPersonId",
      "ShipperId","ConsigneeId","OsaId","PorId","PolId","PodId","FpdId","ModeOfTransportId",
      "CargoTypeId","CommodityCategoryId","CommodityId"];
    }
    else if(uact==="CONFIRMED"){
      fields = ["ProductId","BookingOfficeId","BookingReference","BookingDate",
      "DeliveryModeId","StuffingTypeId","StuffingLocationId","ShippingLineId","CustomerId",
      "CustomerSiteId","SalesPersonId","ShipperId","ConsigneeId","OsaId","PorId","PolId",
      "PodId","FpdId","ModeOfTransportId","CargoTypeId","CommodityCategoryId","CommodityId",
      "WeightUnitId","GrossWeight","VolumeUnitId","Volume","PackagingGroup","LineBookingNumber",
      "LineBookingDate","LineBookingValidity","SiCutOffDate","PickupPointId","VesselVoyagePortId",
      "PortTerminalId","DestinationETA"];
    }
    else if(uact==="FINALIZED"){
      fields = ["ProductId","BookingOfficeId","BookingReference","BookingDate","DeliveryModeId",
      "StuffingTypeId","StuffingLocationId","BookingTypeId","ShippingLineId","CustomerId",
      "CustomerSiteId","SalesPersonId","ShipperId","ConsigneeId","OsaId","PorId","PolId",
      "PodId","FpdId","ModeOfTransportId","CargoTypeId","CommodityCategoryId","CommodityId",
      "WeightUnitId","GrossWeight","VolumeUnitId","Volume","PackagingGroup","LineBookingNumber",
      "LineBookingDate","LineBookingValidity","SiCutOffDate","PickupPointId","VesselVoyagePortId",
      "PortTerminalId","DestinationETA"];
    }
    
    return validateData(fields);
  }

  const validateData = (fields) => {
    const result = [];
    var s = "";
    fields.forEach((item) => {
      if (baseObj[item] === null) {
        var tmpItem = item.replace("Id","");
        const message = `Invalid or blank data in ${tmpItem}<br/>`;
        s = s + message;
        result.push(message);
      }
    });

    if(result.length > 0){
      alert("Following fields have invalid data in them:<br/><br/>" + s, "Booking Validation Check");
      return false;
    }
    
    return true;
  }

  const cancelEntry = () => {
    //props.setOpen(true);
    navigate(-1);
  }

  return (
    <>
      {
        baseObj && ancillaryData ?
          <Box sx={{ fontFamily: 'poppins',p:0 }}>
            <Box sx={{p:0,m:0}}>
              <Paper elevation={5} sx={{ p: 2, paddingBottom: 0, height: '90.5vh' }}>
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
                          <BxButton variant="primary" onClick={() => saveRecord('READY')} size='sm'>  <i className="bi bi-save" style={{ marginRight: 10 }} ></i>Save</BxButton>
                          <BxButton variant="primary"  size='sm'>  <i className="bi-arrow-right-square" style={{ marginRight: 10 }} ></i>Save as New</BxButton>
                          {
                            BookingId !== '0' ?
                              <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
                              : <></>
                          }
                        </> :
                        bookingStatus.toUpperCase() === 'READY' ?
                          <>
                            <BxButton variant="primary" onClick={() => saveRecord('READY')} size='sm'>  <i className="bi bi-save" style={{ marginRight: 10 }} ></i>Save</BxButton>
                            <BxButton variant="primary"  size='sm' >  <i className="bi-arrow-right-square" style={{ marginRight: 10 }} ></i>Save as New</BxButton>
                            <BxButton variant="primary" onClick={() => saveRecord('CONFIRMED')} size='sm'>  <i className="bi bi-check-circle" style={{ marginRight: 10 }} ></i>Confirm</BxButton>
                            <BxButton variant="primary" onClick={() => saveRecord('FINALIZED')} size='sm'>  <i className="bi bi-hand-thumbs-up" style={{ marginRight: 10 }} ></i>Finalize</BxButton>
                            <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
                          </> :
                          bookingStatus.toUpperCase() === 'CONFIRMED' ?
                            <>
                              <BxButton variant="primary"  size='sm'>  <i className="bi bi-save" style={{ marginRight: 10 }} ></i>Save as New</BxButton>
                              <BxButton variant="primary" onClick={() => saveRecord('FINALIZED')} size='sm'>  <i className="bi bi-hand-thumbs-up" style={{ marginRight: 10 }} ></i>Finalize</BxButton>
                              <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
                            </> :
                            bookingStatus.toUpperCase() === 'FINALIZED' ?
                              <>
                              <BxButton variant="primary"  size='sm'>  <i className="bi-arrow-right-square" style={{ marginRight: 10 }} ></i>Save as New</BxButton>
                              <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
                              </>
                              :
                              bookingStatus.toUpperCase() === 'CANCELLED' ?
                                <>
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