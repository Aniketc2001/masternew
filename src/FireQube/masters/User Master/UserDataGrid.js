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

export default function UserDataGrid({ baseObj, ancillaryData }) {
  const dataGrid = useRef();
  const popupRef = useRef();
  let defaultApp = false;

  const renderActiveStatus = (e) => {
    return (
      <CheckBox
        value={e.data.DefaultAppFlag === "Y" ? true : false}
        readOnly
      />
    );
  };



  const CustomEditCell = (props) => {
    const { value, onValueChange } = props;
    console.log('custom edit value...',value);
    const isChecked = value === "Y"; // Convert the string value to a boolean for the checkbox

    const handleValueChange = (newValue) => {
      props.value = newValue.value === true ? "Y" : "N";
      props.data.DefaultAppFlag = props.value;
      if (props.data.DefaultAppFlag === 'Y' && baseObj.SystemUserApps.length > 0) {
        baseObj.SystemUserApps.map(data => {
          if (data.SystemUserAppId === props.data.SystemUserAppId) {
            data.DefaultAppFlag = 'Y';
          } else {
            data.DefaultAppFlag = 'N';
          }
          return data;
        });
        const filterDefaultApp = baseObj.SystemUserApps.filter((data) => {
          return data.DefaultAppFlag === "Y";
        });
        // If we set newly inserted app as defaultApp
        if (filterDefaultApp.length === 0) {
          defaultApp = true;
        }
      } else if (props.data.DefaultAppFlag === 'N' && baseObj.SystemUserApps.length > 0) {
        baseObj.SystemUserApps.map(data => {
          if (data.SystemUserAppId === props.data.SystemUserAppId) {
            data.DefaultAppFlag = 'N';
          }
          return data;
        });
      } else if (props.data.DefaultAppFlag === 'Y') {
        defaultApp = true;
      }
    };

    return (
      <CheckBox
        value={isChecked}
        onValueChanged={handleValueChange}
      />
    );
  };

  const handleSavingChanges = (e) => {
    try {
    const updatedData = e.changes.map((change) => change.data);
    let duplicateEntries = [];
    if(updatedData[0] !== undefined ){
       duplicateEntries = updatedData.filter((data) => {
        console.log('upd',updatedData);
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
    if (defaultApp) {
      updatedData[0].DefaultAppFlag = 'Y';
    }
    console.log('sym', baseObj.SystemUserApps);
    defaultApp = false;
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
        <Column
          dataField="DefaultAppFlag"
          caption="Default App"
          visible={true}
          cellRender={renderActiveStatus}
          editCellRender={CustomEditCell}
        ></Column>
      </DataGrid>
    </div>
  );
}
