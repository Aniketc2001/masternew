import { Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react'

export default function BookingSummary({ initialVal, ancillaryData , bookingStatus }) {


    const bookingData = [
        {
            label: 'Loading Port',
            value: 'port 1'
        },
        {
            label: 'Commodity Category',
            value: initialVal.CommodityCategoryId ? ancillaryData.anc_commodityCategories.filter(data => data.CommodityCategoryId === initialVal.CommodityCategoryId)[0].CommodityCategoryName : null
        },
        {
            label: 'Commodity',
            value : initialVal.CommodityId ?  ancillaryData.anc_commodities.filter(data=>data.CommodityId === initialVal.CommodityId)[0].CommodityName : null

        },
    ];

    const bookingInfo = [
        {
            label: 'Vessel Voyage',
            value: initialVal.VesselVoyagePortId ? ancillaryData.anc_vvpcs.filter(data=> data.VesselVoyagePortId === initialVal.VesselVoyagePortId)[0].VesselVoyagePortName : null
        },
        {
            label: 'Line',
            value: '14'
        },
        {
            label: 'FPD',
            value: initialVal.FpdId ? ancillaryData.anc_ports.filter(data=>data.PortId === initialVal.FpdId)[0].PortName : null
        },

    ]

    const bookingDet = [
        {
            label: 'Inventory',
            value: '14242'
        },
        {
            label: 'Status',
            value: bookingStatus === 'Draft' ? null : bookingStatus
        },
        {
            label: 'Remarks',
            value: initialVal.Remarks
        },
    ]

    return (
        <>
            <Grid container spacing={2}>
                <Grid lg={2} item>
                    <h2>Booking</h2>
                    <p>Manage booking details</p>
                </Grid>
                <Grid item lg={10} sx={{ width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Paper elevation={1} sx={{ p: 1, height: "10vh", backgroundColor: '#d0f0fb' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '13pt', marginBottom: 0 }}>Aniket Chate</p>
                                <Typography variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>Booking No : <span style={{ color: 'black', fontSize: '10pt' }}>{initialVal.BookingReference}</span></Typography>
                                <Typography variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>Booking Date : <span style={{ color: 'black', fontSize: '10pt' }}>{initialVal.BookingDate ? new Date(initialVal.BookingDate).toLocaleDateString() : ''}</span></Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
                            <Paper elevation={1} sx={{ p: 1, height: "10vh", backgroundColor: '#d0f0fb' }}>
                                <Grid container>
                                    <Grid item xs={5}>
                                        <Stack >
                                            {bookingData.map((data) => {
                                                return <Typography key={data.label} variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>{data.label}: <span style={{ color: 'black', fontSize: '10pt' }}>{data.value}</span></Typography>
                                            })}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Stack width='100%'>
                                            {bookingInfo.map((data) => {
                                                return <Typography key={data.label} variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>{data.label}: <span style={{ color: 'black', fontSize: '10pt' }}>{data.value}</span></Typography>
                                            })}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Stack width='100%'>
                                            {bookingDet.map((data) => {
                                                return <Typography key={data.label} variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>{data.label}: <span style={{ color: 'black', fontSize: '10pt' }}>{data.value}</span></Typography>

                                            })}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
