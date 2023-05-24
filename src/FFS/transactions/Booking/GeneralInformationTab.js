import React from 'react'
import { Box, Checkbox, FormControlLabel, Grid, Paper, TextField, MenuItem } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid, Column, Editing, Paging, Lookup } from 'devextreme-react/data-grid';
import SelectBoxDropdown from './SelectBoxDropdown'
import MultivalSelectbox from './MultivalSelectbox';
import  {useRef,useState} from 'react'
import CustomerAddressSBRender from './CustomerAddressSBRender';

export default function GeneralInformationTab({ baseObj,setshippingLine,setpolId, setPol, setFpd, salesPersonList, customerAddressList, setCommodityCategory, setproductId, setcustomerId, setCmmodity, setsiteId, setbaseObj, ancillaryData, setcustomerName }) {

    const onDateValChange = (fieldName) => (value) => {
        setbaseObj({ ...baseObj, [fieldName]: value });
    }

    const onValChange = (e) => {
        if (e.target.type === 'checkbox')
            setbaseObj({ ...baseObj, [e.target.name]: e.target.checked ? true : false });
        else
            setbaseObj({ ...baseObj, [e.target.name]: e.target.value });
    }

    
    const handleNumeric = (e) => {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
        }
    }

    return (
        <>
            <div style={{ height: "65vh", overflow: 'auto' }}>
                <Box sx={{ marginTop: 1, fontSize: '9pt' }}>
                    <Grid container spacing={1}>
                        <Grid item lg={6} xs={12}>
                            <Paper elevation={1} sx={{ p: 1, marginLeft: 1 }}>
                                <Box>
                                    <p style={{ fontWeight: 'bold' }}>General Information</p>
                                    <Grid container spacing={1}>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_products}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.ProductId}
                                                setpropId={setproductId}
                                                data={{ name: "ProductId", label: "Product Type", displayExpr: "ProductName", valueExpr: "ProductId", searchExpr: "ProductName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_bookingTypes}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.BookingTypeId}
                                                data={{ name: "BookingTypeId", label: "Booking Type", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_bookingOffices}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.BookingOfficeId}
                                                data={{ name: "BookingOfficeId", label: "Booking Office", displayExpr: "BookingOfficeName", valueExpr: "BookingOfficeId", searchExpr: "BookingOfficeName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6} alignSelf='end'>
                                            <DatePicker
                                                label="Booking Date"
                                                format="dd/MM/yyyy"
                                                // sx={{fontSize:'9pt'}}
                                                renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                                                value={baseObj.BookingDate}
                                                onChange={onDateValChange('BookingDate')}
                                                name="BookingDate"
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_deliveryModes}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.DeliveryModeId}
                                                data={{ name: "DeliveryModeId", label: "Delivery Mode", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_stuffingTypes}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.StuffingTypeId}
                                                data={{ name: "StuffingTypeId", label: "Stuffing Type", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_stuffingLocations}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.StuffingLocationId}
                                                data={{ name: "StuffingLocationId", label: "Stuffing Location", displayExpr: "StuffingLocationName", valueExpr: "StuffingLocationId", searchExpr: "StuffingLocationName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox checked={baseObj.LineBLRequiredFlag} size="small" />}
                                                    label="Line BL Required"
                                                    sx={{fontSize:'8pt'}}
                                                    value={baseObj.LineBLRequiredFlag}
                                                    onChange={(evt) => onValChange(evt)}
                                                    name='LineBLRequiredFlag'
                                                />
                                            </Grid>
                                    </Grid>
                                </Box>
                                <Box sx={{ marginTop: 2 }}>
                                    <p style={{ fontWeight: 'bold' }}>Cargo Information</p>
                                    <Grid container spacing={1}  >
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_cargoTypes}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.CargoTypeId}
                                                data={{ name: "CargoTypeId", label: "Cargo Type", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_commodityCategories}
                                                baseObj={baseObj}
                                                setpropName={setCommodityCategory}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.CommodityCategoryId}
                                                data={{ name: "CommodityCategoryId", label: "Commodity Category", displayExpr: "CommodityCategoryName", valueExpr: "CommodityCategoryId", searchExpr: "CommodityCategoryName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_commodities}
                                                baseObj={baseObj}
                                                setpropName={setCmmodity}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.CommodityId}
                                                data={{ name: "CommodityId", label: "Commodity", displayExpr: "CommodityName", valueExpr: "CommodityId", searchExpr: "CommodityName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_weightUnits}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.WeightUnitId}
                                                data={{ name: "WeightUnitId", label: "Weight Unit", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6} alignSelf='end'>
                                            <TextField variant='standard' fullWidth label="Gross Weight" size="small"
                                                value={baseObj.GrossWeight}
                                                name='GrossWeight'
                                                onChange={(evt) => onValChange(evt)}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_volumeUnits}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.VolumeUnitId}
                                                data={{ name: "VolumeUnitId", label: "Volume Unit", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6} alignSelf='end'>
                                            <TextField variant='standard' fullWidth label="Volume" size="small"
                                                name="Volume"
                                                value={baseObj.Volume}
                                                onChange={(evt) => onValChange(evt)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box sx={{ marginTop: 2 }}>
                                    <p style={{ fontWeight: 'bold' }}>HAZ Details</p>
                                    <Grid container spacing={1}  >
                                        <Grid item xs={4} alignSelf='end'>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_imoClasses}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.ImoclassId}
                                                data={{ name: "ImoclassId", label: "IMO Class", displayExpr: "ImoclassName", valueExpr: "ImoclassId", searchExpr: "ImoclassName" }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} alignSelf='end'>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_imoUnNumbers}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.ImounnumberId}
                                                data={{ name: "ImounnumberId", label: "IMO UN Number", displayExpr: "ImounnumberName", valueExpr: "ImounnumberId", searchExpr: "ImounnumberName" }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} alignSelf='end'>
                                            <TextField variant='standard' fullWidth size="small"
                                                value={baseObj.PackagingGroup}
                                                label="Packaging Group"
                                                name="PackagingGroup"
                                                onChange={(evt) => onValChange(evt)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item lg={3} xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Paper elevation={1} sx={{ paddingLeft:1, paddingTop:0.5 }}>
                                        <p style={{ fontWeight: 'bold' }}>Parties Involved</p>
                                        <Grid container spacing={0.8} sx={{p:0}} >
                                            <Grid item xs={12} sx={{ fontSize: '12pt' }}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_customers}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.CustomerId}
                                                    initialText={baseObj.CustomerName?baseObj.CustomerName:""}
                                                    initialId={baseObj.CustomerId?baseObj.CustomerId:""}
                                                    dynamic={true}
                                                    setpropName={setcustomerName}
                                                    setpropId={setcustomerId}
                                                    ancobjectName={ancillaryData.anc_customers}
                                                    apiName="party/filterparties"
                                                    listType="customers"
                                                    fieldName="partyname"
                                                    data={{ name: "CustomerId", label: "Customer", displayExpr: "CustomerName", valueExpr: "CustomerId", searchExpr: "CustomerName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sx={{backgroundColor:'#efefef'}}>
                                                <TextField label="Credit Basis" variant="standard"  
                                                    sx={{width:'180px',paddingRight:3}}
                                                    select value={baseObj.CreditBasisId}
                                                    onChange={(evt) => onValChange(evt)} name="CreditBasisId">
                                                </TextField>                        

                                                <TextField sx={{ width:'120px' }}
                                                    variant="standard"
                                                    label="Credit Days"
                                                    onChange={(evt) => onValChange(evt)}
                                                    type="numnber"
                                                    name="CreditNumberOfDays"
                                                    value={baseObj.CreditNumberOfDays}
                                                    autoComplete="off"
                                                    inputProps={{ maxLength: 10 }}
                                                    onKeyPress={(evt) => handleNumeric(evt)}
                                                />                                                
                                            </Grid>
                                            <Grid item xs={12}>
                                                <MultivalSelectbox
                                                    dataSource={customerAddressList}
                                                    baseObj={baseObj}
                                                    setpropId={setsiteId}
                                                    setbaseObj={setbaseObj}
                                                    itemRenderJsx={CustomerAddressSBRender}
                                                    value={baseObj.CustomerSiteId}
                                                    data={{ name: "CustomerSiteId", label: "Customer Location", displayExpr: "CustomerSiteName", valueExpr: "CustomerSiteId", searchExpr: "CustomerSiteName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_shippers}
                                                    baseObj={baseObj}
                                                    dynamic={true}
                                                    initialText={baseObj.ShipperName?baseObj.ShipperName:""}
                                                    initialId={baseObj.ShipperId?baseObj.ShipperId:""}
                                                    apiName="party/filterparties"
                                                    fieldName="partyname"
                                                    listType="shippers"
                                                    ancobjectName={ancillaryData.anc_shippers}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.ShipperId}
                                                    data={{ name: "ShipperId", label: "Shipper", displayExpr: "ShipperName", valueExpr: "ShipperId", searchExpr: "ShipperName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_shippingLines}
                                                    baseObj={baseObj}
                                                    dynamic={true}
                                                    initialText={baseObj.ShippingLineName?baseObj.ShippingLineName:""}
                                                    initialId={baseObj.ShippingLineId?baseObj.ShippingLineId:""}
                                                    apiName="party/filterparties"
                                                    fieldName="partyname"
                                                    listType="shippinglines"
                                                    setpropName={setshippingLine}
                                                    ancobjectName={ancillaryData.anc_shippingLines}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.ShippingLineId}
                                                    data={{ name: "ShippingLineId", label: "Shipping Line", displayExpr: "ShippingLineName", valueExpr: "ShippingLineId", searchExpr: "ShippingLineName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_consignees}
                                                    baseObj={baseObj}
                                                    dynamic={true}
                                                    apiName="party/filterparties"
                                                    initialText={baseObj.ConsigneeName?baseObj.ConsigneeName:""}
                                                    initialId={baseObj.ConsigneeId?baseObj.ConsigneeId:""}
                                                    fieldName="partyname"
                                                    listType="consignees"
                                                    ancobjectName={ancillaryData.anc_consignees}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.ConsigneeId}
                                                    data={{ name: "ConsigneeId", label: "Consignee", displayExpr: "ConsigneeName", valueExpr: "ConsigneeId", searchExpr: "ConsigneeName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={salesPersonList}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}                                                   
                                                    initialText={baseObj.SalesPersonName?baseObj.SalesPersonName:""}
                                                    initialId={baseObj.SalesPersonId?baseObj.SalesPersonId:""}
                                                    value={baseObj.SalesPersonId}
                                                    data={{ name: "SalesPersonId", label: "Sales Person", displayExpr: "SalesPersonName", valueExpr: "SalesPersonId", searchExpr: "SalesPersonName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_osas}
                                                    baseObj={baseObj}
                                                    dynamic={true}
                                                    apiName="party/filterparties"
                                                    fieldName="partyname"
                                                    listType="osas"
                                                    initialText={baseObj.OsaName?baseObj.OsaName:""}
                                                    initialId={baseObj.OsaId?baseObj.OsaId:""}
                                                    ancobjectName={ancillaryData.anc_osas}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.OsaId}
                                                    data={{ name: "OsaId", label: "Overseas Agent", displayExpr: "OsaName", valueExpr: "OsaId", searchExpr: "OsaName" }}
                                                />
                                            </Grid>
                                            
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={3} xs={12}>
                            <Paper elevation={1} sx={{ p: 1, marginRight: 1 }}>
                                <Box>
                                    <span style={{ fontWeight: 'bold' }}>Route Information</span>
                                    <Grid container spacing={1} sx={{p:0}}  >
                                        <Grid item lg={6} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_ports}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.PorId}
                                                data={{ name: "PorId", label: "POR", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={6} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_ports}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                setpropName={setPol}
                                                setpropId={setpolId}
                                                value={baseObj.PolId}
                                                data={{ name: "PolId", label: "POL", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={6} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_ports}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.PodId}
                                                data={{ name: "PodId", label: "POD", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={6} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_ports}
                                                baseObj={baseObj}
                                                setpropName={setFpd}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.FpdId}
                                                data={{ name: "FpdId", label: "FPD", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={6} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_transportModes}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.ModeOfTransportId}
                                                data={{ name: "ModeOfTransportId", label: "MOT", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box sx={{ marginTop: 0.5 }}>
                                    <span style={{ fontWeight: 'bold' }}>Container details</span>
                                    <DataGrid
                                        dataSource={baseObj.BookingInventories}
                                        keyExpr="BookingInventoryId"
                                        showBorders={true}
                                        styling={{fontSize:'8pt'}}
                                        onInitNewRow={(e) => {
                                            e.data.BookingInventoryId = 0;
                                            e.data.BookingId = 0;
                                            e.data.CreatedDate = '01-01-2023 10:10:10 PM';
                                            e.data.ModifiedDate = '01-01-2023 10:10:10 PM';
                                            e.data.MarkedForDelete = "N";
                                        }}
                                    >
                                        <Paging enabled={true} />
                                        <Editing
                                            mode="batch"
                                            allowUpdating={true}
                                            allowAdding={true}
                                            allowDeleting={true}
                                        />
                                        <Column dataField="ContainerSizeTypeId" caption="Size Type" >
                                            <Lookup dataSource={ancillaryData.anc_containerSizeTypes} displayExpr="ContainerSiTy" valueExpr="ContainerSizeTypeId" />
                                        </Column>
                                        <Column dataField="NumberOfUnits" caption="No of Containers" />
                                    </DataGrid>
                                    <Grid item  xs={12} alignSelf='end' sx={{paddingTop:'8px'}}>
                                            <TextField variant='standard'
                                                multiline
                                                fullWidth 
                                                label="Remarks" size="sm"
                                                value={baseObj.Remarks}
                                                name='Remarks'
                                                sx={{backgroundColor:'lightyellow'}}
                                                onChange={(evt) => onValChange(evt)}
                                            />
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box >
            </div>
        </>
    )
}
