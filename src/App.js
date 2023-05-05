import './shared/styles/App.css';
import 'devextreme/dist/css/dx.light.css';
import * as React from 'react';
import Navbar from './FireQube/widgets/Navbar';
import UserDashboard from './FireQube/dashboards/UserDashboard';
import DepartmentList from './FireQube/masters/DepartmentList';
import EmployeeList from './FireQube/masters/EmployeeListDx';
import AccessLevelList from './FireQube/masters/AccessLevelList';
import MasterListPageCx from './FireQube/masters/MasterListPageCx';
import AccessLevelEdit from './FireQube/masters/AccessLevelEdit';
import AccessLevelManage from './FireQube/masters/AccessLevelManage';
import MasterEditCx from './FireQube/masters/MasterEditCx';
import CheckerInboxCx from './FireQube/masters/CheckerInboxCx';
import CheckerOutboxCx from './FireQube/masters/CheckerOutboxCx';
import MenuEdit from './FireQube/masters/MenuEdit';
import MasterEditPageMultiLevel from './FireQube/masters/MasterEditPageMultiLevel';

import SystemUserList from './FireQube/masters/SystemUserList'
import DepartmentEdit from './FireQube/masters/DepartmentEdit';
import PartyMaster from './FFS/masters/PartyMaster/PartyMaster';
import EmployeeEdit from './FireQube/masters/EmployeeEdit';
import SystemUserEdit from './FireQube/masters/SystemUserEdit'
import Login from './FireQube/auth/Login';
import Box from '@mui/material/Box';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import TopBarNav from './FireQube/widgets/TopbarNav';
import SideBarNav from './FireQube/widgets/sideBarNav';
import { Container } from 'react-bootstrap';
import { styled  } from '@mui/material/styles';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


