import { Typography } from '@mui/material';
import { SelectBox } from 'devextreme-react';
import React , {useEffect, useRef,useState} from 'react'
import axios from 'axios';

export default function SelectBoxDropdown({ dataSource, setpropName,setpropId,baseObj, value, initialText, initialId, ancobjectName, setbaseObj, data, dynamic,apiName,listType,fieldName }) {
    const [selectboxDatasource, setselectboxDatasource] = useState(dataSource)
    const selectboxRef = useRef(null);


    useEffect(()=>{
        //console.log("selectbox",data);
        setInitialData();
    },[]);

    const setInitialData = () => {
        try{
            if(initialText !== ""){
                getData(apiName,listType,fieldName,initialText);
            }
        }
        catch(ex){}
    }


    const handleValueChange = (e) => {
        console.log('e',e);
        try{
            setpropName(e.component.option("text"));
        }
        catch(ex){}

        try{
            setpropId(e.value);
        }
        catch(ex){
            //console.log(ex)
        }
        
        let valueExpr = e.component.option("name");
        setbaseObj({ ...baseObj, [valueExpr]: e.value });
    };


    const getData = (apiName,listType,fieldName,fieldValue)=>{
        if(!apiName)
            return;
        try {
            axios({
              method: 'get',
              url: apiName + '/' + listType + '/' + fieldName + '/' + fieldValue,
            }).then((response) => {
              //console.log(response.data);
              setselectboxDatasource(response.data.anc_results);
              ancobjectName = response.data.anc_results;
              
              //console.log(selectboxDatasource);
            }).catch((error) => {

              if (error.response) {
                console.log("Error occured while retrieving ancillary data..");
              }
            })
          }
          catch (ex) {
          }
    }

    const handleKeyDown = (event) =>{
        try{
            var s = selectboxRef.current.instance.option('text');
            console.log(s);
            if(s.length === 2){
                getData(apiName,listType,fieldName,s);
            }
        }
        catch(ex){}
    }

    return (
        <>
         {dynamic ?
                <SelectBox dataSource={selectboxDatasource}
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
                    showClearButton={false}
                    labelMode='floating'
                    showSelectionControls={false}
                    stylingMode='underlined'
                    height='45px'
                    ref={selectboxRef}
                    onKeyDown={handleKeyDown}
                    onValueChanged={handleValueChange}
                    className='select-box-text'

                />
                :
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
                    showClearButton={false}
                    showDataBeforeSearch={true}
                    labelMode='floating'
                    showSelectionControls={false}
                    stylingMode='underlined'
                    height='45px'
                    className='select-box-text'
                    // labelStyle={{ fontSize: '8pt' }}
                    onValueChanged={handleValueChange}
                />
         }
        </>
    )
}
