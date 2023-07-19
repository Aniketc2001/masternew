

import React from 'react'
import { SelectBox } from 'devextreme-react'
import {useRef,useState} from 'react'


export default function MultiValSelectBox({itemRenderJsx, dataSource,propId, baseObj, value, index,setbaseObj, data,handleValueSelection }) {
    
    const handleValueChange = (e) => {
        const modifiedbaseObj = baseObj.map(data=>{
            if(data.ModuleId === propId){
                let valueExpr = e.component.option("name");
                data[valueExpr] = e.value;
                handleValueSelection(index,propId,e.value);
            }
            return data;
        });
        setbaseObj(modifiedbaseObj);
    };

    const dropDownOptions = {
        FontFace: 'Poppins',
        height: '200', 
      };

    return (
        <SelectBox 
            dataSource={dataSource}
            name={data.name}
            displayExpr={data.displayExpr}
            valueExpr={data.valueExpr}
            // label={data.label}
            searchExpr={data.searchExpr}
            value={value}
            itemRender={itemRenderJsx}
            searchEnabled={true}
            showClearButton={false}
            searchMode='contains'
            searchTimeout={200}
            minSearchLength={0}
            showDataBeforeSearch={true}
            labelMode='floating'
            showSelectionControls={false}
            stylingMode='floating'
            height='45px'
            dropDownOptions={dropDownOptions}
            onValueChanged={handleValueChange}
            placeholder='Type to search...'
        />
    )
}
