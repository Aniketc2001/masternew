import * as React from 'react';

import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import MultiLevelList from './MultiLevelList';
import '../../shared/styles/dx-styles.css';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });
  
  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(5)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(6)} + 1px)`,
    },
  });
  
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  
function SideBarNav(props){
  const [open, setOpen] = React.useState(props.open);
  

  const handleDrawerClose = () => {
    setOpen(false);
    props.setOpen(false);
  };
  
  const setparentState = (fg) =>{
    props.setparentState(fg);
  } 

return (
  <Drawer variant="permanent" open={props.open}  >
    <div style={{overflow: 'none',height: '100'}} className='SidebarBackground' > 
    <DrawerHeader>
      <img
        src="../Teravista.png"
        width="240"
        height="30"
        onClick={handleDrawerClose}
      />
    </DrawerHeader>
    <Divider />
    <div style={{overflow: 'none',height: '100'}} > 
      <MultiLevelList open={open} />
    </div>
    <Divider />
    </div>
  </Drawer>
);
}

export default SideBarNav;
