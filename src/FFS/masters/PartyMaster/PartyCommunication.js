import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging, Lookup, FormItem, Form, Popup, Button } from 'devextreme-react/data-grid';
import Data from './Data';
import DetailTemplate from './PartyContact';
import { Row } from 'devextreme-react/responsive-box';
import { RequiredRule } from 'devextreme-react/form';
import { useState,useRef } from 'react';

export default function PartyCommunication({ baseObj,ancillaryData, PartyCommunications, PartyId }) {
  const dataGrid = useRef(null);
  const [refresh, setRefresh] = useState(false);

  console.log(baseObj.PartyCommunications)


  const renderDeleteStatus = (cellData) => {
    //console.log("celldata",cellData);
    return (
      <div>
        {cellData.data.MarkedForDelete === "Y" ? <i className={'bi-flag-fill'} style={{ color: 'red', fontSize: '10pt', marginRight: '5px' }} title="Marked for deletion" /> : <></>}
      </div>
    );
  }

  const markCommunicationRecordDelete = (e) => {
    const updatedData = baseObj.PartyCommunications.map(row => {
      console.log(row);
      if (row["PartyCommunicationId"] === e.row.data["PartyCommunicationId"]) {
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
    baseObj.PartyCommunications = updatedData;
    setRefresh(!refresh);
  }

  const markRecordEdit = (e) => {
    dataGrid.current.instance.editRow([e.row.rowIndex]);
  }

  return (
    <>
      <DataGrid id="grid-container"
        columnHidingEnabled={true}
        dataSource={baseObj.PartyCommunications}
        ref={dataGrid}
        keyExpr="PartyCommunicationId"
        showBorders={true} width='100%'
        showRowLines={true}
        showColumnLines={true}
        useIcons={true}
        rowAlternationEnabled={true}
        onInitNewRow={(e) => {
          // Set a default value for the key field when adding a new 
          const gridDataSource = e.component.getDataSource();
          let totalCount = -1 * gridDataSource.totalCount();
          //console.log(detailKeyFieldName,totalCount);
          e.data.PartyCommunicationId = totalCount;
          e.data.PartyId = PartyId;
          e.data.TriggerPointId = null;
          e.data.Active = 'Y';
          e.data.CheckerQueueId = 0;
          e.data.CheckerStatus = 'W';
          e.data.CreatedBy = 0;
          //  e.data.CreatedDate = null;
          e.data.ModifiedBy = 0;
          //  e.data.ModifiedDate = null;
          e.data.MarkedForDelete = 'N';
          e.data.TriggerPointName = "";
          e.data.TriggerPointCode = "";

        }}
        allowColumnResizing={true} >
        <Paging enabled={true} pageSize={7} />
        <SearchPanel visible={true} />
        <Editing mode="popup" newRowPosition='last' allowAdding={true} allowUpdating={true} allowDeleting={true} >
          <Form colCount={1} colSpan={2}>
          </Form>
          <Popup title="Party Communication Trigger Setup" showTitle={true} width={500} />
        </Editing>
        <Column caption="" cellRender={renderDeleteStatus} width={35} visible={true}>
          <FormItem visible={false} />
        </Column>

        <Column dataField="PartyCommunicationId" visible={false} defaultValue={-1} width={0} >
          <FormItem visible={false} />
        </Column>
        <Column dataField="PartyId" visible={false} width={0} defaultValue={0}>
          <FormItem visible={false} />
        </Column>

        <Column dataField="TriggerPointId" width={200} caption="Trigger Point" >
          <Lookup dataSource={ancillaryData.anc_triggerPoints} displayExpr="LookupItemName" valueExpr="LookupItemId" />
          <RequiredRule />
        </Column>

        <Column dataField="ToEmailIds" width={200}  editorOptions={{ maxLength: 500 }} >
          <RequiredRule />
        </Column>
        <Column dataField="CcEmailIds" width={100}  editorOptions={{ maxLength: 500 }} />
        <Column dataField="BccEmailIds" width={100} editorOptions={{ maxLength: 500 }}/>
        <Column type="buttons" width={100} >
          <Button name="FWEdit" text="Edit1" hint="Edit Record" onClick={markRecordEdit} >
              <i className={'bi-pencil-square'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
          </Button>          
          <Button name="FWdelete" text="Delete1" hint="Delete Record" onClick={markCommunicationRecordDelete} >
            <i className={'bi-trash3-fill'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
          </Button>

        </Column>

      </DataGrid>
    </>
  )
}
