import React from 'react'

export default function VvpcsSBRender({VesselVoyagePortName,Vvpc,PortTerminalName}) {
  return (
    <>
    <div style={{fontFamily:'Poppins', fontSize:'9pt'}}>
        <span><b>{VesselVoyagePortName}</b></span><br/>
        <div style={{fontSize:'12pt'}}>
        <span>{Vvpc}</span><br/>
        <span>{PortTerminalName}</span><br/>
        {/* <span>{}</span> */}
        </div>
    </div>    
    </>
  )
}
