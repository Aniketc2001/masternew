import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging, Lookup, FormItem, Form, Popup,Button  } from 'devextreme-react/data-grid';
import Data from './Data';
import DetailTemplate from './PartyContact';
import { RequiredRule } from 'devextreme-react/form';
import { useState,useRef } from 'react';

export default function PartySalesMap({ ancillaryData, PartySalesMaps,baseObj }) {
  const dataGrid = useRef(null);
  const [refresh, setRefresh] = useState(false);

  
  const addressDropdownColumns = [
    { dataField: 'PartyAddressCode', caption: 'SiteCode' },
    { dataField: 'PartyAddressName', caption: 'Address' }
  ];


  console.log(baseObj.PartySalesMaps)


  const renderDeleteStatus = (cellData) => {
    //console.log("celldata",cellData);
    return (
      <div>
        {cellData.data.MarkedForDelete === "Y" ? <i className={'bi-flag-fill'} style={{ color: 'red', fontSize: '10pt', marginRight: '5px' }} title="Marked for deletion" /> : <></>}
      </div>
    );
  }

  const markRecordDelete = (e) => {
    const updatedData = baseObj.PartySalesMaps.map(row => {
      console.log(row);
      if (row["PartySalesMapId"] === e.row.data["PartySalesMapId"]) {
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
    baseObj.PartySalesMaps = updatedData;
    setRefresh(!refresh);
  }

  const markRecordEdit = (e) => {
    dataGrid.current.instance.editRow([e.row.rowIndex]);
  }

  const getDisplayExpr = (item) => {
    return item ? `${item.PartyAddressName}` + (item.Address1? " - (" : "  " ) + `${item.Address1}`+ (item.Address1? ")" : "" )  : '';
  }

  const fieldDisp = (item) => {
    console.log(item);
  }

  return (
    <>
      <DataGrid id="grid-container"
        dataSource={baseObj.PartySalesMaps}
        ref={dataGrid}
        keyExpr="PartySalesMapId"
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
          e.data.PartySalesMapId = totalCount;
          e.data.PartyId = 0;
          e.data.ProductId = 0;
          e.data.PartyAddressId = 0;
          e.data.SalesPersonId = null;
          e.data.Active = 'Y';
          e.data.CheckerQueueId = 0;
          e.data.CheckerStatus = 'W';
          e.data.CreatedBy = 0;
          // e.data.CreatedDate = null;
          e.data.ModifiedBy = 0;
          // e.data.ModifiedDate = null;
          e.data.MarkedForDelete = 'N';
          e.data.AddressTypeCode = "";
          e.data.AddressTypeName = "";
          e.data.CityCode = "";
          e.data.SiteCode = "";

        }}
        allowColumnResizing={true} >
        <Paging enabled={true} pageSize={7} />
        <SearchPanel visible={true} />
        <Editing mode="popup" newRowPosition='last' allowAdding={true} allowUpdating={true} allowDeleting={true} >
          <Form colCount={1} colSpan={2}>
          </Form>
          <Popup title="Party Sales Mapping Info" showTitle={true} width={500} />
        </Editing>
        <Column caption="" cellRender={renderDeleteStatus} width={35} visible={true}>
          <FormItem visible={false} />
        </Column>
        <Column dataField="PartySalesMapId" visible={false} width={0} >
          <FormItem visible={false} />
        </Column>
        <Column dataField="PartyId" visible={false} width={0} >
          <FormItem visible={false} />
        </Column>
        <Column dataField="ProductId" visible={true} width={200} caption="Product">
          <Lookup dataSource={ancillaryData.anc_products} displayExpr="ProductName" valueExpr="ProductId" />
          <RequiredRule />
          <FormItem visible={true}  >

          </FormItem>
        </Column>
        <Column dataField="PartyAddressId" visible={true} width={200} caption="Address" >
            <Lookup dataSource={ancillaryData.anc_addresses} 
              displayExpr={getDisplayExpr}
              valueExpr="PartyAddressId"
              fieldRender={fieldDisp} 
               />
          <RequiredRule />
          <FormItem visible={true} />
        </Column>

        <Column dataField="SalesPersonId" visible={true} width={200} caption="Sales Person">
          <Lookup dataSource={ancillaryData.anc_salesPeople} displayExpr="SalesPersonName" valueExpr="SalesPersonId" />
          <RequiredRule />
          <FormItem visible={true} >

          </FormItem>
        </Column>
        <Column type="buttons" width={100} >
          <Button name="FWEdit" text="Edit1" hint="Edit Record" onClick={markRecordEdit} >
              <i className={'bi-pencil-square'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
          </Button>          
          <Button name="FWdelete" text="Delete1" hint="Delete Record" onClick={markRecordDelete} >
            <i className={'bi-trash3-fill'} style={{ color: 'indigo', fontSize: '10pt', marginRight: '5px', cursor: 'pointer' }} />
          </Button>
        </Column>


      </DataGrid>
    </>
  )
}