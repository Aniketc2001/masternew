import { DataGrid, Column, MasterDetail, SearchPanel, Editing, Paging,Form,Item } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/data-grid';
import Data from './Data';
import DetailTemplate from './DetailTemplate';

export default function PartyAddressEdit() {
    return (
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
                <Paging enabled={true} pageSize={7} />
                <SearchPanel visible={true} />
                <Editing mode="popup" newRowPosition='last' allowAdding={true} allowUpdating={true} allowDeleting={true} />
                <Popup title="Party Address Info" showTitle={true} width={500} height={325} />
                <Form>
                    <Item dataField="SiteCode" />
                    <Item dataField="Address1" />
                    <Item dataField="Address2" />
                    <Item dataField="Address3" />
                    <Item dataField="CityName" />
                    <Item dataField="Gstin" />
                    <Item dataField="HSNCode" />
                    <Item dataField="SACCode" />

                </Form>
                <Column dataField="SiteCode" width={150} caption="Site Code" />
                <Column dataField="Address1" width={150} caption="Address1" />
                <Column dataField="Address2" width={150} />
                <Column dataField="Address3" width={150} />
                <Column dataField="CityName" width={150} />
                <Column dataField="Gstin" />
                <MasterDetail
                    enabled={true}
                    component={DetailTemplate}
                />
            </DataGrid>
        </>
    )
}