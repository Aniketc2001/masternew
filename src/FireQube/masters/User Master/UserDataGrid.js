import { alert, confirm } from "devextreme/ui/dialog";
import { CheckBox } from "devextreme-react";
import {
  DataGrid,
  Column,
  SearchPanel,
  Editing,
  Paging,
  Lookup,
  Popup,
  Form,
} from "devextreme-react/data-grid";
import { useState, useRef } from "react";
import { RequiredRule } from "devextreme-react/form";

export default function UserDataGrid({ baseObj, ancillaryData ,setBaseObj}) {
  const dataGrid = useRef();
  const popupRef = useRef();
  const defaultAppDatasource = [
    {
      value:'Y',
      text:'Primary'
    },
    {
      value:'N',
      text:'Secondary'
    }
  ]

  const handlePostSaved = (e) => {
    console.log('Post Saved e',e);
    var appId;
    var DefaultAppFlag;
    const updatedData = e.changes.map((change) => change.data);
    if(updatedData[0] !== undefined ){
      appId= updatedData[0].AppId;
      DefaultAppFlag = updatedData[0].DefaultAppFlag;
    }

    const tempBaseObj = baseObj.SystemUserApps.map(data=>{
      if(data.AppId === appId && DefaultAppFlag === 'Y'){
        data.DefaultAppFlag = 'Y';
      } 
      else{
        data.DefaultAppFlag = 'N';
      }
      return data;
    });
    setBaseObj({...baseObj,SystemUserApps:tempBaseObj});
  }


  const handleSavingChanges = (e) => {

    var appId;
      try {
    const updatedData = e.changes.map((change) => change.data);
    let duplicateEntries = [];
    if(updatedData[0] !== undefined ){
       duplicateEntries = updatedData.filter((data) => {
        console.log('upd',updatedData);
        appId = data.AppId;
        console.log('appId',appId);
        return baseObj.SystemUserApps.some((app) => app.AppId === data.AppId);
      });
    }
    if (duplicateEntries.length > 0) {
      e.cancel = true;
      dataGrid.current.instance.cancelEditData();
      const duplicateAppNames = ancillaryData.anc_apps.find(
        (entry) => entry.AppId === duplicateEntries[0].AppId
      );
      alert(
        `The ${duplicateAppNames.AppName} app is already created.`,
        "Duplicate App Error"
      );
    }
      
    console.log('sym', baseObj.SystemUserApps);

    } catch (error) {
      console.log("error", error);
    }
  };

  const filteredAccessLevel = (options) => {
    return {
      store: ancillaryData.anc_accessLevels,
      filter: options.data ? ["AppId", "=", options.data.AppId] : null,
    };
  };

  const onEditorPreparing = (e) => {
    if (e.parentType === "dataRow" && e.dataField === "AccessLevelId") {
      e.editorOptions.disabled = typeof e.row.data.AppId !== "number";
    }
  };

  const setAppValue = (rowData, value) => {
    rowData.AccessLevelId = null;
    rowData.AppId = value;
  }



  return (
    <div>
      <DataGrid
        dataSource={baseObj.SystemUserApps}
        ref={dataGrid}
        keyExpr="SystemUserAppId"
        showBorders={true}
        width="75%"
        showRowLines={true}
        showColumnLines={true}
        useIcons={true}
        rowAlternationEnabled={true}
        allowColumnResizing={true}
        onInitNewRow={(e) => {
          var rows = dataGrid.current.instance.getVisibleRows();
          var visibleRows = rows.filter(function (row) {
            return row.rowType === "data";
          });
          var rowCount = visibleRows.length + 1;
          let totalCount = -1 * rowCount;
          e.data.SystemUserAppId = totalCount;
          e.data.SystemUserId = 0;
          e.data.CheckerQueueId = 0;
          e.data.CheckerStatus = "A";
          e.data.CreatedBy = 0;
          e.data.CreatedDate = "2023-05-25T17:39:31.433";
          e.data.ModifiedBy = 0;
          e.data.ModifiedDate = "2023-06-01T12:24:31.937";
          e.data.MarkedForDelete = "N";
          e.data.DefaultAppFlag = "N";
        }}
        onSaving={handleSavingChanges}
        onSaved={handlePostSaved}
        onEditorPreparing={onEditorPreparing}
      >
        <Paging enabled={true} pageSize={7} />
        <SearchPanel visible={true} />
        <Editing
          mode="popup"
          newRowPosition="last"
          allowAdding={true}
          allowUpdating={true}
          allowDeleting={true}
        >
          <Form colCount={1} colSpan={2}></Form>
          <Popup
            title="Assign apps and Access Levels"
            showTitle={true}
            width={500}
            ref={popupRef}
          ></Popup>
        </Editing>

        <Column dataField="AppId" setCellValue={setAppValue} width={350} caption="App">
          <Lookup
            dataSource={ancillaryData.anc_apps}
            displayExpr="AppName"
            valueExpr="AppId"
          />
          <RequiredRule />
        </Column>
        <Column dataField="AccessLevelId" width={350} caption="Access Level">
          <Lookup
            dataSource={filteredAccessLevel}
            displayExpr="AccessLevelName"
            valueExpr="AccessLevelId"
          />
          <RequiredRule />
        </Column>
        <Column dataField="DefaultAppFlag" caption="Default App" width={125}>
            <Lookup dataSource={defaultAppDatasource} valueExpr="value" displayExpr="text" />
          </Column>
      </DataGrid>
    </div>
  );
}
