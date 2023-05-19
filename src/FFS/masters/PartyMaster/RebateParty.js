import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging, FormItem, Form, Popup, Button, Lookup } from 'devextreme-react/data-grid';
import Data from './Data';
import DetailTemplate from './PartyContact';
import { useState, useEffect,useRef } from 'react';
import { RequiredRule } from 'devextreme-react/form';


export default function RebateParty({ RebateParties, baseObj, ancillaryData }) {
  const dataGrid = useRef(null);
  const [refresh, setRefresh] = useState(false);

  console.log(baseObj.RebateParties)


  const renderDeleteStatus = (cellData) => {
    //console.log("celldata",cellData);
    return (
      <div>
        {cellData.data.MarkedForDelete === "Y" ? <i className={'bi-flag-fill'} style={{ color: 'red', fontSize: '10pt', marginRight: '5px' }} title="Marked for deletion" /> : <></>}
      </div>
    );
  }

  const markCommunicationRecordDelete = (e) => {
    const updatedData = baseObj.RebateParties.map(row => {
      console.log(row);
      if (row["RebatePartyId"] === e.row.data["RebatePartyId"]) {
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
    baseObj.RebateParties = updatedData;
    setRefresh(!refresh);
  }

  const markRecordEdit = (e) => {
    dataGrid.current.instance.editRow([e.row.rowIndex]);
  }

  return (
    <DataGrid id="grid-container"
      dataSource={baseObj.RebateParties}
      keyExpr="RebatePartyId"
      ref={dataGrid}
      showBorders={true}
      width='100%'
      showRowLines={true}
      showColumnLines={true}
      useIcons={true}
      rowAlternationEnabled={true}
      onInitNewRow={(e) => {
        const gridDataSource = e.component.getDataSource();
        let totalCount = -1 * gridDataSource.totalCount();
        e.data.RebatePartyId = totalCount;
        e.data.Active = 'Y';
        e.data.CheckerQueueId = 0;
        e.data.CheckerStatus = 'W';
        e.data.CreatedBy = 0;
        e.data.ModifiedBy = 0;
        e.data.MarkedForDelete = 'N';
        e.data.RebatePartyTypeId = null ;
      }}
      allowColumnResizing={true} >
      <Paging enabled={true} pageSize={7} />
      <SearchPanel visible={true} />
      <Editing mode="popup" newRowPosition='last' allowAdding={true} allowUpdating={true} allowDeleting={true} >
        <Form colCount={1} colSpan={2}>
        </Form>
        <Popup title="Rebate Party Info" showTitle={true} width={500} />
      </Editing>
      <Column caption="" cellRender={renderDeleteStatus} width={35} visible={true}>
        <FormItem visible={false} />
      </Column>
      <Column dataField="RebatePartyName" width={300} caption="Rebate Party Name" >
        <RequiredRule />
      </Column>
      <Column dataField="RebatePartyTypeId" caption="Rebate Party Type" width={150} isRequired={true}>
            <Lookup dataSource={ancillaryData.anc_rebatePartyTypes} displayExpr="LookupItemName" valueExpr="LookupItemId" />
            <RequiredRule />
      </Column>      
      <Column dataField="Pan" width={150} />
      <Column dataField="Tan" width={150} />
      <Column type="buttons" width={100} >
        <Button name="FWEdit" text="Edit1" hint="Edit Record" onClick={markRecordEdit} >
            <i className={'bi-pencil-square'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
        </Button>   
        <Button name="FWdelete" text="Delete1" hint="Delete Record" onClick={markCommunicationRecordDelete} >
          <i className={'bi-trash3-fill'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
        </Button>

      </Column>
    </DataGrid>
  )
}
