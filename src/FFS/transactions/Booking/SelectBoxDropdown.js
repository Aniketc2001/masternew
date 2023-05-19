import { SelectBox } from 'devextreme-react';
import React from 'react'

export default function SelectBoxDropdown({dataSource,baseObj,value,setbaseObj,data}) {

    const handleValueChange = (e) => {
        let valueExpr = e.component.option("name");
        setbaseObj({ ...baseObj, [valueExpr]: e.value });
    };

    return (
        <>
            <SelectBox dataSource={dataSource}
                fullWidth
                name={data.name}
                displayExpr={data.displayExpr}
                valueExpr={data.valueExpr}
                label={data.label}
                searchExpr={data.searchExpr}
                value={value}
                searchEnabled={true}
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
            />
        </>
    )
}
