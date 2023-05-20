import React from 'react'

export default function CustomerAddressSBRender({CustomerSiteName,CustomerSiteAddress1,CustomerSiteAddress2,CustomerSiteAddress3}) {

    return (
        <>
        <div style={{fontFamily:'Poppins', fontSize:'9pt'}}>
            <span><b>{CustomerSiteName}</b></span><br/>
            <div style={{fontSize:'8pt'}}>
            <span>{CustomerSiteAddress1}</span><br/>
            <span>{CustomerSiteAddress2}</span><br/>
            <span>{CustomerSiteAddress3}</span>
            </div>
        </div>    
        </>
    
    );
}
