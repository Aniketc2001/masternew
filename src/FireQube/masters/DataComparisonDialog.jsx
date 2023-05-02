import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import BxButton  from 'react-bootstrap/Button';
import {Alert, Paper, Grid} from '@mui/material';

export default function DataComparisonDialog(props){
    const [beforeData, setbeforeData] = React.useState(props.beforeData);     
    const [afterData, setafterData] = React.useState(props.afterData);     
    const [dataChanges, setdataChanges] = React.useState(props.dataChanges);     
    
    const renderTable = () => {
        if(!beforeData || !dataChanges)
            return;

        console.log('rendering...');
        console.log(beforeData);
        const fg = true;
    
        return (
            <table cellPadding={'5px'} cellSpacing={'2px'} width={'100%'}>
              <tr className='tableHead'>
                <td width={'10%'}></td>
                <td width={'40%'}></td>
                <td width={'25%'}><b>Before</b></td>
                <td width={'25%'}><b>After</b></td>
              </tr>
              {Object.keys(beforeData).map((key, index) => (
                <tr className={(index % 2 === 0 ? "cell1" : "cell2") + (dataChanges.includes(key)?" changed":" ")}>
                    <td >{dataChanges.includes(key)?<i className={'bi-flag-fill'} style={{color:'red', fontSize: '10pt', marginRight: '5px', cursor:'pointer'}} title='Changed field' />:<></>}</td>
                    <td >{key}</td>
                    <td >{beforeData[key]}</td>
                    <td >{afterData[key]}</td>
                </tr>
              ))}        
            </table>
      );
    }

    return(
        <Dialog onClose={props.hidePopover} open={props.openPopover} fullWidth={true} maxWidth={'md'}  sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}  >
                <div sx={{zindex:9999}}>
                <Paper elevation={3} sx={{p:1,  backgroundColor:'white', fontFamily:'Poppins', minWidth:'auto'}}>
                    <DialogTitle>
                    <Alert variant="standard" severity="info" >
                        <h4><b>Review Data Comparison</b></h4>
                    </Alert>
                    </DialogTitle>
                    <DialogContent >
                      <div style={{overflow:'none', height:'45vh'}}>
                    {beforeData && dataChanges?renderTable():<></>}
                    </div>
                    </DialogContent>
                    <DialogActions>
                    <Grid container spacing={1} >
                      <Grid item xs={10}></Grid>
                      <Grid item xs={2} sx={{alignItems:'flex-end'}} >
                        <BxButton type='contained'  onClick={() => props.hidePopover()}  >
                        <i className={'bi-calendar2-x'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
                          Close
                        </BxButton>
                      </Grid>
                    </Grid>
                    </DialogActions>
                </Paper>
                </div>
            </Dialog> 
    );
}