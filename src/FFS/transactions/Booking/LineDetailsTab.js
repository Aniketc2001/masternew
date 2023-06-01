import React, { useEffect, useState } from "react";
import { Grid, TextField, Box, Paper } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SelectBoxDropdown from "./SelectBoxDropdown";
import { SelectBox } from "devextreme-react";
import MultivalSelectbox from "./MultivalSelectbox";
import VvpcsSBRender from "./VvpcsSBRender";
import { getFormattedDate } from "../../../shared/scripts/common";


export default function LineDetailsTab({ setvesselVoyage, vesselVoyageList, baseObj, setbaseObj, ancillaryData, parentvvpcId, lineServiceContractList }) {
  const [vvpcId, setvvpcId] = useState(baseObj.VesselVoyagePortId);
  const [vvpcDetails, setVvpcDetails] = useState();
  const [PortTerminalName, setPortTerminalName] = useState('');
  const [Eta, setEta] = useState('');
  const [Etd, setEtd] = useState('');
  const [CutOffDate, setCutOffDate] = useState('');
  const [EtdatDest, setEtdatDest] = useState(baseObj.DestinationETA);


  useEffect(() => {
    const selectedVvpc = vesselVoyageList.filter((data) => data.VesselVoyagePortId === vvpcId);
    if(selectedVvpc){
      //console.log(selectedVvpc);
      setVvpcDetails(selectedVvpc[0]);
      console.log('vvpc',vvpcDetails);

      try{
        setPortTerminalName(selectedVvpc[0].PortTerminalName);
        selectedVvpc[0].Eta = getFormattedDate(new Date(selectedVvpc[0].Eta));
        selectedVvpc[0].Etd = getFormattedDate(new Date(selectedVvpc[0].Etd));
        selectedVvpc[0].CutOffDate = getFormattedDate(new Date(selectedVvpc[0].CutOffDate));
        selectedVvpc[0].EtaDestination = getFormattedDate(new Date(selectedVvpc[0].EtaDestination));

        setEta(selectedVvpc[0].Eta);
        setEtd(selectedVvpc[0].Etd);
        setCutOffDate(selectedVvpc[0].CutOffDate);
        setEtdatDest(selectedVvpc[0].EtaDestination);
        setbaseObj({...baseObj, DestinationETA: selectedVvpc[0].EtaDestination, PortTerminalId: selectedVvpc[0].PortTerminalId  });

        console.log(PortTerminalName);
      }
      catch(ex){
        console.log('vvpcid useeffect',ex);
      }
    }
  }, [vvpcId])

  //console.log('parent vvpc id',parentvvpcId);


  useEffect(()=>{

  },[PortTerminalName])

  const onDateValChange = (fieldName) => (value) => {
    setbaseObj({ ...baseObj, [fieldName]: value });
  }

  const onValChange = (e) => {
    if (e.target.type === 'checkbox')
      setbaseObj({ ...baseObj, [e.target.name]: e.target.checked ? true : false });
    else
      setbaseObj({ ...baseObj, [e.target.name]: e.target.value });
  }

  const handleValueChange = (e) => {
    let valueExpr = e.component.option("name");
    setbaseObj({ ...baseObj, [valueExpr]: e.value });
  };





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
                    <SelectBoxDropdown
                        dataSource={lineServiceContractList}
                        initialText={baseObj.ServiceContractNumber?baseObj.ServiceContractNumber:""}
                        initialId={baseObj.LineServiceContractId?baseObj.LineServiceContractId:""}
                        baseObj={baseObj}
                        setbaseObj={setbaseObj}
                        value={baseObj.LineServiceContractId}
                        data={{ name: "LineServiceContractId", label: "Service Contract Number", displayExpr: "ServiceContractNumber", valueExpr: "LineServiceContractId", searchExpr: "ServiceContractNumber" }}
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
                    <MultivalSelectbox
                      dataSource={vesselVoyageList}
                      itemRenderJsx={VvpcsSBRender}
                      baseObj={baseObj}
                      setbaseObj={setbaseObj}
                      setpropId={setvvpcId}
                      setpropName={setvesselVoyage}
                      value={baseObj.VesselVoyagePortId}
                      data={{ name: "VesselVoyagePortId", label: "Vessel Voyage", displayExpr: "VesselVoyagePortName", valueExpr: "VesselVoyagePortId", searchExpr: "VesselVoyagePortName" }}
                    />

                  </Grid>
                  <Grid item xs={12} alignSelf='end'>
                    <TextField variant='filled' fullWidth label="Terminal" size="small"
                      value={PortTerminalName}
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField variant='filled' fullWidth
                      label="Cut-off Date" size="small"
                      value={CutOffDate}
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField variant='filled' fullWidth label="E.T.A" size="small"
                      value={Eta}
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField variant='filled' fullWidth label="E.T.D" size="small"
                      value={Etd}
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label="ETA at Destination"
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
