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

import SystemUserEditCx from './FireQube/masters/User Master/SystemUserEdit';
import DataAccessLevelManage from './FireQube/masters/Access Level/DataAccessLevelManage';
import DataFilter from './FireQube/masters/DataFilter';

import BookingList from './FFS/transactions/Booking/BookingList';
import BookingEdit from './FFS/transactions/Booking/Booking';

import SystemUserList from './FireQube/masters/SystemUserList'
import DepartmentEdit from './FireQube/masters/DepartmentEdit';
import PartyMaster from './FFS/masters/PartyMaster/PartyMaster';
import PartySalesMapEdit from './FFS/masters/PartyMaster/PartySalesMapEdit';
import EmployeeEdit from './FireQube/masters/EmployeeEdit';
import SystemUserEdit from './FireQube/masters/SystemUserEdit'
import Login from './FireQube/auth/Login';
import Box from '@mui/material/Box';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import TopBarNav from './FireQube/widgets/TopbarNav';
import SideBarNav from './FireQube/widgets/sideBarNav';
import { Container } from 'react-bootstrap';
import { styled  } from '@mui/material/styles';
import { getFormattedDate } from './shared/scripts/common';
import VesselVoyagePort from './FFS/masters/VesselVoyagePort';
import BuyPendencyList from './FFS/transactions/Booking/BuyPendencyList';
import SellPendencyList from './FFS/transactions/Booking/SellPendencyList';
import BookingCommercials from './FFS/transactions/Booking/BookingCommercials';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

/*
App.js:ViewState
	- fromDate
	- toDate
	- listPageName
	- dataSource	(data)
	- columnDetails	(functionpointcolumns)
	- pageNumber
	- filterCriteria
*/

