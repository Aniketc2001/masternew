import { Grid, Box, Paper, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getFormattedDate } from '../../../shared/scripts/common';
import { DataGrid, Column, Editing, Paging, Lookup } from 'devextreme-react/data-grid';
import '../../../shared/styles/mui-styles.css';

export default function BookingPreviewCx(props) {
  const [baseObj, setbaseObj] = useState(null);
  console.log('baseObj', baseObj);
  useEffect(() => {
    getinitialVal();
  }, [props.baseObj.BookingId]);

  const getinitialVal = () => {
    try {
      axios({
        method: 'get',
        url: `Booking/${props.baseObj.BookingId}`,
        headers: {
          'mId': props.mId
        }
      }).then((response) => {
        const x = response.data;

        for (let field in x) {
          if (x[field] === '' || x[field] === null) {
            x[field] = ' ';
          }
        }
        x.BookingDate = getFormattedDate(new Date(x.BookingDate));
        
        if(x.LineBookingDate !== ' ')
          x.LineBookingDate = getFormattedDate(new Date(x.LineBookingDate));
        
        if(x.LineBookingValidity !== ' ')
          x.LineBookingValidity = getFormattedDate(new Date(x.LineBookingValidity));
        
        if(x.SiCutOffDate !== ' ')  
          x.SiCutOffDate = getFormattedDate(new Date(x.SiCutOffDate));
        setbaseObj(x);
        console.log('baseObj', x);
      }).catch((error) => {
        console.log('error', error);
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


  return (
    <>
      {
        baseObj ?
          <Box sx={{ maxHeight: '65vh', }}>
            <Paper elevation={6} sx={{ padding: 1, margin: 0.2, fontSize: '8.5pt',backgroundColor:'azure' }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{marginBottom:1}}>
                  <p style={{ fontWeight: 'bold', marginBottom: 0, fontSize: '10pt' }}>Booking Preview  </p>
                  <span >Preview of your Booking</span>
                </Grid>
                <Box sx={{maxHeight: '60vh', overflow: 'auto', p:1}}>
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 1, backgroundColor: '#d0f0fb',marginBottom:1 }}>
                    <p style={{ fontWeight: 'bold', fontSize: '9pt', marginBottom: 0 }}>{baseObj.CustomerName}</p>
                    <Box>
                      <span style={{ color: 'gray' }}>Booking No : </span>
                      <span style={{ color: '', }}>{baseObj.BookingReference}</span>
                    </Box>
                    <Box>
                      <span style={{ color: 'gray', }}>Booking Date : </span>
                      <span style={{ color: '', }}>{baseObj.BookingDate}</span>
                    </Box>
                    <Box>
                      <span style={{ color: 'gray', }}>Remarks : </span>
                      <span style={{ color: '', }}>{baseObj.Remarks}</span>
                    </Box>                    
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Parties Involved</p>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <TextField className='mui-custom-textfield' variant='standard' fullWidth label="Customer" value={baseObj.CustomerName} />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField variant='standard' className='mui-custom-textfield' fullWidth label="Credit Basic" value={baseObj.CreditBasisName} />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField variant='standard' className='mui-custom-textfield' fullWidth label="Credit Days" value={baseObj.CreditNumberOfDays} />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Product Type" value={baseObj.ProductName} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Customer Location" value={baseObj.CustomerSiteName} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Sales Person" value={baseObj.SalesPersonName} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Shipping Line" value={baseObj.ShippingLineName} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Shipper" value={baseObj.ShipperName} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Consignee" value={baseObj.ConsigneeName} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Overseas Agent" value={baseObj.OsaName} />
                    </Grid>
                  </Grid>
                  <Box sx={{ marginTop: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>General Information</p>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Booking Type" value={baseObj.BookingTypeName} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Booking Office" value={baseObj.BookingOfficeName} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Booking Date" value={baseObj.BookingDate} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Delivery Mode" value={baseObj.DeliveryModeName} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Stuffing Type" value={baseObj.StuffingTypeName} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Stuffing Location" value={baseObj.StuffingLocationName} />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ marginTop: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Cargo Information</p>
                    <Grid container spacing={1}>
                      <Grid item xs={3}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Cargo Type" value={baseObj.CargoTypeName} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Commodity Category" value={baseObj.CommodityCategoryName} />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Commodity" value={baseObj.CommodityName} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Weight Unit" value={baseObj.WeightUnitName} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Gross Weight" value={baseObj.GrossWeight} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Volume Unit" value={baseObj.VolumeUnitName} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Volume" value={baseObj.Volume} />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ marginTop: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>HAZ Details</p>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="IMO Class" value={baseObj.ImoclassName} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="IMO UN Number" value={baseObj.ImounnumberName} />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ marginTop: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Route Information</p>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="POR" value={baseObj.PorName} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="POL" value={baseObj.PolName} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="POD" value={baseObj.PodName} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="FPD" value={baseObj.FpdName} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="MOT" value={baseObj.ModeOfTransportName} />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ marginTop: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Container Details</p>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                          <DataGrid
                                id="compactGrid"
                                className="custom-datagrid"
                                dataSource={baseObj.BookingInventories}
                                keyExpr="BookingInventoryId"
                                showBorders={true}
                            >
                                <Paging enabled={true} />
                                <Column dataField="ContainerSiTy" caption="Size Type" />
                                <Column dataField="NumberOfUnits" caption="No of Containers" />
                          </DataGrid>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ marginTop: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Booking with Line</p>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Line Booking Number" value={baseObj.LineBookingNumber} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }}  label="Line Booking Date" fullWidth value={baseObj.LineBookingDate} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Line Booking Validity" value={baseObj.LineBookingValidity} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="SI cut-off Date" value={baseObj.SiCutOffDate} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Service Contract Number" value={baseObj.ServiceContractNumber} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Pickup Point" value={baseObj.PickupPointName} />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ marginTop: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Vessel Information</p>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Vessel Voyage" value={baseObj.Vvpc} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Port Terminal" value={baseObj.PortTerminalName} />
                      </Grid>
                      {/* <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Cut-Off Date" value='' />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="ETA" value='' />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="ETD" value='' />
                      </Grid> */}
                      <Grid item xs={12}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="ETA at Destination" value={baseObj.DestinationETA} />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ marginTop: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Transhipment Ports</p>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Port 1" value={baseObj.Pot1Name} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Port 2" value={baseObj.Pot2Name} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField variant='standard' className='mui-custom-textfield' inputProps={{ readOnly: true }} fullWidth label="Port 3" value={baseObj.Pot3Name} />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                </Box>
              </Grid>
            </Paper>
          </Box>
          :
          <></>
      }
    </>
  )
}
