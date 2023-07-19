import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SelectBox } from 'devextreme-react';
import React , {useEffect, useRef,useState} from 'react'
import axios from 'axios';

export default function SelectBoxDropdown({ dataSource, setpropName,setpropId,baseObj, value, initialText, initialId, ancobjectName, setbaseObj, data, dynamic,apiName,listType,fieldName, ancchild,setancds }) {
    const [selectboxDatasource, setselectboxDatasource] = useState(dataSource)
    const selectboxRef = useRef(null);

    const [options, setOptions] = useState(dataSource);
    const [selectedItemId, setSelectedItemId] = useState('');


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
            //console.log('ex2',ex);
        }
        
        let valueExpr = e.component.option("name");
        if(typeof e.value !== 'undefined'){
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

    const handleInputChange = (event) => {
        console.log('input',event);
        if (event.target.value.length === 3) {
          // Perform API call to populate the JSON array
            axios({
                method: 'get',
                url: apiName + '/' + listType + '/' + fieldName + '/' + event.target.value,
            }).then((response) => {
                console.log('getting data...',response.data.anc_results);
                setselectboxDatasource(response.data.anc_results);
                setOptions(response.data.anc_results);
                ancobjectName = response.data.anc_results;
                setancds(ancchild,response.data.anc_results);
            });            
        }
      };
    
    const handleItemSelected = (event, value) => {
        //console.log('item selected',event,value);
        if (value) {
          setSelectedItemId(value.id);
          try{
            setpropName(value[data.displayExpr]);
          }
          catch(ex){}

          try{
            setpropId(value[data.valueExpr]);
          }
          catch(ex){}
            
        } else {
          setSelectedItemId('');
        }
      };


    return (
        <>
         {dynamic ?
                <Autocomplete
                    fullWidth
                    options={options}
                    autoHighlight
                    getOptionLabel={(option) => option[data.displayExpr]}
                    getOptionSelected={(option, value) => option.id === value[data.valueExpr]}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        value={initialText}
                        label={data.label}
                        onChange={handleInputChange}
                        variant="standard"
                    />
                    )}
                    onChange={handleItemSelected}
                />

                // <SelectBox dataSource={selectboxDatasource}
                //     fullWidth
                //     name={data.name}
                //     displayExpr={data.displayExpr}
                //     valueExpr={data.valueExpr}
                //     label={data.label}
                //     searchExpr={data.searchExpr}
                //     value={value}
                //     searchEnabled={true}
                //     searchMode='contains'
                //     searchTimeout={200}
                //     minSearchLength={3}
                //     showDataBeforeSearch={true}
                //     showClearButton={true}
                //     labelMode='floating'
                //     showSelectionControls={false}
                //     height='45px'
                //     ref={selectboxRef}
                //     onKeyDown={handleKeyDown}
                //     //onValueChanged={handleValueChange}
                //     onValueChanged={handleValueChange}
                //     dropDownButtonRender={dynaButton}
                //     //className='select-dyna-box-text'
                //     placeholder='Type atleast 3 chars to search...'
                //     stylingMode="underlined"
                // />
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
