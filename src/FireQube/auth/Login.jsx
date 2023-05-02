import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import { FormControl, FormGroup, InputLabel, Input, Typography,  styled, Alert, AlertTitle, Paper, Stack } from '@mui/material';
import axios from 'axios';
import { decryptAES, encryptAES } from '../../shared/scripts/globalfuncs';
import '../../shared/styles/Login.css';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import Grid from '@mui/material/Grid';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const initialVal = {
  loginId: '',
  loginPassword: ''
};

const initialPwdVal = {
  systemUserId: 0,
  newPassword: '',
  retypedPassword: ''
};

const Container = styled(FormGroup)`
  margin: 5% auto 0 auto;
  & > div {
    margin-top: 20px;
  }
`
export default function Login({setToken}) {
  const [loginCreds, setLoginCreds] = useState(initialVal);
  const loginRef = useRef();
  const pwdRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pwdResetMsg, setPwdResetMsg] = useState("");
  const [firstTimeLogin, setFirstTimeLogin] = useState(false);
  const [activeSession, setActiveSession] = useState(false);
  const [passwordVal, setPasswordVal] = useState(initialPwdVal);
  const [id, setId] = useState(0);
  const [showAlertMsg, setShowAlertMsg] = useState(false);

  const theme = createTheme({
    typography: {
      fontSize: 10,
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
    
  useEffect(() => {
    setFocus();
    // eslint-disable-next-line
  }, [firstTimeLogin]);

  const setFocus = () => {
    try{
    if(firstTimeLogin)
      pwdRef.current.focus();
    else 
      loginRef.current.focus();
    }
    catch(ex){
    }
  }

  useEffect(() => {
    setErrMsg("");
  }, [loginCreds]);

  useEffect(() => {
    setPwdResetMsg('Please enter a new password..');
  }, [passwordVal]);

  const clearForm = () => {
    loginCreds.loginId = '';
    loginCreds.loginPassword = '';
    passwordVal.newPassword = '';
    passwordVal.retypedPassword = '';
  };

  const onValChange = (e) => {
    setLoginCreds({...loginCreds, [e.target.name]: e.target.value});
  }

  const onPwdValChange = (e) => {
    setPasswordVal({...passwordVal, [e.target.name]: e.target.value});
  }

  const resetPassword = async () => {
    if(passwordVal.newPassword !== passwordVal.retypedPassword) {
      setPwdResetMsg("Typed passwords do not match. Please resolve and retry.");
      setFocus();
      return;
    }

    try {
      await axios.post('systemUser/resetPassword', passwordVal)
      .then((response) => {
        if(response.status === 200) {
          // setPasswordVal(initialPwdVal);
          // setLoginCreds(initialVal);
          // setFirstTimeLogin(false);
          // setErrMsg("Password has been reset successfully.");
          window.location.reload(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          if(error.response.status === 409) {
            setPwdResetMsg(error.response.data.ResponseMessage);
            setFocus();
          }
        }
      });
    } 
    catch (error) {
      setPwdResetMsg("Error while changing password.. Response Code - " + error.message);
    }
  };

  const cancelSession = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    window.location.reload(false);
  };

  const newSession = async () => {
    await axios.put('systemUser/logout/' + id)
    .then((response) => {
      if(response.status === 200) {
        localStorage.removeItem("authToken");

        axios.post('token/authenticate', loginCreds)
        .then((response) => {
          setErrMsg("");
          setToken(response.data);
          localStorage.setItem("authToken", JSON.stringify(response.data));
        })
      }
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
      }
    });
  };

  const testSomething = async () => {

    console.log("org pwd = " + loginCreds.loginPassword);
    let enc = encryptAES(loginCreds.loginPassword);
    console.log("enc pwd = " + enc);
    let dec = decryptAES(enc);
    console.log("dec pwd = " + dec);
    // return;
    await axios.post('token/check', {...loginCreds, 'loginPassword': encryptAES(loginCreds.loginPassword)})
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const loginUser = async () => {
    try {
      if (loginCreds.loginId === '' || loginCreds.loginPassword === '') 
      {
        setErrMsg("Cannot continue without entering loginid and password..");
        clearForm();
        setFocus();
        return;
      }

      await axios.post('token/authenticate', loginCreds)
      .then((response) => {
        //console.log(response);
        switch (response.data.ResponseCode) {
          case "AFT":
            setPasswordVal({...passwordVal, 'systemUserId': response.data.SystemUserId});
            localStorage.setItem("authToken", JSON.stringify(response.data));
            setFirstTimeLogin(true);
            break;
          case "AAS":
            setActiveSession(true);
            setId(response.data.SystemUserId);
            setErrMsg("There is already an active session for this account.");
            break;
          case "AOK":
            setErrMsg("");
            setToken(response.data);
            localStorage.setItem("authToken", JSON.stringify(response.data));
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        if (error.response) {
          if(error.response.status === 401) {
            switch (error.response.data.ResponseCode) {
              case "UUI":
                setErrMsg("Account is inactive. Cannot continue.");
                break;
              case "UUL":
                setErrMsg("Account is locked. Contact system admin to unlock your account.");
                break;
              case "UCI":
                setErrMsg(error.response.data.ResponseMessage);
                break;
              case "ULI":
                setErrMsg("Invalid Login Id or Password.. Try again");
                break;
              case "UPX":
                setErrMsg("Password expired. Kindly reset your password.");
                break;
              case "UAU":
                  setErrMsg("No App permission assigned for this user. Contact Admin.");
                  break;
              default:
                break;
            }
            setFocus();
          }
        }
      });
    } catch (error) {
      setErrMsg("Error while authenticating user.. Response Code - " + error.message);
    }
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="container-back">
      <div className="login-wrapper vertical-center">
      <Grid container spacing={1}>
            <Grid item xs={6} width={400}>

            </Grid>
            <Grid item xs={6} width={400}>
              <img src="../Teravista.png" width="300" height="42"/>

              <br/>
        
    { firstTimeLogin ? (
      <Container>
        <Typography variant="h6">Reset Password</Typography>
        <span style={{fontSize:11, color:'red'}}>{pwdResetMsg}</span>
        <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control type = "password" onChange={(evt) => onPwdValChange(evt)} name='newPassword' value = {passwordVal.newPassword} inputref={pwdRef} required />
        </Form.Group>
        <Form.Group>
            <Form.Label>Re-type Password</Form.Label>
            <Form.Control type = 'password' onChange={(evt) => onPwdValChange(evt)} name='retypedPassword' value = {passwordVal.retypedPassword} required />
        </Form.Group>

        <FormControl>
          <Stack direction="row" spacing={2} justifyContent="flex-start">
            <Button variant='primary' onClick={() =>  resetPassword()}>
            <i className={'bi-arrow-right-square'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
              Reset Password</Button>
            <Button variant='secondary' onClick={() => cancelSession()}>
            <i className={'bi-calendar2-x'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
            Cancel</Button>
          </Stack>
        </FormControl>
        <FormControl>
            <Alert severity="info" icon={true} sx={{p:0,m:0}}>
              <AlertTitle>Rules for selecting new password</AlertTitle>
              {/* This will all come from system settings api call */}
              <ul style={{fontSize:10}}>
                <li>Length of password should be between 8 & 24 characters</li>
                <li>Password should contain atleast 1 special character(s), 1 number, 1 lower & 1 upper case character(s)</li>
                <li>Password should not contain spaces</li>
                <li>Password may not be similiar to last 5 password(s)</li>
              </ul>
            </Alert>
        </FormControl>
      </Container>
    ) : activeSession ? (
      <Container>
        <Typography variant="h6">Active Session</Typography>
        <span style={{fontSize:11}}>Concurrency detected for this login</span>
        <Alert severity="info" style={{fontSize:13}}>
          <AlertTitle><b>Action required</b></AlertTitle>
          There is another active session for the specified user, would you like to terminate that session and continue here?
          <br/>
          <br/>
          <b>Note:</b>The unsaved data being entered in the session might be lost and cannot be undone if the session is terminated.
        </Alert>
        <FormControl>
          <Stack direction="row" spacing={2} justifyContent="flex-start">
            <Button variant='primary' onClick={() => newSession()}>
              <i className={'bi-arrow-right-square'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Continue?
            </Button>
            <Button variant='secondary' onClick={() => cancelSession()}  >
            <i className={'bi-calendar2-x'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
              Cancel
            </Button>
          </Stack>
        </FormControl>
       <br/>
       <br/>
      </Container>
    ) : (
      <Container>
        <Typography variant="h1"><b>Hello!</b></Typography>
        <span style={{fontSize:10}}>Specify your login credentials to access the console</span>
        <Form.Group>
            <Form.Label>Login Id</Form.Label>
            <Form.Control onChange={(evt) => onValChange(evt)} name='loginId' autoComplete='off' inputref={loginRef} value={loginCreds.loginId} required />
            <Form.Text className="text-muted">
              We'll never share your credentials with anyone else.
            </Form.Text>
        </Form.Group>
        <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control  type='password' onChange={(evt) => onValChange(evt)} name='loginPassword' autoComplete='off' />
        </Form.Group>
        <FormControl>
          <Stack direction="row" spacing={1} justifyContent="flex-start" >
          <Button variant="primary" onClick={() => loginUser()} >
              <i className={'bi-box-arrow-in-right'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                Login
              </Button>
              <Button variant="secondary" >
              <i className={'bi-bullseye'} style={{color:'white', fontSize: '9pt', marginRight: '10px'}} />
                Forgot Password?
              </Button>
            </Stack>
        </FormControl>
        {errMsg?
        <Alert severity="info" >
        <AlertTitle sx={{fontSize:12}}>{errMsg}</AlertTitle>
        </Alert>
        :<><div style={{height:'50px'}}></div></>}
      </Container>
    )}
           </Grid>
          </Grid>
      </div>
    </div>
    </ThemeProvider>
  )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}