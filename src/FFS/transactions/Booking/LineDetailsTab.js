import React from "react";
import { Grid, TextField, Box, Paper} from  '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SelectBoxDropdown from "./SelectBoxDropdown";
import { SelectBox } from "devextreme-react";


export default function LineDetailsTab({ baseObj, setbaseObj, ancillaryData}) {

  const onDateValChange = (fieldName) => (value) => {
    setbaseObj({ ...baseObj, [fieldName]: value });
  }

  const onValChange = (e) => {
    if (e.target.type === 'checkbox')
      setbaseObj({ ...baseObj, [e.target.name]: e.target.checked ? true : false });
    else
      setbaseObj({ ...baseObj, [e.target.name]: e.target.value });
  }




  return (

    <>
      <div style={{ height: "63vh", overflow: 'auto' }}>
        <Box >
          <Grid container spacing={2}>
            <Grid lg={4} xs={12} item>
              <Paper elevation={1} sx={{ p: 1, marginLeft: 1, marginTop: 1 }}>
                <p style={{ fontWeight: 'bold' }}>Booking with Line</p>
                <Grid container spacing={2}  >
                  <Grid item xs={12} alignSelf='end'>
                    <TextField variant='standard' fullWidth label="Line Booking Number" size="small"
                      value={baseObj.LineBookingNumber}
                      name="LineBookingNumber"
                      onChange={(evt) => onValChange(evt)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label="Line Booking Date"
                      renderInput={(params) => <TextField variant="standard" fullWidth {...params} />}
                      value={baseObj.LineBookingDate}
                      onChange={onDateValChange('LineBookingDate')}
                      name="LineBookingDate"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label="Line Booking Validity"
                      renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                      value={baseObj.LineBookingValidity}
                      onChange={onDateValChange('LineBookingValidity')}
                      name="LineBookingValidity"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label="SI cut-off Date"
                      renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                      value={baseObj.SiCutOffDate}
                      onChange={onDateValChange('SiCutOffDate')}
                      name="SiCutOffDate"
                    />
                  </Grid>
                  <Grid item xs={12} alignSelf='end'>
                    <TextField fullWidth variant='standard' label="Service Contract Number" size="small"
                      value={baseObj.ServiceContractNumber}
                      name="ServiceContractNumber"
                      onChange={(evt) => onValChange(evt)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SelectBoxDropdown
                      dataSource={ancillaryData.anc_pickupPoints}
                      baseObj={baseObj}
                      setbaseObj={setbaseObj}
                      value={baseObj.PickupPointId}
                      data={{ name: "PickupPointId", label: "Pickup Point", displayExpr: "PickupPointName", valueExpr: "PickupPointId", searchExpr: "PickupPointName" }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid lg={4} xs={12} item>
              <Paper elevation={1} sx={{ p: 1, marginTop: 1 }}>
                <p style={{ fontWeight: 'bold' }}>Vessel Information</p>
                <Grid container spacing={2}  >
                  <Grid item xs={12} alignSelf='end'>
                    <SelectBoxDropdown
                      dataSource={ancillaryData.anc_vvpcs}
                      baseObj={baseObj}
                      setbaseObj={setbaseObj}
                      value={baseObj.VesselVoyagePortId}
                      data={{ name: "VesselVoyagePortId", label: "Vessel Voyage", displayExpr: "VesselVoyagePortName", valueExpr: "VesselVoyagePortId", searchExpr: "VesselVoyagePortName" }}
                    />
                  </Grid>
                  <Grid item xs={12} alignSelf='end'>
                    {/* <TextField variant='filled' fullWidth label="Terminal" size="small"
                      // value={baseObj.terminal}
                      value="JPJA"
                      name="terminal"
                      readOnly
                    /> */}
                    <SelectBox dataSource={ancillaryData.anc_portTerminals}
                      fullWidth
                      name="PortTerminalId"
                      displayExpr="PortTerminalName"
                      valueExpr="PortTerminalId"
                      label="Terminal"
                      searchExpr="PortTerminalName"
                      value={baseObj.PortTerminalId}
                      searchEnabled={true}
                      searchMode='contains'
                      searchTimeout={200}
                      minSearchLength={0}
                      showDataBeforeSearch={true}
                      labelMode='floating'
                      showSelectionControls={false}
                      stylingMode='underlined'
                      height='55px'
                      style={{ marginLeft: 0 }}
                      className='select-box-text selectbox-disabled'
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label="Cut-off Date"
                      readOnly
                      renderInput={(params) => <TextField fullWidth variant="filled" {...params} />}
                      // value={baseObj.cutOffDate}
                      value="2023-05-01T18:30:00.000Z"
                      name="cutOffDate"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField variant='filled' fullWidth label="E.T.A" size="small"
                      // value={baseObj.eta}
                      value="2023-05-01T18:30:00.000Z"
                      name="eta"
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField variant='filled' fullWidth label="E.T.D" size="small"
                      // value={baseObj.etd}
                      value="2023-05-01T18:30:00.000Z"
                      name="etd"
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label="E.T.A. at Destination"
                      renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                      value={baseObj.DestinationETA}
                      onChange={onDateValChange('DestinationETA')}
                      name="DestinationETA"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid lg={4} xs={12} item>
              <Paper elevation={1} sx={{ p: 1, marginTop: 1, marginRight: 1 }}>
                <p style={{ fontWeight: 'bold' }}>Transhipment Ports</p>
                <Grid container spacing={2}  >
                  <Grid item sm={4} xs={12}>
                    <SelectBoxDropdown
                      dataSource={ancillaryData.anc_ports}
                      baseObj={baseObj}
                      setbaseObj={setbaseObj}
                      value={baseObj.Pot1id}
                      data={{ name: "Pot1id", label: "Port 1", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <SelectBoxDropdown
                      dataSource={ancillaryData.anc_ports}
                      baseObj={baseObj}
                      setbaseObj={setbaseObj}
                      value={baseObj.Pot2id}
                      data={{ name: "Pot2id", label: "Port 2", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12} alignSelf='center'>
                    <SelectBoxDropdown
                      dataSource={ancillaryData.anc_ports}
                      baseObj={baseObj}
                      setbaseObj={setbaseObj}
                      value={baseObj.Pot3id}
                      data={{ name: "Pot3id", label: "Port 3", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}
