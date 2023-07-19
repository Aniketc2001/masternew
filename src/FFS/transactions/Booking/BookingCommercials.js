import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { getFormattedDate } from '../../../shared/scripts/common';
import BxButton from "react-bootstrap/button";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DataGrid, Column, Editing, Paging, Lookup } from 'devextreme-react/data-grid';
import BookingPreviewCx from './BookingPreviewCx';
import { confirm, alert } from "devextreme/ui/dialog";

const marginDataSource = [
    {
        MarginSummaryId: 1,
        Currancy: 'USD',
        TotalBuy: 53667,
        TotalSell: 5562,
        SystemMargin: 3622,
        SalesPersonMargin: 88,
        Variance: -73
    },
    {
        MarginSummaryId: 2,
        Currancy: 'INR',
        TotalBuy: 53667,
        TotalSell: 5562,
        SystemMargin: 3622,
        SalesPersonMargin: 88,
        Variance: -73
    },
];

const BuyRateDataSource = [
    {
        BuyRateId: 1,
        Charge: 'FRT',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 2,
        Charge: 'ACD',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 3,
        Charge: 'DOC Fee',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 4,
        Charge: 'Cleaning Charges',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 5,
        Charge: 'FRT',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 6,
        Charge: 'ACD',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 7,
        Charge: 'DOC Fee',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 8,
        Charge: 'Cleaning Charges',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 9,
        Charge: 'FRT',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 10,
        Charge: 'ACD',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 11,
        Charge: 'DOC Fee',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
    {
        BuyRateId: 12,
        Charge: 'Cleaning Charges',
        ChargeType: 'Standard',
        ChargeCategory: 'Expense to Income',
        ServiceProvider: '',
        Currency: '',
        Qty: '',
        ContractType: '',
        BuyRate: '',
        SellRate: '',
        SystemMargin: '',
        BillingRate: '',
        CustomerRebate: '',
    },
];


export default function BookingCommercials(props) {
    const m = new URLSearchParams(useLocation().search).get('m');
    const { id } = useParams();
    const [baseObj, setbaseObj] = useState(null);
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(true);
    const [dataSource, setDataSource] = useState([]);  // for creating dummy datasource for buy rate datagrid
    console.log('m', m);

    const backtoList = () => {
        navigate(-1);
    }

    useEffect(() => {
        getinitialVal();
        props.setOpen(false);
    }, []);

    const headerDet = (uact) => {
        if (uact) {
            return {
                'mId': m,
                'uact': uact
            }
        } else {
            return {
                'mId': m
            }
        }
    }

    const getinitialVal = (uact) => {
        try {
            axios({
                method: 'get',
                url: `Booking/` + id,
                // url: `bookingcommercial/` + id,
                headers: headerDet(uact)
            }).then((response) => {
                const x = response.data;

                for (let field in x) {
                    if (x[field] === '' || x[field] === null) {
                        x[field] = ' ';
                    }
                }
                x.BookingDate = getFormattedDate(new Date(x.BookingDate));

                if (x.LineBookingDate !== ' ')
                    x.LineBookingDate = getFormattedDate(new Date(x.LineBookingDate));

                if (x.LineBookingValidity !== ' ')
                    x.LineBookingValidity = getFormattedDate(new Date(x.LineBookingValidity));

                if (x.SiCutOffDate !== ' ')
                    x.SiCutOffDate = getFormattedDate(new Date(x.SiCutOffDate));
                setbaseObj(x);
                console.log('baseObj', x);
            }).catch((error) => {
                console.log('error', error);
            })
        }
        catch (ex) {

        }
    }


    const getCharges = () => {
        try {
            axios({
                method: 'get',
                url: `bookingcommercial/` + id,
                headers: {
                    'mId': m,
                    'uact': 'GETCHARGES'
                }
            }).then((response) => {
                const x = response.data;
                console.log('getCharges', x);
            }).catch((error) => {
                console.log('error', error);
            })
        }
        catch (ex) {

        }
    }

    const validateCharges = () => {
        axios({
            method: "put",
            url: "bookingcommercial/validatecharges",
            data: baseObj,
            headers: { mId: m },
        })
            .then((response) => {
                const x = response.data;
                console.log('response', x);
                // setbaseObj(x);
                //    navigate(-1);
            })
            .catch((error) => {
                console.log("error", error);
                alert("Error occurring while getting validate charges " + error.response.data, "Error");
            });
    }

    const validateForm = () => {
        return true;
    }

    const saveRecord = () => {
        if (!validateForm()) {
            return;
        }
        const vl = confirm("Confirm updation?", "Confirmation Alert");
        vl.then((dialogResult) => {
            if (dialogResult) {
                axios({
                    method: "put",
                    url: "bookingcommercial",
                    data: baseObj,
                    headers: { mId: m },
                })
                    .then((response) => {
                        console.log('response', response.data);
                        //    navigate(-1);
                    })
                    .catch((error) => {
                        console.log("error", error);
                        alert("Error occurring while saving data " + error.response.data, "Error");
                    });
            }
        });
    };

    return (
        <>
            {
                baseObj ?
                    <Paper elevation={5} sx={{ p: 2, fontFamily: 'poppins' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={showPreview ? 9 : 12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={2.5}>
                                        <h2>Commercials</h2>
                                        <p style={{ fontSize: '9pt' }}>Manage booking commercials</p>
                                    </Grid>
                                    <Grid item xs={showPreview ? 3.5 : 2.5}>
                                        <Box sx={{ height: "10vh" }}>
                                            {/* <h2>Commercials</h2>
                                            <p>Manage booking commercials</p> */}
                                            {/* <h5 style={{marginBottom:1}}>Commercials</h5>
                                            <p style={{marginBottom:1,fontSize:'8pt'}}>Manage booking commercials</p> */}
                                            <Paper elevation={1} sx={{ p: 1, height: '10vh', width: '100%', backgroundColor: '#d0f0fb' }}>
                                                <p style={{ fontWeight: 'bold', fontSize: '10pt', marginBottom: 0 }}>{baseObj.CustomerName}</p>
                                                <Typography variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>Booking No : <span style={{ color: 'black', fontSize: '9pt' }}>{baseObj.BookingReference} </span></Typography>
                                                <Typography varia nt='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>Booking Date : <span style={{ color: 'black', fontSize: '9pt', paddingRight: '30px' }}>{baseObj.BookingDate}</span></Typography>
                                            </Paper>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ height: '10vh' }}>
                                            <p style={{ marginBottom: 3, fontWeight: 'bold', fontSize: '9pt' }}>Margin summary</p>
                                            <DataGrid
                                                dataSource={marginDataSource}
                                                className='ms-datagrid'
                                                keyExpr="MarginSummaryId"
                                                showBorders={true}
                                                showRowLines={true}
                                                showColumnLines={true}
                                                useIcons={true}
                                                rowAlternationEnabled={true}
                                                allowColumnResizing={true}
                                            >
                                                <Paging enabled={true} />
                                                <Editing
                                                    mode="row"
                                                    allowUpdating={true}
                                                />
                                                <Column dataField="Currancy" caption="Currency" alignment='left' />
                                                <Column dataField="TotalBuy" caption="Total Buy" alignment='left' />
                                                <Column dataField="TotalSell" caption="Total Sell" alignment='left' />
                                                <Column dataField="SystemMargin" caption="System Margin" width={100} alignment='left' />
                                                <Column dataField="SalesPersonMargin" caption="Sales Person Margin" width={120} alignment='left' />
                                                <Column dataField="Variance" caption="Variance" alignment='left' />
                                            </DataGrid>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box sx={{ marginTop: 2 }}>
                                    <Stack direction='row' spacing={1}>
                                        {/* <BxButton onClick={() => getinitialVal('GETCHARGES')} size='sm'><i className="bi bi-save" style={{fontSize: '9pt', marginRight: 10 }} ></i>Get Charges</BxButton> */}
                                        <BxButton onClick={getCharges} size='sm'><i className="bi bi-save" style={{ fontSize: '9pt', marginRight: 10 }} ></i>Get Charges</BxButton>
                                        <BxButton onClick={validateCharges} size='sm'><i className="bi bi-check-circle" style={{ fontSize: '9pt', marginRight: 10 }} ></i>Validate</BxButton>
                                        <BxButton onClick={getinitialVal} size='sm'><i className="bi bi-arrow-clockwise" style={{ fontSize: '9pt', marginRight: 10 }} ></i>Reset Charges</BxButton>
                                        <BxButton size='sm' onClick={() => setShowPreview(!showPreview)}><i className="bi bi-aspect-ratio" style={{ fontSize: '9pt', marginRight: 10 }} ></i>{showPreview ? 'Hide Preview' : 'Show Preview'}</BxButton>
                                    </Stack>
                                    <div style={{ height: "65vh", overflow: 'auto', fontSize: '9.5pt' }}>
                                        <Box sx={{ marginTop: 2, paddingRight: 1 }}>
                                            <div>
                                                <p style={{ marginBottom: 5, fontWeight: 'bold' }}>Buy Rate/Pricing Manager</p>
                                            </div>
                                            <DataGrid
                                                dataSource={dataSource}
                                                className='datagrid'
                                                keyExpr="BuyRateId"
                                                showBorders={true}
                                                showRowLines={true}
                                                showColumnLines={true}
                                            >
                                                <Paging enabled={true} />
                                                <Editing
                                                    mode="row"
                                                    allowUpdating={true}
                                                // allowDeleting={true}
                                                // allowAdding={true}
                                                />
                                                <Column dataField="Charge" caption="Charge" width={150} />
                                                <Column dataField="ChargeType" caption="Charge Type" width={100} />
                                                <Column dataField="ChargeCategory" caption="Charge Category" width={150} />
                                                <Column dataField="ServiceProvider" caption="Service Provider" width={150} />
                                                <Column dataField="SiTy" caption="SiTy" width={70} />
                                                <Column dataField="Currency" caption="Currency" width={70} />
                                                <Column dataField="Qty" caption="Quantity" width={70} />
                                                <Column dataField="ContractType" caption="Contract Type" width={100} />
                                                <Column dataField="BuyRate" caption="Buy Rate" width={80} />
                                                <Column dataField="SellRate" caption="Sell Rate" width={80} />
                                                <Column dataField="SystemMargin" caption="System Margin" width={100} />
                                                <Column dataField="BillingRate" caption="Billing Rate" width={70} />
                                                <Column dataField="CustomerRebate" caption="Customer Rebate" width={120} />
                                            </DataGrid>
                                        </Box>
                                        <Box sx={{ marginTop: 1, paddingRight: 1 }}>
                                            <div style={{ position: 'relative', top: '20px', zIndex: 1 }}>
                                                <p style={{ marginBottom: 0, fontWeight: 'bold' }}>Add Charges</p>
                                            </div>
                                            <DataGrid
                                                dataSource={[]}
                                                className='datagrid'
                                                keyExpr="BuyRateId"
                                                showBorders={true}
                                                showRowLines={true}
                                                showColumnLines={true}
                                            >
                                                <Paging enabled={true} />
                                                <Editing
                                                    mode="batch"
                                                    allowUpdating={true}
                                                    allowDeleting={true}
                                                    allowAdding={true}
                                                    newRowPosition='last'
                                                />
                                                <Column dataField="Charge" caption="Charge" width={150} />
                                                <Column dataField="ChargeType" caption="Charge Type" width={100} />
                                                <Column dataField="ChargeCategory" caption="Charge Category" width={150} />
                                                <Column dataField="RateParty" caption="Rate Party" width={150} />
                                                <Column dataField="SiTy" caption="SiTy" width={70} />
                                                <Column dataField="Currency" caption="Currency" width={70} />
                                                <Column dataField="Qty" caption="Quantity" width={70} />
                                                <Column dataField="ContractType" caption="Contract Type" width={100} />
                                                <Column dataField="BuyRate" caption="Buy Rate" width={80} />
                                                <Column dataField="SellRate" caption="Sell Rate" width={80} />
                                                <Column dataField="BillingRate" caption="Billing Rate" />
                                                <Column dataField="CustomerRebate" caption="Customer Rebate" />
                                            </DataGrid>
                                        </Box>
                                    </div>
                                </Box>
                            </Grid>
                            {
                                showPreview ?
                                    <Grid item xs={3}>
                                        <BookingPreviewCx mId={m} setProp={setShowPreview} closeIcon={true} outerHeight="75vh" height="72vh" baseObj={baseObj} />
                                    </Grid>
                                    :
                                    <></>
                            }
                        </Grid>
                        <Box marginTop={1}>
                            <Stack direction='row' spacing={1}>
                                <BxButton onClick={saveRecord} variant="primary" size='sm'>  <i className="bi bi-save" style={{ marginRight: 10 }} ></i>Save</BxButton>
                                <BxButton size="sm" style={{ textTransform: "none" }} onClick={() => backtoList()} >
                                    <i className={'bi-card-checklist'} style={{ color: 'white', fontSize: '9pt', marginRight: '10px' }} />
                                    Back to List
                                </BxButton>
                            </Stack>
                        </Box>
                    </Paper>
                    :
                    <></>
            }
        </>
    )
}
