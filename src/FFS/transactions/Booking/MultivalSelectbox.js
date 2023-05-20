import React from 'react'
import { SelectBox } from 'devextreme-react'
import {useRef,useState} from 'react'


export default function MultivalSelectbox({itemRenderJsx, dataSource,setpropId,setpropName, baseObj, value, setbaseObj, data }) {
    const [selectboxDatasource, setselectboxDatasource] = useState(dataSource)
    // const handleValueChange = (e) => {
    //     let valueExpr = e.component.option("name");
    //     setbaseObj({ ...baseObj, [valueExpr]: e.value });
    // };
    const dropDownOptions = {
        FontFace: 'Poppins',
        height: '200', // Set the desired height in pixels
      };
    
    const handleValueChange = (e) => {
        try{
            setpropName(e.component.option("text"));
        }
        catch(ex){}
        try{
            setpropId(e.value);
        }
        catch(ex){}

        let valueExpr = e.component.option("name");
        setbaseObj({ ...baseObj, [valueExpr]: e.value });
    };


    return (
        <SelectBox dataSource={dataSource}
            name={data.name}
            displayExpr={data.displayExpr}
            valueExpr={data.valueExpr}
            label={data.label}
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
            stylingMode='underlined'
            height='45px'
            style={{ marginLeft: 0 }}
            className='select-box-text'
            onValueChanged={handleValueChange}
            dropDownOptions={dropDownOptions}
        />
    )
}
