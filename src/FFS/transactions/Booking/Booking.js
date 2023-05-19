import React, { useEffect, useState } from 'react';
import { Box, Paper, Stack, useMediaQuery, useTheme } from '@mui/material'
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GeneralInformationTab from './GeneralInformationTab';
import LineDetailsTab from './LineDetailsTab';
import BookingSummary from './BookingSummary';
import BxButton from "react-bootstrap/button"
import { useLocation, useParams, useNavigate } from 'react-router-dom';

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
  const hdr = {
    'mId': m
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    getinitialVal();
    getancillaryData();
    // eslint-disable-next-line
  }, []);



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
        setbaseObj(x)
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
        setancillaryData(response.data);
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

  const saveRecord = (uact) => {
    const newbaseObj = manageCheckBoxFlags();
    console.log('newObj', newbaseObj)
    console.log('mId', module)
    setBookingStatus(uact);
    axios({
      method: (id === "0" ? 'post' : 'put'),
      url: 'Booking',
      data: newbaseObj,
      headers: {
        "mId": m,
        "uact": uact
      }
    }).then((response) => {
      // setBookingStatus(uact);
      console.log('draft', response.data)
    }).catch((error) => {
      console.log(error)
      if (error.response) {
      }
    })
  }

  const cancelEntry =  () => {
    navigate(-1);
}


  return (
    <>
      {
        baseObj && ancillaryData ?
          <Box sx={{ fontFamily: 'poppins', fontSize:'8pt' }}>
            <Box>
              <Paper elevation={5} sx={{ p: 3, paddingBottom: 0, height: '90vh' }}>
                <BookingSummary bookingStatus={bookingStatus} initialVal={baseObj} ancillaryData={ancillaryData} />
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
                        <GeneralInformationTab baseObj={baseObj} setbaseObj={setbaseObj} ancillaryData={ancillaryData} />
                      </div>
                      : value === 1 ?
                        <div>
                          <LineDetailsTab ancillaryData={ancillaryData} baseObj={baseObj} setbaseObj={setbaseObj} />
                        </div>
                        :

                        <></>
                  }
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
                          <BxButton variant="primary" onClick={() => saveRecord('CANCELLED')} size='sm'>  <i className="bi bi-card-checklist" style={{ marginRight: 10 }} ></i>Cancel Booking</BxButton>
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