function App() {
  const [token, setToken] = useState(null);
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const theme = createTheme({
    typography: {
      fontSize: 12.5,
      fontFamily: [
        "Poppins",
        'Roboto',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });


  if(!token) {
    return <Login setToken={setToken} />
  }



  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", p:0, m:0, minHeight:'100vh' }} className="AppBackgroundCanvas" >
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
    <BrowserRouter>
        <TopBarNav
            open={open}
            setToken={setToken}
            setOpen={setOpen}
            handleDrawerOpen={handleDrawerOpen}
            theme={theme}
          />
         <SideBarNav open={open} setOpen={setOpen} /> 

    {/* <Navbar setToken={setToken} /> */}
    <Box component="main" sx={{ flexGrow: 1, p: 0, m: 0 , height: "120%", width: '80vw' }}>
      <DrawerHeader />
      <Container fluid sx={{p:0,m: 0}}>
    <Routes>
      <Route path="/" element={<UserDashboard />} />

      <Route path="/appList" element={<MasterListPageCx mId="App"/>} />
      <Route path="/systemConfigList" element={<MasterListPageCx mId="System Config"/>} />
      <Route path="/lookupSetList" element={<MasterListPageCx mId="Lookup Set"/>} />
      <Route path="/lookupItemList" element={<MasterListPageCx mId="Lookup Item"/>} />
      <Route path="/menuList" element={<MasterListPageCx mId="Menu"/>} />
      <Route path="/fieldMetaDatumList" element={<MasterListPageCx mId="Field Meta Data"/>} />
      <Route path="/statusList" element={<MasterListPageCx mId="Status"/>} />
      <Route path="/dbConstraintList" element={<MasterListPageCx mId="DB Constraints"/>} />
      <Route path="/accessLevelList" element={<AccessLevelList mId="Access Level & Rights"/>} />
      <Route path="/systemUserList" element={<MasterListPageCx mId="System Users"/>} />
      <Route path="/dataFilterList" element={<MasterListPageCx mId="Data Filters"/>} />
      <Route path="/companyGroupList" element={<MasterListPageCx mId="Company Group"/>} />
      <Route path="/companyList" element={<MasterListPageCx mId="Company"/>} />
      <Route path="/branchList" element={<MasterListPageCx mId="Branch"/>} />
      <Route path="/departmentList" element={<MasterListPageCx mId="Department"/>} />
      <Route path="/holidayList" element={<MasterListPageCx mId="Holiday"/>} />
      <Route path="/countryList" element={<MasterListPageCx mId="Country"/>} />
      <Route path="/sectorList" element={<MasterListPageCx mId="Sector"/>} />
      <Route path="/stateList" element={<MasterListPageCx mId="State"/>} />
      <Route path="/cityList" element={<MasterListPageCx mId="City"/>} />
      <Route path="/bankList" element={<MasterListPageCx mId="Banks"/>} />
      <Route path="/bankAccountList" element={<MasterListPageCx mId="Bank Accounts"/>} />
      <Route path="/currencyList" element={<MasterListPageCx mId="Currency"/>} />
      <Route path="/exchangeRateList" element={<MasterListPageCx mId="Exchange Rate"/>} />
      <Route path="/productList" element={<MasterListPageCx mId="Product"/>} />
      <Route path="/commodityList" element={<MasterListPageCx mId="Commodity"/>} />
      <Route path="/imoClassList" element={<MasterListPageCx mId="IMO Class"/>} />
      <Route path="/imoUnNumberList" element={<MasterListPageCx mId="IMO UN Number"/>} />
      <Route path="/containerSizeTypeList" element={<MasterListPageCx mId="Container Size Type"/>} />
      <Route path="/vesselList" element={<MasterListPageCx mId="Vessel"/>} />
      <Route path="/vesselServiceList" element={<MasterListPageCx mId="VesselService"/>} />
      <Route path="/vesselVoyagePortList" element={<MasterListPageCx mId="VesselVoyagePort"/>} />
      <Route path="/portList" element={<MasterListPageCx mId="Port"/>} />
      <Route path="/partyList" element={<MasterListPageCx mId="Party & Types"/>} />
      <Route path="/partyAddressList" element={<MasterListPageCx mId="Party Address & Contacts"/>} />
      <Route path="/partyCommunicationList" element={<MasterListPageCx mId="Party Communication"/>} />
      <Route path="/rebatePartyList" element={<MasterListPageCx mId="Rebate Party"/>} />
      <Route path="/partySalesMapList" element={<MasterListPageCx mId="Party Sales Map"/>} />

      <Route path="/appEdit/:id" element={<MasterEditCx mId="App"/>} />
      <Route path="/systemConfigEdit/:id" element={<MasterEditCx mId="System Config"/>} />
      <Route path="/lookupSetEdit/:id" element={<MasterEditCx mId="Lookup Set"/>} />
      <Route path="/lookupItemEdit/:id" element={<MasterEditCx mId="Lookup Item"/>} />
      <Route path="/menuEdit/:id" element={<MasterEditPageMultiLevel mId="Menu"/>} /> 
      <Route path="/fieldMetaDatumEdit/:id" element={<MasterEditCx mId="Field Meta Data"/>} />
      <Route path="/statusEdit/:id" element={<MasterEditCx mId="Status"/>} />
      <Route path="/dbConstraintEdit/:id" element={<MasterEditCx mId="DB Constraints"/>} />
      <Route path="/accessLevelEdit/:id" element={<MasterEditCx mId="Access Level & Rights"/>} />
      <Route path="/systemUserEdit/:id" element={<MasterEditPageMultiLevel mId="System Users"/>} />
      <Route path="/dataFilterEdit/:id" element={<MasterEditCx mId="Data Filters"/>} />
      <Route path="/companyGroupEdit/:id" element={<MasterEditCx mId="Company Group"/>} />
      <Route path="/companyEdit/:id" element={<MasterEditCx mId="Company"/>} />
      <Route path="/branchEdit/:id" element={<MasterEditCx mId="Branch"/>} />
      <Route path="/departmentEdit/:id" element={<MasterEditCx mId="Department"/>} />
      <Route path="/holidayEdit/:id" element={<MasterEditCx mId="Holiday"/>} />
      <Route path="/countryEdit/:id" element={<MasterEditCx mId="Country"/>} />
      <Route path="/sectorEdit/:id" element={<MasterEditCx mId="Sector"/>} />
      <Route path="/stateEdit/:id" element={<MasterEditCx mId="State"/>} />
      <Route path="/cityEdit/:id" element={<MasterEditCx mId="City"/>} />
      <Route path="/bankEdit/:id" element={<MasterEditCx mId="Banks"/>} />
      <Route path="/bankAccountEdit/:id" element={<MasterEditCx mId="Bank Accounts"/>} />
      <Route path="/currencyEdit/:id" element={<MasterEditCx mId="Currency"/>} />
      <Route path="/exchangeRateEdit/:id" element={<MasterEditCx mId="Exchange Rate"/>} />
      <Route path="/productEdit/:id" element={<MasterEditCx mId="Product"/>} />
      <Route path="/commodityEdit/:id" element={<MasterEditCx mId="Commodity"/>} />
      <Route path="/imoClassEdit/:id" element={<MasterEditCx mId="IMO Class"/>} />
      <Route path="/imoUnNumberEdit/:id" element={<MasterEditCx mId="IMO UN Number"/>} />
      <Route path="/containerSizeTypeEdit/:id" element={<MasterEditCx mId="Container Size Type"/>} />
      <Route path="/vesselEdit/:id" element={<MasterEditCx mId="Vessel"/>} />
      <Route path="/vesselServiceEdit/:id" element={<MasterEditCx mId="VesselService"/>} />
      <Route path="/vesselVoyagePortEdit/:id" element={<MasterEditCx mId="VesselVoyagePort"/>} />
      <Route path="/portEdit/:id" element={<MasterEditPageMultiLevel mId="Port"/>} />
      <Route path="/partyFullEdit/:id" element={<PartyMaster />} />
      <Route path="/partyListEdit/:id" element={<MasterEditCx mId="Party & Types"/>} />
      <Route path="/partyAddressListEdit/:id" element={<MasterEditPageMultiLevel mId="Party Address & Contacts"/>} />
      <Route path="/partyCommunicationListEdit/:id" element={<MasterEditCx mId="Party Communication"/>} />
      <Route path="/rebatePartyListEdit/:id" element={<MasterEditCx mId="Rebate Party"/>} />
      <Route path="/partySalesMapEdit/:id" element={<MasterEditCx mId="Party Sales Map"/>} />
 
      <Route path="/accessLevelManage/:id" element={<AccessLevelManage />} />

      <Route path="/emplist" element={<EmployeeList />} />
      <Route path="/empedit/:id" element={<EmployeeEdit />} />
      <Route path="/userlist" element={<SystemUserList />} />
      <Route path="/useredit/:id" element={<SystemUserEdit />} />
      <Route path="/checkerInbox" element={<CheckerInboxCx />} />
      <Route path="/makerOutbox" element={<CheckerOutboxCx />} />
    </Routes>
    </Container>
    </Box>
    </BrowserRouter>
    </LocalizationProvider>

  </Box>
  </ThemeProvider>
  );
}

export default App;
