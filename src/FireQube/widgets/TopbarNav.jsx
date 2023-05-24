import * as React from "react";
import { useState, useEffect, useContext } from "react";

import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material/styles";

import Badge from "@mui/material/Badge";
import { createTheme } from "@mui/material/styles";
import ClickAwayListener from "@mui/base/ClickAwayListener";

import AccountPopover from "./AccountPopover";
import ApplicationMenuPopover from "./ApplicationMenuPopover";
import "../../shared/styles/dx-styles.css";
import { Navigate, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function TopBarNav(props) {
  const [objref, setObjref] = useState(null);

  const [popoverFlag, setpopoverFlag] = useState(false);
  const [appmenupopoverFlag, setappmenupopoverFlag] = useState(false);
  const navigate = useNavigate();

  //console.log("Topbarnav props",props);
  const theme = createTheme({
    typography: {
      fontSize: 12,
      fontFamily: [
        "Poppins",
        "Roboto",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
  });

  //User menu flag setting functions
  const hidePopover = (event) => {
    //console.log('called hidepop...');
    setpopoverFlag(false);
  };

  const logoff = () => {
    props.setUserInfo(null);
    navigate("/");
    props.setToken(null);
  };

  const showPopover = (event) => {
    setObjref(event.currentTarget);
    setpopoverFlag(!popoverFlag);
  };

  //Application menu flag setting functions
  const showApplicationMenuPopover = (event) => {
    setObjref(event.currentTarget);
    setappmenupopoverFlag(!appmenupopoverFlag);
  };

  const hideappmenuPopover = (event) => {
    setappmenupopoverFlag(false);
  };

  return (
    //0F6CBD
    <AppBar position="fixed" open={props.open}>
      <Toolbar className="TopbarNav" variant="dense">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={props.handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(props.open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontFamily: "Poppins", fontWeight: "light", flexGrow: 1 }}
        >
          <strong>Teravista.io</strong> Application Console
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            autoComplete
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <ClickAwayListener onClickAway={hideappmenuPopover}>
          <IconButton
            size="small"
            aria-label="applications list"
            color="inherit"
            onClick={showApplicationMenuPopover}
          >
            <i
              className="bi bi-grid-3x3-gap-fill"
              sx={{ fontSize: "16pt" }}
            ></i>
            <ApplicationMenuPopover
              objref={objref}
              id={"accountAvatar"}
              popoverFlag={appmenupopoverFlag}
              setpopoverFlag={setappmenupopoverFlag}
              hidePopoverfn={hideappmenuPopover}
            />
          </IconButton>
        </ClickAwayListener>
        <IconButton
          size="small"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="warning">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <ClickAwayListener onClickAway={hidePopover}>
          <IconButton
            size="large"
            aria-describedby="accountAvatar"
            aria-label="Account Profile"
            color="inherit"
            onClick={showPopover}
          >
            <AccountCircle />
            <Typography
              variant="caption"
              noWrap
              component="div"
              sx={{ fontFamily: "Poppins", fontWeight: "light", flexGrow: 1, color:"white", paddingLeft:'5px' }}
            >
              <b>{props.userInfo?props.userInfo.FirstName:""}</b>
            </Typography>
            <Typography
              variant="caption"
              noWrap
              component="div"
              sx={{ fontFamily: "Poppins", fontWeight: "light", flexGrow: 1, color:"orange", paddingLeft:'3px' }}
            >
              {props.userInfo?props.userInfo.LastName:""}
            </Typography>
            <AccountPopover
              objref={objref}
              id={"accountAvatar"}
              popoverFlag={popoverFlag}
              setpopoverFlag={setpopoverFlag}
              hidePopoverfn={hidePopover}
              setToken={props.setToken}
              logoff={logoff}
            />
          </IconButton>
        </ClickAwayListener>
      </Toolbar>
    </AppBar>
  );
}

export default TopBarNav;
