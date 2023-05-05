import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/data-grid';
function DetailTemplate(props){
        const { data:{data} } = props;
        console.log(data)
        return (
          <DataGrid
            dataSource={data}
            keyExpr="PartyContactId"
            showBorders={true} width='100%'
                        showRowLines={true}
                        showColumnLines={false}
                        useIcons={true}
                        rowAlternationEnabled={true}
                        allowColumnResizing={true} >
                        <Paging enabled={true} pageSize={7}/>
                        <Editing mode="batch" newRowPosition='last' allowAdding={true} allowUpdating={true} allowDeleting={true}/>
                        <Popup title="Party Address Info" showTitle={true} width={500} height={325} />

            <Column dataField="ContactName" caption="Contact Name" width={150}/>
            <Column dataField="Department" width={100}/>
            <Column dataField="Designation" width={100}/>
            <Column dataField="SkypeId" width={80}/>
            <Column dataField="EmailId" width={200}/>
            <Column dataField="MobileNumber" width={130}/>
            <Column dataField="DirectNumber" width={150} />
          </DataGrid>
        );
    
}
export default DetailTemplate