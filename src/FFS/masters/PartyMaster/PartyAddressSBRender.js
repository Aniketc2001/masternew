import React from 'react'

export default function PartyAddressSBRender({PartyAddressName,Address1,Address2,Address3}) {
    return (
        <div style={{ fontFamily: 'Poppins', fontSize: '9pt' }}>
            <span><b>{PartyAddressName}</b></span><br />
            <div style={{ fontSize: '8pt' }}>
                   {
                    Address1 ?
                    <>
                    <span>{Address1}</span><br />
                    </>
                    :
                    <></>
                   }
                  {
                    Address2 ?
                    <>
                    <span>{Address2}</span><br />
                    </>
                    :
                    <></>
                   }
                   {
                    Address3 ?
                    <>
                    <span>{Address3}</span>
                    </>
                    :
                    <></>
                   }
            </div>
        </div>
    )
}
