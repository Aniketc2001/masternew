import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging, Lookup, FormItem, RequiredRule, Form, Button } from 'devextreme-react/data-grid';
import Data from './Data';
import { Popup } from 'devextreme-react/data-grid';
import { useState, useRef } from 'react';


function PartyContact({ data }) {
  const dataGrid = useRef(null);
  // const [refresh, setRefresh] = useState(false);

  // console.log("titles",contactTitles)
  console.log("contacts", data);


  // const renderDeleteStatus = (cellData) => {
  //   //console.log("celldata",cellData);
  //   return (
  //     <div>
  //       {cellData.data.MarkedForDelete === "Y" ? <i className={'bi-flag-fill'} style={{ color: 'red', fontSize: '10pt', marginRight: '5px' }} title="Marked for deletion" /> : <></>}
  //     </div>
  //   );
  // }

  // const markContactRecordDelete = (e) => {
  //   const updatedData = data.PartyContacts.map(row => {
  //     console.log(row);
  //     if (row["PartyContactId"] === e.row.data["PartyContactId"]) {
  //       //if(parseInt(row["PartyAddressId"]) < 0){
  //       var fg = row.MarkedForDelete === "Y" ? "N" : "Y";
  //       return { ...row, MarkedForDelete: fg };
  //       //}
  //       //else{
  //       //  dataGrid.current.instance.deleteRow([e.row.rowIndex]);
  //       //}
  //     }
  //     return row;
  //   });

  //   console.log(updatedData);
  //   //setBaseObj({...baseObj, PartyAddresses: updatedData});
  //   data.PartyContacts = updatedData;
  //   setRefresh(!refresh);
  // }

  const markRecordEdit = (e) => {
    dataGrid.current.instance.editRow([e.row.rowIndex]);
  }

  return (
    <DataGrid
      dataSource={data.data.PartyContacts}
      keyExpr="PartyContactId"
      showBorders={true} width='100%'
      ref={dataGrid}
      showRowLines={true}
      showColumnLines={false}
      useIcons={true}
      rowAlternationEnabled={true}
      onInitNewRow={(e) => {
        // Set a default value for the key field when adding a new 
        const gridDataSource = e.component.getDataSource();
        let totalCount = -1 * gridDataSource.totalCount();
        //console.log(detailKeyFieldName,totalCount);
        e.data.PartyContactId = totalCount;
        e.data.PartyAddressId = 0;
        e.data.ContactTitleId = 22;
        e.data.Active = 'Y';
        e.data.CheckerQueueId = 0;
        e.data.CheckerStatus = 'W';
        e.data.CreatedBy = 0;
        //   e.data.CreatedDate = null;
        e.data.ModifiedBy = 0;
        //e.data.ModifiedDate = null;
        e.data.DefaultContactFlag = 'N';
        e.data.MarkedForDelete = 'N';

      }}
      allowColumnResizing={true} >
      <Paging enabled={true} pageSize={7} />
      <Editing mode="popup" newRowPosition='last' allowAdding={true} allowUpdating={true} allowDeleting={false} >
        <Form colCount={1} colSpan={2}>
        </Form>
        <Popup title="Party Contact Info" showTitle={true} width={500} />
      </Editing>
      {/* <Column caption="" cellRender={renderDeleteStatus} width={35} visible={true}>
        <FormItem visible={false} />
      </Column> */}
      <Column dataField="ContactName" caption="Contact Name" width={150}>
        <RequiredRule />
      </Column>
      <Column dataField="Department" width={100} visible={false}>
        <FormItem visible={true} />
      </Column>
      <Column dataField="Designation" width={100} visible={false}>
        <FormItem visible={true} />
      </Column>
      <Column dataField="SkypeId" width={80} visible={false}>
        <FormItem visible={true} />
      </Column>
      <Column dataField="EmailId" width={100}>
        <RequiredRule />
      </Column>
      <Column dataField="MobileNumber" width={120} >
        <RequiredRule />
      </Column>
      <Column dataField="DirectNumber" width={100} />
      <Column type="buttons" width={100} >
          <Button name="FWEdit" text="Edit1" hint="Edit Record" onClick={markRecordEdit} >
              <i className={'bi-pencil-square'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
          </Button>

          <Button name="FWdelete" text="Delete1" hint="Delete Record"  >
              <i className={'bi-trash3-fill'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
          </Button>

      </Column>

    </DataGrid>
  );

}
export default PartyContact