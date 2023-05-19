import React from 'react'
import { Box, Checkbox, FormControlLabel, Grid, Paper, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid, Column, Editing, Paging , Lookup } from 'devextreme-react/data-grid';
import SelectBoxDropdown from './SelectBoxDropdown'


export default function GeneralInformationTab({ baseObj, setbaseObj, ancillaryData }) {

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
                <Box sx={{ marginTop: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item lg={5} xs={12}>
                            <Paper elevation={1} sx={{ p: 1, marginLeft: 1 }}>
                                <Box>
                                    <p style={{ fontWeight: 'bold' }}>General Information</p>
                                    <Grid container spacing={1}>
                                        <Grid item lg={3} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_products}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.ProductId}
                                                data={{ name: "ProductId", label: "Product Type", displayExpr: "ProductName", valueExpr: "ProductId", searchExpr: "ProductName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_bookingTypes}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.BookingTypeId}
                                                data={{ name: "BookingTypeId", label: "Booking Type", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_bookingOffices}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.BookingOfficeId}
                                                data={{ name: "BookingOfficeId", label: "Booking Office", displayExpr: "BookingOfficeName", valueExpr: "BookingOfficeId", searchExpr: "BookingOfficeName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6} alignSelf='end'>
                                            <DatePicker
                                                label="Booking Date"
                                                renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                                                value={baseObj.BookingDate}
                                                onChange={onDateValChange('BookingDate')}
                                                name="BookingDate"
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_deliveryModes}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.DeliveryModeId}
                                                data={{ name: "DeliveryModeId", label: "Delivery Mode", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_stuffingTypes}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.StuffingTypeId}
                                                data={{ name: "StuffingTypeId", label: "Stuffing Type", displayExpr: "LookupItemName", valueExpr: "LookupItemId", searchExpr: "LookupItemName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_stuffingLocations}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.StuffingLocationId}
                                                data={{ name: "StuffingLocationId", label: "Stuffing Location", displayExpr: "StuffingLocationName", valueExpr: "StuffingLocationId", searchExpr: "StuffingLocationName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={3} sm={4} xs={6} alignSelf='end'>
                                            <TextField variant='standard' fullWidth label="Remarks" size="small"
                                                value={baseObj.Remarks}
                                                name='Remarks'
                                                onChange={(evt) => onValChange(evt)}
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
                                                setbaseObj={setbaseObj}
                                                value={baseObj.CommodityCategoryId}
                                                data={{ name: "CommodityCategoryId", label: "Commodity Category", displayExpr: "CommodityCategoryName", valueExpr: "CommodityCategoryId", searchExpr: "CommodityCategoryName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_commodities}
                                                baseObj={baseObj}
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
                                    <Paper elevation={1} sx={{ p: 1 }}>
                                        <p style={{ fontWeight: 'bold' }}>Parties Involved</p>
                                        <Grid container spacing={0.8}  >
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_customers}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.CustomerId}
                                                    data={{ name: "CustomerId", label: "Customer", displayExpr: "CustomerName", valueExpr: "CustomerId", searchExpr: "CustomerName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_customerSites}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.CustomerSiteId}
                                                    data={{ name: "CustomerSiteId", label: "Customer Location", displayExpr: "CustomerSiteName", valueExpr: "CustomerSiteId", searchExpr: "CustomerSiteName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_shippers}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.ShipperId}
                                                    data={{ name: "ShipperId", label: "Shipper", displayExpr: "ShipperName", valueExpr: "ShipperId", searchExpr: "ShipperName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_shippingLines}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.ShippingLineId}
                                                    data={{ name: "ShippingLineId", label: "Shipping Line", displayExpr: "ShippingLineName", valueExpr: "ShippingLineId", searchExpr: "ShippingLineName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_consignees}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.ConsigneeId}
                                                    data={{ name: "ConsigneeId", label: "Consignee", displayExpr: "ConsigneeName", valueExpr: "ConsigneeId", searchExpr: "ConsigneeName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_chas}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.ChaId}
                                                    data={{ name: "ChaId", label: "CHA", displayExpr: "ChaName", valueExpr: "ChaId", searchExpr: "ChaName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_salesPeople}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.SalesPersonId}
                                                    data={{ name: "SalesPersonId", label: "Sales Person", displayExpr: "SalesPersonName", valueExpr: "SalessPersonId", searchExpr: "SalesPersonName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SelectBoxDropdown
                                                    dataSource={ancillaryData.anc_osas}
                                                    baseObj={baseObj}
                                                    setbaseObj={setbaseObj}
                                                    value={baseObj.OsaId}
                                                    data={{ name: "OsaId", label: "Overseas Agent", displayExpr: "OsaName", valueExpr: "OsaId", searchExpr: "OsaName" }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={<Checkbox checked={baseObj.LineBLRequiredFlag} size="small" />}
                                                    label="Line BL Required"
                                                    value={baseObj.LineBLRequiredFlag}
                                                    onChange={(evt) => onValChange(evt)}
                                                    name='LineBLRequiredFlag'
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <Paper elevation={1} sx={{ p: 1, marginRight: 1 }}>
                                <Box>
                                    <p style={{ fontWeight: 'bold' }}>Route Information</p>
                                    <Grid container spacing={1}  >
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_ports}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.PorId}
                                                data={{ name: "PorId", label: "POR", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_ports}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.PolId}
                                                data={{ name: "PolId", label: "POL", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_ports}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.PodId}
                                                data={{ name: "PodId", label: "POD", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
                                            <SelectBoxDropdown
                                                dataSource={ancillaryData.anc_ports}
                                                baseObj={baseObj}
                                                setbaseObj={setbaseObj}
                                                value={baseObj.FpdId}
                                                data={{ name: "FpdId", label: "FPD", displayExpr: "PortName", valueExpr: "PortId", searchExpr: "PortName" }}
                                            />
                                        </Grid>
                                        <Grid item lg={4} sm={4} xs={6}>
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
                                <Box sx={{ marginTop: 2 }}>
                                    <p style={{ fontWeight: 'bold' }}>Container details</p>
                                    <DataGrid
                                        dataSource={baseObj.BookingInventories}
                                        keyExpr="BookingInventoryId"
                                        showBorders={true}
                                        onInitNewRow={(e)=>{
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
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box >
            </div>
        </>
    )
}
