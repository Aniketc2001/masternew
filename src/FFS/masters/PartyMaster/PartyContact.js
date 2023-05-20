import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging, Lookup, FormItem, RequiredRule, Form, Button,CellTemplate } from 'devextreme-react/data-grid';
import Data from './Data';
import { Popup } from 'devextreme-react/data-grid';
import { useState, useRef } from 'react';


function PartyContact({ data }) {
  const dataGrid = useRef(null);
  const [contactdata,setContactData] = useState(data.data.PartyContacts);

  const [refresh, setRefresh] = useState(false);

  const displayFlags = [
    { value: 'Y', text: 'Yes' },
    { value: 'N', text: 'No' },
  ];
  

  // console.log("titles",contactTitles)
  console.log("contacts", contactdata);


  const renderDeleteStatus = (cellData) => {
    //console.log("celldata",cellData);
    return (
      <div>
        {cellData.data.MarkedForDelete === "Y" ? <i className={'bi-flag-fill'} style={{ color: 'red', fontSize: '10pt', marginRight: '5px' }} title="Marked for deletion" /> : <></>}
      </div>
    );
  }

  const markRecordDelete = (e) => {
    const updatedData = contactdata.map(row => {
      console.log(row);
      if (row["PartyContactId"] === e.row.data["PartyContactId"]) {
        var fg = row.MarkedForDelete === "Y" ? "N" : "Y";
        return { ...row, MarkedForDelete: fg };
      }
      return row;
    });

    console.log(updatedData);
    setContactData(updatedData);
    setRefresh(!refresh);
  }

  const markRecordEdit = (e) => {
    dataGrid.current.instance.editRow([e.row.rowIndex]);
  }

  const handleCheckBoxValueChanged = (e) => {
    const rowKey = e.row.data.id; // assuming the unique identifier of each row is 'id'
    const isSelected = e.value;

    if (isSelected) {
      setContactData([...contactdata, rowKey]);
    } else {
      setContactData(contactdata.filter((key) => key !== rowKey));
    }
  };

  return (
    <DataGrid
      dataSource={contactdata}
      keyExpr="PartyContactId"
      showBorders={true} width='100%'
      ref={dataGrid}
      showRowLines={true}
      showColumnLines={true}
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
      <Column caption="" cellRender={renderDeleteStatus} width={35} visible={true}>
        <FormItem visible={false} />
      </Column> 
      <Column dataField="ContactName" caption="Contact Name" width={150}  editorOptions={{ maxLength: 100 }}>
        <RequiredRule />
      </Column>
      <Column dataField="Department" width={100} visible={false}  editorOptions={{ maxLength: 50 }}>
        <FormItem visible={true} />
      </Column>
      <Column dataField="Designation" width={100} visible={false}  editorOptions={{ maxLength: 50 }}>
        <FormItem visible={true} />
      </Column>
      <Column dataField="SkypeId" width={80} visible={false}  editorOptions={{ maxLength: 100 }}>
        <FormItem visible={true} />
      </Column>
      <Column dataField="EmailId" width={100}  editorOptions={{ maxLength: 100 }}>
        <RequiredRule />
      </Column>
      <Column dataField="MobileNumber" width={120}  editorOptions={{ maxLength: 25 }}>
        <RequiredRule />
      </Column>
      <Column dataField="DirectNumber" width={100}  editorOptions={{ maxLength: 25 }}/>
      <Column
        dataField="DefaultContactFlag" caption="Default Contact?"
        width={100} visible={true}   lookup={{
          dataSource: displayFlags,
          valueExpr: 'value',
          displayExpr: 'text'
        }}
      >
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
  );

}
export default PartyContact