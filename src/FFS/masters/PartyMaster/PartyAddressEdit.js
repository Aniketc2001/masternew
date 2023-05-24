import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging, Form, Item, Lookup, FormItem, Popup, Button } from 'devextreme-react/data-grid';
import Data from './Data';
import PartyContact from './PartyContact';
import { RequiredRule } from 'devextreme-react/form';
import { useState, useEffect, useRef } from "react";
import { CheckBox } from 'devextreme-react/check-box';
import { alert, confirm } from 'devextreme/ui/dialog';

export default function PartyAddressEdit({ baseObj, ancillaryData, PartyAddresses, onPartyAddressChange }) {
    const dataGrid = useRef(null);
    const [refresh, setRefresh] = useState(false);
    const [cityGST, setCityGST] = useState(null);
    const [validationRules, setValidationRules] = useState({
        gst: [
          {
            type: 'required',
            message: 'GST is required',
          },
          {
            type: 'custom',
            message: "GST No. should start with the selected City's State code",
            validationCallback: (params) => {
              const { value, data } = params;
              console.log('validation call',params);
              const cityId = data.CityId;
              const selectedCity = ancillaryData.anc_cities.find((city) => city.id === cityId);
              const cityCode = selectedCity ? selectedCity.code : '';
    
              return value.startsWith(cityCode);
            },
          },
        ],
      });
    
    const displayFlags = [
        { value: 'Y', text: 'Active' },
        { value: 'N', text: 'Inactive' },
      ];

    //console.log("titles 1", ancillaryData.anc_contactTitles);

    //console.log(PartyAddresses)

    const renderDeleteStatus = (cellData) => {
        //console.log("celldata",cellData);
        return (
            <div>
                {cellData.data.MarkedForDelete === "Y" ? <i className={'bi-flag-fill'} style={{ color: 'red', fontSize: '10pt', marginRight: '5px' }} title="Marked for deletion" /> : <></>}
            </div>
        );
    }

    const markAddressRecordDelete = (e) => {
        const updatedData = baseObj.PartyAddresses.map(row => {
            console.log(row);
            if (row["PartyAddressId"] === e.row.data["PartyAddressId"]) {
                //if(parseInt(row["PartyAddressId"]) < 0){
                var fg = row.MarkedForDelete === "Y" ? "N" : "Y";
                return { ...row, MarkedForDelete: fg };
                //}
                //else{
                //  dataGrid.current.instance.deleteRow([e.row.rowIndex]);
                //}
            }
            return row;
        });

        console.log(updatedData);
        //setBaseObj({...baseObj, PartyAddresses: updatedData});
        baseObj.PartyAddresses = updatedData;
        setRefresh(!refresh);
    }

    const markAddressRecordEdit = (e) => {
        dataGrid.current.instance.editRow([e.row.rowIndex]);
    }

    const renderActiveStatus = (e) => {
        return (
            <CheckBox defaultValue={e.data.Active==="Y"?true:false}  readOnly />
        );
    }

    const handleCityChange = (e) => {
        const { dataField, value, component } = e;
        console.log("e",e);
        var cityid = e.value;
        const selectedCity = ancillaryData.anc_cities.find((city) => city.CityId === cityid);
        console.log("selected city",ancillaryData.anc_cities,selectedCity);
        if(selectedCity){
            console.log('setting city gst',selectedCity);
            setCityGST(selectedCity);
        }
        else{
            console.log('nothing to set in city gst...');
            setCityGST(null);
        }
    };

    const handleGstChange = (e) => {
        const { dataField, value, component } = e;
        //console.log("e1",e,cityGST,'gstcode',cityGST.GstStateCode);

        var gst = e.value;
        if(gst !== '')
            if(gst.substr(0,2) !== cityGST.GstStateCode){
                alert("GST State code does not match with the selected city's state! [" + cityGST.GstStateCode + "]" ,'GST State Validation')
            }
    };

    
    

    const CustomEditCell = (props) => {
        const { value, onValueChange } = props;
        //console.log(props);
        const isChecked = value === "Y"; // Convert the string value to a boolean for the checkbox
      
        const handleValueChange = (newValue) => {
          console.log('new value',newValue,props);
          const updatedValue = newValue ? "Y" : "N"; // Convert the boolean value to the string representation
          props.value = newValue.value === true?"Y":"N";
          props.data.Active = props.value;
        };
      
        return (
          <CheckBox
            value={isChecked}
            onValueChanged={handleValueChange}
          />
        );
    };

    return (
        <>
            <DataGrid id="grid-container" width="100%"
                dataSource={baseObj.PartyAddresses}
                ref={dataGrid}
                keyExpr="PartyAddressId"
                showBorders={true}
                showRowLines={true}
                showColumnLines={true}
                useIcons={true}
                rowAlternationEnabled={true}
                allowColumnResizing={true}
                onEditorPreparing={(e) => {
                    if (e.dataField === 'Gstin') {
                      e.editorOptions.onValueChanged = handleGstChange;
                    }
                    if (e.dataField === 'CityId') {
                        e.editorOptions.onValueChanged = handleCityChange;
                      }
  
                  }}
                onInitNewRow={(e) => {
                    // Set a default value for the key field when adding a new 
                    const gridDataSource = e.component.getDataSource();
                    let totalCount = -1 * gridDataSource.totalCount();
                    //console.log(detailKeyFieldName,totalCount);
                    e.data.PartyAddressId = totalCount;
                    e.data.PartyId = 0;
                    e.data.AddressTypeId = null;
                    e.data.CityId = null;
                    e.data.PartyContacts = [
                        // {
                        //     "PartyContactId": 0,
                        //     "PartyAddressId": 0,
                        //     "ContactTitleId": null,
                        //     "ContactName": "",
                        //     "Department": "",
                        //     "Designation": "",
                        //     "SkypeId": "",
                        //     "EmailId": "",
                        //     "MobileNumber": "",
                        //     "DirectNumber": "",
                        //     "DefaultContactFlag": "N",
                        //     "CreatedBy": 0,
                        //     "ModifiedBy": 0,
                        //     "MarkedForDelete": "N"
                        // }
                    ]
                    e.data.Active = 'Y';
                    e.data.CheckerQueueId = 0;
                    e.data.CheckerStatus = 'W';
                    e.data.CreatedBy = 0;
                    //  e.data.CreatedDate = "";
                    e.data.ModifiedBy = 0;
                    // e.data.ModifiedDate = "";
                    e.data.MarkedForDelete = 'N';
                    e.data.AddressTypeCode = "";
                    e.data.AddressTypeName = "";
                    e.data.CityCode = "";
                    e.data.SiteCode = "";
                    console.log(e.data);
                }} >
                <Paging enabled={true} pageSize={7} />
                <SearchPanel visible={true} />
                <Editing mode="popup" newRowPosition='last' allowAdding={true} allowUpdating={true} allowDeleting={true} >
                    <Form colCount={2} colSpan={2}>
                    </Form>
                    <Popup title="Party Address Info" showTitle={true} width={900} height={500}/>
                </Editing>
                <Column caption="" cellRender={renderDeleteStatus} width={35} visible={true}>
                    <FormItem visible={false} />
                </Column>

                <Column dataField="AddressTypeId" caption="Address Type" width={150} isRequired={true}>
                    <Lookup dataSource={ancillaryData.anc_addressTypes} displayExpr="LookupItemName" valueExpr="LookupItemId" />
                    <RequiredRule />
                </Column>
                <Column dataField="SiteCode" width={150} caption="Site Code" visible={true}  editorOptions={{ maxLength: 50 }}>
                    <RequiredRule />
                    <FormItem visible={true} />
                </Column>

                <Column dataField="SiteName" width={150} caption="Site Name" visible={true}  editorOptions={{ maxLength: 100 }}>
                    <RequiredRule />
                    <FormItem visible={true} />
                </Column>
                <Column dataField="Address1" width={150} caption="Address1" visible={false} editorOptions={{ maxLength: 50 }}>
                    <FormItem visible={true} />
                </Column>
                <Column dataField="Address2" width={150} visible={false}  editorOptions={{ maxLength: 50 }}>
                    <FormItem visible={true} />
                </Column>
                <Column dataField="Address3" width={150} visible={false}  editorOptions={{ maxLength: 50 }}>
                    <FormItem visible={true} />
                </Column>
                <Column dataField="CityId" caption="City" width={150} >
                    <Lookup dataSource={ancillaryData.anc_cities} displayExpr="CityName" valueExpr="CityId" />
                    <RequiredRule />
                    <FormItem visible={true} />
                </Column>
                <Column dataField="PinCode" visible={false} caption="Pin Code" >
                    <RequiredRule />
                    <FormItem visible={true} />
                </Column>
                <Column dataField="CityName" caption="CityName" visible={false}>
                    <FormItem visible={false} />
                </Column>
                <Column dataField="CityCode" visible={false} width={0} >
                    <FormItem visible={false} />
                </Column>
                <Column dataField="Gstin" visible={false}>
                    <FormItem visible={true} />
                </Column>
                <Column dataField="Active" caption="Active" visible={true} width={50} 
                    cellRender={renderActiveStatus} 
                    editCellRender={CustomEditCell}>
                    <FormItem visible={true} />
                </Column>
                <Column type="buttons" width={100} >
                    <Button name="FWEdit" text="Edit1" hint="Edit Record" onClick={markAddressRecordEdit} >
                        <i className={'bi-pencil-square'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
                    </Button>

                    <Button name="FWdelete" text="Delete1" hint="Delete Record" onClick={markAddressRecordDelete} >
                        <i className={'bi-trash3-fill'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
                    </Button>

                </Column>
                <MasterDetail enabled={true} component={PartyContact}>

                </MasterDetail>


            </DataGrid>
        </>
    )
}


{/* <MasterDetail
enabled={true}
component={DetailTemplate}
/> */}