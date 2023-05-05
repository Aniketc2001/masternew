import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging } from 'devextreme-react/data-grid';
import Data from './Data';
import DetailTemplate from './DetailTemplate';

export default function PartyCommunication(){
    return(
        <>
                      <DataGrid id="grid-container"
                        dataSource={Data}
                        keyExpr="ID"
                        showBorders={true} width='100%'
                        showRowLines={true}
                        showColumnLines={false}
                        useIcons={true}
                        rowAlternationEnabled={true}
                        allowColumnResizing={true} >
                        <Paging enabled={true} pageSize={7}/>
                        <SearchPanel visible={true}/>
                        <Editing mode="popup" newRowPosition='last' allowAdding={true} allowUpdating={true} allowDeleting={true}/>
                        <Column dataField="TriggerPointId" width={200} caption="Trigger Point" />
                        <Column dataField="ToEmailIds" width={200} />
                        <Column dataField="CcEmailIds" width={200} />
                        <Column dataField="BccEmailIds" width={200} />
                      </DataGrid>
        </>
    )
}
