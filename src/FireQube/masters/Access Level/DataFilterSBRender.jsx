import React from 'react'

export default function DataFilterSBRender({FilterName,Description}) {
    return (
        <div style={{ fontFamily: 'Poppins', fontSize: '9pt' }}>
            <span><b>{FilterName}</b></span><br />
            <div style={{ fontSize: '8pt' }}>
                <span>{Description}</span>
            </div>
        </div>
    )
}
