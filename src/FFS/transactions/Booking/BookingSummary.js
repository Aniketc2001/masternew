import { Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react'

export default function BookingSummary({ initialVal,vesselVoyage,pol, fpd,commodityCategory, customerDetails, shippingLine ,bookingStatus , customerName , commodity}) {

    const bookingData = [
        {
            label: 'Loading Port',
            value: pol
        },
        {
            label: 'Commodity Category',
            value: commodityCategory
        },
        {
            label: 'Commodity',
            value : commodity

        },
    ];

    const bookingInfo = [
        {
            label: 'Vessel Voyage',
            value: vesselVoyage
        },
        {
            label: 'Line',
            value: shippingLine
        },
        {
            label: 'FPD',
            value: fpd
        },

    ]

    const bookingDet = [
        {
            label: 'Status',
            value:  bookingStatus 
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
                        <Grid item xs={5}>
                            <Paper elevation={1} sx={{ p: 1, height: "10vh", backgroundColor: '#d0f0fb' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '13pt', marginBottom: 0}}>{customerName}</p>
                                <Typography variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>Booking No : <span style={{ color: 'black', fontSize: '9pt' }}>{initialVal.BookingReference} </span></Typography>
                                <Typography variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>Booking Date : <span style={{ color: 'black', fontSize: '9pt',paddingRight:'30px' }}>{initialVal.BookingDate ? new Date(initialVal.BookingDate).toLocaleDateString() : ''}</span>
                                {customerDetails?
                                (customerDetails.KycCompletedFlag==='N'?
                                <span className='blink' style={{ color: 'black', fontSize: '8pt', borderRadius:'5px',backgroundColor:'red',paddingLeft:'8px',paddingRight:'8px', color:'white'}}><> <i className="bi-exclamation-triangle-fill" style={{ marginRight: 10, color:'yellow' }} ></i>Customer KYC Pending</></span>:<></>):<></>}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={7}>
                            <Paper elevation={1} sx={{ p: 1, height: "10vh", backgroundColor: '#d0f0fb' }}>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <Stack >
                                            {bookingData.map((data) => {
                                                return <Typography key={data.label} variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>{data.label}: <span style={{ color: 'black', fontSize: '8pt' }}>{data.value}</span></Typography>
                                            })}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Stack width='100%'>
                                            {bookingInfo.map((data) => {
                                                return <Typography key={data.label} variant='p' style={{ fontSize: '8pt', color: 'gray' }} component='p'>{data.label}: <span style={{ color: 'black', fontSize: '8pt' }}>{data.value}</span></Typography>
                                            })}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Stack width='100%'>
                                             <Typography variant='caption' style={{ fontSize: '8pt', color: 'gray' }} component='p'>Status: <span style={{ color: 'black', fontSize: '8pt', borderRadius:'15px',backgroundColor:'purple',paddingLeft:'8px',paddingRight:'8px', color:'white' }}>{bookingStatus}</span></Typography>
                                             <Typography variant='caption' style={{ fontSize: '8pt', color: 'gray' }} component='p'>Remarks: <span style={{ color: 'black', fontSize: '8pt' }}>{initialVal.Remarks?initialVal.Remarks.substr(0,200):''}</span></Typography>
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