function App() {
  const [token, setToken] = useState(null);
  const [userInfo,setUserInfo] = useState(null);
  const [open, setOpen] = React.useState(true);
  var frdt = getFormattedDate(new Date());
  var todt = getFormattedDate(new Date());
  const [viewState,setViewState] = useState({fromDate: frdt, toDate: todt});
  const [dbEnvironment,setdbEnvironment] = useState();
  const [reloadMenu,setreloadMenu] = useState(0);

  useEffect(()=>{

  },[userInfo]);

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
    return <Login setToken={setToken} setUserInfo={setUserInfo} setdbEnvironment={setdbEnvironment} />
  }



  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", p:0, m:0, minHeight:'100vh',minWidth:'99vh',overflow:'hidden' }} className="AppBackgroundCanvas" >
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
    <BrowserRouter>
        {userInfo?<><TopBarNav
            open={open}
            setToken={setToken}
            setOpen={setOpen}
            handleDrawerOpen={handleDrawerOpen}
            theme={theme}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            dbEnvironment={dbEnvironment}
            reloadMenu={reloadMenu}
            setreloadMenu={setreloadMenu}
          />
         <SideBarNav open={open} setOpen={setOpen} reloadMenu={reloadMenu} /></>:<></>} 

    {/* <Navbar setToken={setToken} /> */}
    <Box component="main" sx={{ flexGrow: 1, p: 0, m: 0 , height: "120%", width: '80vw', overflow: 'none' }}>
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
        <Route path="/partyList" element={<MasterListPageCx mId="Party & Types" viewState={viewState} setViewState={setViewState}/>} />
        <Route path="/partyAddressList" element={<MasterListPageCx mId="Party Address & Contacts"/>} />
        <Route path="/partyCommunicationList" element={<MasterListPageCx mId="Party Communication"/>} />
        <Route path="/rebatePartyList" element={<MasterListPageCx mId="Rebate Party"/>} />
        <Route path="/partySalesMapList" element={<MasterListPageCx mId="Party Sales Map"/>} />
        <Route path="/locationList" element={<MasterListPageCx mId="Location"/>} />
        <Route path="/commodityCategoryList" element={<MasterListPageCx mId="Commodity Category"/>} />
        <Route path="/crmTeamList" element={<MasterListPageCx mId="CRM Team"/>} />
        <Route path="/lineServiceContractList" element={<MasterListPageCx mId="Line Service Contract List"/>} />
        <Route path="/bookingList" element={<BookingList mId="Port" viewState={viewState} setViewState={setViewState} setOpen={setOpen} />} />
        <Route path="/bookingBuyCommercialList" element={<BuyPendencyList mId="Port" viewState={viewState} setViewState={setViewState} setOpen={setOpen} />} />
        <Route path="/bookingSellCommercialList" element={<SellPendencyList mId="Port" viewState={viewState} setViewState={setViewState} setOpen={setOpen} />} />
        <Route path="/chargeList" element={<MasterListPageCx mId="Charge List"/>} />
        <Route path="/applicableChargeList" element={<MasterListPageCx mId="Applicable Charge List"/>} />
        <Route path="/rateList" element={<MasterListPageCx mId="Rate List"/>} />


        <Route path="/addressWiseSalesTeam" element={<MasterListPageCx mId="AddressWise SalesTeam"/>} />

        <Route path="/appEdit/:id" element={<MasterEditCx mId="App"/>} />
        <Route path="/systemConfigEdit/:id" element={<MasterEditCx mId="System Config"/>} />
        <Route path="/lookupSetEdit/:id" element={<MasterEditCx mId="Lookup Set"/>} />
        <Route path="/lookupItemEdit/:id" element={<MasterEditCx mId="Lookup Item"/>} />
        <Route path="/menuEdit/:id" element={<MasterEditPageMultiLevel mId="Menu"/>} /> 
        <Route path="/fieldMetaDatumEdit/:id" element={<MasterEditCx mId="Field Meta Data"/>} />
        <Route path="/statusEdit/:id" element={<MasterEditCx mId="Status"/>} />
        <Route path="/dbConstraintEdit/:id" element={<MasterEditCx mId="DB Constraints"/>} />
        <Route path="/accessLevelEdit/:id" element={<MasterEditCx mId="Access Level & Rights"/>} />
        {/* <Route path="/systemUserEdit/:id" element={<MasterEditPageMultiLevel mId="System Users"/>} /> */}
        <Route path="/systemUserEdit/:id" element={<SystemUserEditCx mId="System Users"/>} />
        <Route path="/dataFilterEdit/:id" element={<DataFilter mId="Data Filters"/>} />
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
        <Route path="/vesselServiceEdit/:id" element={<MasterEditPageMultiLevel mId="VesselService"/>} />
        <Route path="/vesselVoyagePortEdit/:id" element={<VesselVoyagePort mId="VesselVoyagePort"/>} />
        <Route path="/portEdit/:id" element={<MasterEditPageMultiLevel mId="Port"/>} />
        <Route path="/partyFullEdit/:id" element={<PartyMaster />} />
        <Route path="/partyListEdit/:id" element={<MasterEditCx mId="Party & Types"/>} />
        <Route path="/partyAddressListEdit/:id" element={<MasterEditPageMultiLevel mId="Party Address & Contacts"/>} />
        <Route path="/partyCommunicationListEdit/:id" element={<MasterEditCx mId="Party Communication"/>} />
        <Route path="/rebatePartyListEdit/:id" element={<MasterEditCx mId="Rebate Party"/>} />
        <Route path="/partySalesMapEdit/:id" element={<PartySalesMapEdit mId="Party Sales Map"/>} />
        <Route path="/locationEdit/:id" element={<MasterEditCx mId="Location"/>} />
        <Route path="/commodityCategoryEdit/:id" element={<MasterEditCx mId="Commodity Category"/>} />
        <Route path="/crmTeamEdit/:id" element={<MasterEditPageMultiLevel mId="CRM Team"/>} />
        <Route path="/lineServiceContractEdit/:id" element={<MasterEditCx mId="Line Service Contract"/>} />
        <Route path="/bookingEdit/:id" element={<BookingEdit mId="Port" setOpen={setOpen}/>} />
        <Route path="/bookingBuyCommercialEdit/:id" element={<BookingCommercials mId="Buy" setOpen={setOpen}/>} />
        <Route path="/bookingSellCommercialEdit/:id" element={<BookingCommercials mId="Sell" setOpen={setOpen}/>} />

        <Route path="/accessLevelManage/:id" element={<AccessLevelManage />} />
        <Route path="/accessLevelDataManage/:id" element={<DataAccessLevelManage />} />

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
