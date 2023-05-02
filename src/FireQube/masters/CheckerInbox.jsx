import React, { useState, useEffect } from 'react';
import { 
  Table, TableHead, TableCell, TableRow, TableBody, styled, Typography, Button
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const THead = styled(TableRow)`
    & > th {
        font-size: 14px;
        background: #ed6c02;
        color: #FFFFFF;
    }
`
const TRow = styled(TableRow)`
    & > td{
        font-size: 14px
    }
`
export default function CheckerInbox() {

  const m = new URLSearchParams(useLocation().search).get('m');
  const [CheckerQueues, setCheckerQueues] = useState([]);
  const hdrs = {
      'mId': m,
      'clr': 'inbox'
  };

  useEffect(() => {
    getCheckerQueues();
    // eslint-disable-next-line
  }, []);

  const getCheckerQueues = () => {
    axios({
      method: 'get',
      url: "checkerQueue",
      headers: hdrs
    }).then((response) => {
      setCheckerQueues(response.data);
    }).catch((error) => {
      if(error.response) {
        console.log("Error occured while fetching data. Error message - " + error.message);
      }
    })
  }
 
  return (
          <>
            <Typography variant="h6" style={{display: 'inline-block', marginRight:10}}>Requests awaiting my approval</Typography>

            <Table size="small" padding="normal">
              <TableHead>
                  <THead>
                      <TableCell>Id</TableCell>
                      <TableCell>Request Description</TableCell>
                      <TableCell>Request Date</TableCell>
                      <TableCell>Request By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                  </THead>
              </TableHead>
              <TableBody>
                  {CheckerQueues.map((chkrQ) => (
                      <TRow key={chkrQ.CheckerQueueId}>
                        <TableCell>{chkrQ.CheckerQueueId}</TableCell>
                        <TableCell>{chkrQ.RequestDescription}</TableCell>
                        <TableCell>{chkrQ.RequestDate}</TableCell>
                        <TableCell>{chkrQ.RequestByName}</TableCell>
                        <TableCell>{chkrQ.DisplayStatus}</TableCell>
                        <TableCell>
                          <Button color="primary" variant="contained" style={{marginRight:10, height: 15}} component={Link} to={`/${chkrQ.DataUrl}&clr=c`}>Check</Button>
                        </TableCell>
                      </TRow>
                  ))}
              </TableBody>
          </Table>
        </>
  )
}
