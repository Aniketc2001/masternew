import { Typography } from '@mui/material';
import { SelectBox } from 'devextreme-react';
import React , {useEffect, useRef,useState} from 'react'
import axios from 'axios';

export default function SelectBoxDropdown({ dataSource, setpropName,setpropId,baseObj, value, initialText, initialId, ancobjectName, setbaseObj, data, dynamic,apiName,listType,fieldName, ancchild,setancds }) {
    const [selectboxDatasource, setselectboxDatasource] = useState(dataSource)
    const selectboxRef = useRef(null);


    useEffect(()=>{
        //console.log("selectbox",data);
        setInitialData();
    },[]);

    const setInitialData = () => {
        try{
            //console.log('setinitval selectbox',initialText);
            if(initialText !== ""){
                getData(apiName,listType,fieldName,initialText);
            }
        }
        catch(ex){}
    }


    const handleValueChange = (e) => {
        //console.log('SBD handleValueChange e',e, 'curr value',value);

        try{
            if(typeof e.value !== 'undefined')
                setpropName(e.component.option("text"));
        }
        catch(ex){
            //console.log('ex1',ex);
        }

        try{
            if(typeof e.value !== 'undefined')
                setpropId(e.value);
        }
        catch(ex){
            console.log('ex2',ex,e);
        }
        
        let valueExpr = e.component.option("name");
        if(typeof e.value !== 'undefined'){
            console.log('setting value of ',valueExpr,e.value);
            setbaseObj(prevItem => ({ ...prevItem, [valueExpr]: e.value }));
        //    baseObj[valueExpr] = e.value;
        }
        
    };


    const getData = (apiName,listType,fieldName,fieldValue)=>{
        if(!apiName)
            return;
        try {
            axios({
              method: 'get',
              url: apiName + '/' + listType + '/' + fieldName + '/' + fieldValue,
            }).then((response) => {
              //console.log('getting data...',response.data.anc_results);
              setselectboxDatasource(response.data.anc_results);
              ancobjectName = response.data.anc_results;
              setancds(ancchild,response.data.anc_results);
            }).catch((error) => {
              if (error.response) 
                console.log("Error occured while retrieving ancillary data..");
            })
          }
          catch (ex) {}
    }

    const handleKeyDown = (event) =>{
        try{
            var s = selectboxRef.current.instance.option('text');
            //console.log(s);
            if(s.length === 2){
                getData(apiName,listType,fieldName,s);
            }
        }
        catch(ex){
            console.log('keydown err',ex);
        }
    }

    const dynaButton = () =>{
        return (
            <i className={'bi-list-columns-reverse'} style={{ color:'orange',fontSize: '10pt', marginRight: '10px'}} />
          );
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
                    minSearchLength={3}
                    showDataBeforeSearch={true}
                    showClearButton={false}
                    labelMode='floating'
                    showSelectionControls={false}
                    height='45px'
                    ref={selectboxRef}
                    onKeyDown={handleKeyDown}
                    //onValueChanged={handleValueChange}
                    onValueChanged={handleValueChange}
                    dropDownButtonRender={dynaButton}
                    //className='select-dyna-box-text'
                    placeholder='Type atleast 3 chars to search...'
                    stylingMode="underlined"
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
                    //className='select-box-text'
                    placeholder='Type to search...'
                    // labelStyle={{ fontSize: '8pt' }}
                    onValueChanged={handleValueChange}
                />
         }
        </>
    )
}
