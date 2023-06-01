import axios from 'axios';

export const getAssignedGrants = (hdr,setGrantsObj) => {
    axios({
        method: 'get',
        url: "menu/assignedGrants", 
        headers: hdr
        }).then((response) => {
        //console.log('column details obj...',response.data);
        setGrantsObj(response.data);
        }).catch((error) => {
        console.log("getassignedgrants err",error);
    });
}

export const resolveControlGrant = (grantsObj,controlName) => {
    try{
        const filteredData = grantsObj.grants_controls.filter(row => row.FunctionPointName === controlName);
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