import axios from 'axios';

export const getAssignedGrants = (hdr,setGrantsObj) => {
    axios({
        method: 'get',
        url: "menu/assignedGrants", 
        headers: hdr
        }).then((response) => {
        console.log('column details obj...',response.data);
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