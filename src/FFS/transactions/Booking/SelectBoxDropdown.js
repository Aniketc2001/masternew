import { Typography } from '@mui/material';
import { SelectBox } from 'devextreme-react';
import React , {useEffect, useRef,useState} from 'react'
import axios from 'axios';
import { Autocomplete } from 'devextreme-react/autocomplete';

export default function SelectBoxDropdown({ dataSource, setpropName,setpropId,baseObj, value, initialText, initialId, ancobjectName, setbaseObj, data, dynamic,apiName,listType,fieldName, ancchild,setancds }) {
    const [selectboxDatasource, setselectboxDatasource] = useState(dataSource)
    const [selectboxValue, setselectboxValue] = useState(value)
    const [currentSBText,setcurrentSBText] = useState('');


    const selectboxRef = useRef(null);


    useEffect(()=>{
        //console.log("selectbox useeffect",data);
        setInitialData();
    },[]);


    useEffect(()=>{
        try{
            const options = selectboxRef.current.instance.option();
            console.log("SelectBox options:", options);
            // console.log('datasource refreshed...');
            selectboxRef.current.instance.option({
                displayValue: currentSBText,
                text: currentSBText,
              });
            //selectboxRef.current.instance.option("text", "Option 2");
        }
        catch(ex){}
    },[selectboxDatasource]);


    const setInitialData = () => {
        try{
            //console.log('setinitval selectbox',initialText);
            if(initialText !== ""){
                getData(apiName,listType,fieldName,initialText);
            }
        }
        catch(ex){}
    }


    const handleSBInit = () => {
        try{
            // selectboxRef.current.instance.option({
            //     acceptCustomValue: true,
            //     displayValue: currentSBText,
            //     text: currentSBText,
            //     value: currentSBText,
            // });
        }
        catch(ex){}
    }
    const handleValueChange = (e) => {
        console.log('SBD handleValueChange e',e, 'curr value',value);

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
        if(!apiName || !fieldValue)
            return;

        //console.log('getdata',apiName + '/' + listType + '/' + fieldName + '/' + fieldValue);

        try {
            axios({
              method: 'get',
              url: apiName + '/' + listType + '/' + fieldName + '/' + fieldValue,
            }).then((response) => {
              //console.log('getting data...',response.data.anc_results);
              setselectboxDatasource(response.data.anc_results);
              selectboxRef.current.instance.option({
                displayValue: currentSBText,
              });
              //setselectboxValue(fieldValue);
              ancobjectName = response.data.anc_results;
              setancds(ancchild,response.data.anc_results);
            }).catch((error) => {
              console.log('err',error,'url : ',apiName + '/' + listType + '/' + fieldName + '/' + fieldValue);
              if (error.response) 
                console.log("Error occured while retrieving ancillary data..");
            })
          }
          catch (ex) {
            console.log('err2',ex);
          }
    }

    const handleKeyDown = (event) =>{
        try{
            var s = selectboxRef.current.instance.option('text');

            // if(s.length === 2 && event.event.keyCode !== 8){
            if(event.event.keyCode === 13){
                //s = s + event.event.key;
                setcurrentSBText(s);
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
                    value={selectboxValue}
                    text={selectboxValue}
                    searchEnabled={true}
                    searchMode='contains'
                    searchTimeout={200}
                    minSearchLength={2}
                    showDataBeforeSearch={false}
                    showClearButton={true}
                    labelMode='floating'
                    showSelectionControls={false}
                    height='45px'
                    ref={selectboxRef}
                    onKeyDown={handleKeyDown}
                    onInitialized={handleSBInit}
                    //onInput={(e)=>handleInputChange(e)}
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
