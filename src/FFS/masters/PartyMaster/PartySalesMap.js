import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging } from 'devextreme-react/data-grid';
import Data from './Data';
import DetailTemplate from './DetailTemplate';

export default function PartySalesMap(){
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
                        <Editing mode="batch" newRowPosition='last' allowAdding={true} allowUpdating={true} allowDeleting={true}/>
                        <Column dataField="PartyName" width={200} caption="Party Name" />
                        <Column dataField="ProductName" width={200} />
                        <Column dataField="PartyAddressCode" width={200} caption="Site Code" />
                        <Column dataField="SalesPersonName" width={200} />
                      </DataGrid>
        </>
    )
}