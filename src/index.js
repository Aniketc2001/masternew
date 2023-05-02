import React from 'react';
import ReactDOM from 'react-dom/client';
import './shared/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

//axios.defaults.baseURL = "http://192.168.0.180:5036/api/";
axios.defaults.baseURL = "http://103.120.176.146:90/api/";

axios.interceptors.request.use((request) => {
  request.headers.channelname = "Teravista.io FireQube";
  if(!request.url.startsWith("token"))
  {
    let token = JSON.parse(localStorage.getItem("authToken"));
    
    if(token)
    {
      request.headers.Authorization = "bearer " + token.AccessToken;
      request.headers.aId = token.AppId;
    }
  }
  //console.log('request...');
  //console.log(request);
  return request;
});

axios.interceptors.response.use((response) => {
  return response;
}, async (error) => {
    if(error.response.status === 401 && !error.config.url.startsWith("token")){
      let token = JSON.parse(localStorage.getItem("authToken"));

      const rfrTokenBody = {  
        "AccessToken": token.AccessToken,
        "RefreshToken": token.RefreshToken
      };
      
      const res = await axios.post('token/refreshtoken', rfrTokenBody)

      if(res.status === 200){
        localStorage.setItem("authToken", JSON.stringify(res.data));
        return axios(error.config);
      }
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
