import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging } from 'devextreme-react/data-grid';
import Data from './Data';
import DetailTemplate from './DetailTemplate';

export default function RebateParty(){
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
                        <Column dataField="RebatePartyName" width={300} caption="Rebate Party Name" />
                        <Column dataField="PAN" width={150} />
                        <Column dataField="TAN" width={150} />
                      </DataGrid>
        </>
    )
}