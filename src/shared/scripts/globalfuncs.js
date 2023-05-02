import * as CryptoJS from 'crypto-js';

const key = "8182838485868788";

const cfg = {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
    feedbackSize: 128    
};

export const encryptAES = (text) => {
    return CryptoJS.AES.encrypt(text, key, cfg).toString();
};

export const decryptAES = (encryptedBase64) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key);
    if (decrypted) {
      try {
        const str = decrypted.toString(CryptoJS.enc.Utf8);
        if (str.length > 0) {
          return str;
        } else {
          return 'error 1';
        } 
      } catch (e) {
        return 'error 2';
      }
    }
    return 'error 3';
};

export const getUrlToRedirectPostCheckerAction = (clr, actualUrl) => {
  //here we will call an endpoint which will give us the checker inbox and maker outbox menu id
  //then we will encrypt it and send it back to the calling function
  let url = "";

  if(clr === null) {
    url = actualUrl;
  }
  else if (clr === 'c') {
    url = "/chkrInboxCx?m=16";
  }
  else {
    url = "/mkroutbox?m=17";
  }

  return url;
}
