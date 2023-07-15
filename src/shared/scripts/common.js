import axios from 'axios';

export const getAssignedGrants = (hdr,setGrantsObj) => {
    axios({
        method: 'get',
        url: "menu/assignedGrants", 
        headers: hdr
        }).then((response) => {
        // console.log('get assigned granss...',response.data);
        setGrantsObj(response.data);
        }).catch((error) => {
        console.log("getassignedgrants err",error);
    });
}

export const resolveControlGrant = (grantsObj,controlName) => {
    try{
        //console.log('grants obj',grantsObj);
        const filteredData = grantsObj.grants_controls.filter(row => row.FunctionPointName === controlName);
        //console.log('resolveControls ',filteredData,"length",filteredData.length > 0);
        return (filteredData.length > 0);
    }
    catch(ex){
        console.log("resolveControlGrant err",ex);
    }
    return false;
}

export const getFormattedDate = (dt) => {
    if(dt===null)return(null);

    const date = dt;

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    const formattedDate = `${day}-${month}-${year}`;
    
    return(formattedDate);   
}