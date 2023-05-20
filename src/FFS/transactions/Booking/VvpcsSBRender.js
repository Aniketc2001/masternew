import React from 'react'

export default function VvpcsSBRender({VesselVoyagePortName,PortName,PortTerminalName}) {
  return (
    <>
    <div style={{fontFamily:'Poppins', fontSize:'9pt'}}>
        <span><b>{VesselVoyagePortName}</b></span><br/>
        <div style={{fontSize:'8pt'}}>
        <span>{PortName}</span><br/>
        <span>{PortTerminalName}</span><br/>
        {/* <span>{}</span> */}
        </div>
    </div>    
    </>
  )
}
