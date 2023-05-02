import * as React from 'react';
import {Box, Paper, Grid, ToggleButton, ToggleButtonGroup} from '@mui/material';
import '../../shared/styles/dx-styles.css';
import { alert, custom, confirm  } from 'devextreme/ui/dialog';
import DataGrid, {
    Column,
    Button,
    Editing,
    Grouping,
    SearchPanel,
    GroupPanel,
    Popup,
    Paging,
    Lookup,
    Form,
    FilterRow,
    HeaderFilter,
    Export,
    ColumnChooser,
    Font,
    Selection
  } from 'devextreme-react/data-grid';



import BxButton  from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

import { useEffect,useState } from 'react';
import axios from 'axios';


function RenderCheckerStatus(cellData) {
    console.log(cellData);
    return (
      <div>
            {cellData.data.CheckerStatus=="W" ? 
                <i className={'bi-flag-fill'} style={{color:'darkorange', fontSize: '10pt', marginRight: '5px'}} alt-text='{cellData.data.CheckerStatus}'/>
            :cellData.data.CheckerStatus=="R" ? 
                <i className={'bi-flag-fill'} style={{color:'green', fontSize: '10pt', marginRight: '5px'}} alt-text='{cellData.data.CheckerStatus}'/>    
                :
                <i className={'bi-flag'} style={{color:'lightgray', fontSize: '10pt', marginRight: '5px'}} alt-text='{cellData.data.CheckerStatus}'/>    
            }
      </div>
    );
  }

function RenderActiveStatus(cellData) {
    console.log(cellData);
    return (
      <div>
            {cellData.data.Active=="N" ? <i className={'bi-hourglass-split'} style={{color:'brown', fontSize: '10pt', marginRight: '5px'}} />:<></>}
      </div>
    );
  }
 

export default function EmployeeList() {
    const [Employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const [displayPageSize, setdisplayPageSize] = useState(12);
    const [displayFilterRow, setdisplayFilterRow] = useState(true);
    const [displayGroupPanel, setdisplayGroupPanel] = useState(true);
    
    const [columnDisplayMap, setcolumnDisplayMap] = useState({
        columns: [
            {name: 'FirstName', visibility: true},
            {name: 'LastName', visibility: false},
        ]
    }
    )

    const getEmployees = async () => {
        try {
          let response = await axios.get("http://localhost:8000/employees", []);
          console.log('getemployees');
          console.log(response.data);
          setEmployees(response.data);
        } catch (error) {
          console.log("Error occured while fetching data. Error message - " + error.message);
        }
      }

    const showDialog = () => {
        const vl = confirm('Confirm record deletion?','Confirmation Alert');
        vl.then((dialogResult) => {
            if(dialogResult){
                alert("Selected records are now marked for deletion.", "Delete Confirmation");
            }
        });
        //myDialog.show();
    }

     
    
      const deleteEmployee = async (id) => {
        try {
          await axios.delete("http://localhost:8000/employees/" + id, []);
          getEmployees();
        } catch (error) {
          console.log("Error occured while deleting data. Error message - " + error.message);
        }  
      }

      const newIconClick = () => {
        navigate(`/empEdit/0`);

      }


      const editIconClick = (e) => {
        console.log(e.row);
        navigate(`/empEdit/${e.row.key}`);

      }


      const deleteIconClick = (e) => {
        console.log(e.row);
      }

      const rowSelectionFunction = ({ selectedRowsData }) => {
        console.log(selectedRowsData[0]);

      }
      

      const getColumnVisibility = (columnName) => {
        const item = columnDisplayMap.columns.find(item => item.name === columnName);
        //console.log(item);
        if (item) {
          return item.visibility; 
        } else {
          return true;
        }     
           
  }


  
  useEffect(() => {
    getEmployees();
  }, []);

  

    return (
       <Box elevation={6} sx={{ p: 1,  paddingTop: 2, backgroundColor: 'white' }}>
             <h3>Employees Master using DevExtreme</h3>
             <br/>
             <Grid container spacing={1} >
                  <Grid item xm={1} >
                    <BxButton
                      type="primary"
                      size="sm"
                      style={{ textTransform: "none"}}
                      onClick={newIconClick}
                    >
                      <i className={'bi-save'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
                      Create New
                    </BxButton>
                  </Grid>
                  <Grid item xm={1}>
                    <BxButton
                      type="contained"
                      size="sm"
                      style={{ textTransform: "none" }}
                      onClick={showDialog}
                    >
                      <i className={'bi-x-circle'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
                      Delete Records
                    </BxButton>
                  </Grid>                  
                  <Grid item xm={1}>
                    <BxButton
                      type="contained"
                      size="sm"
                      style={{ textTransform: "none" }}
                    >
                      <i className={'bi-calendar2-x'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
                      Active
                    </BxButton>
                  </Grid>
                  <Grid item xm={1}>
                    <BxButton
                      type="contained"
                      variant="secondary"
                      size="sm"
                      style={{ textTransform: "none" }}
                      color="success"
                    >
                      <i className={'bi-card-checklist'} style={{color:'white', fontSize: '10pt', marginRight: '10px'}} />
                      Inactive
                    </BxButton>
                  </Grid>
                  <Grid item xm={1}>
                    <BxButton
                      type="primary"
                      size="sm"
                      style={{ textTransform: "none" }}
                    >
                      <i className={'bi-card-checklist'} style={{ fontSize: '10pt', marginRight: '10px'}} />
                      Advanced Search
                    </BxButton>
                  </Grid>   
                  <Grid item xm={4}>
                    <ToggleButtonGroup
                        size="small"
                        aria-label="text alignment"
                        sx={{ marginTop:0, height:'30px',  backgroundColor:'whitesmoke'}}
                        >
                        <ToggleButton value="left" aria-label="left aligned" onClick={()=> setdisplayPageSize(12)} hint="Pagesize: 12">
                            12
                        </ToggleButton>
                        <ToggleButton value="center" aria-label="centered" onClick={()=> setdisplayPageSize(20)}>
                            20
                        </ToggleButton>
                        <ToggleButton value="right" aria-label="right aligned" onClick={()=> setdisplayPageSize(50)}>
                            50
                        </ToggleButton>
                        <ToggleButton value="justify" aria-label="justified" onClick={()=> setdisplayPageSize(100)}>
                            100
                        </ToggleButton>
                        <ToggleButton  value="justify" aria-label="justified" onClick={()=> setdisplayFilterRow(!displayFilterRow)}>
                            <i className={'bi-binoculars-fill'} style={{ color:'darkslategray', fontSize: '12pt'}} />
                        </ToggleButton>
                        <ToggleButton value="justify" aria-label="justified" onClick={()=> setdisplayGroupPanel(!displayGroupPanel)}>
                            <i className={'bi-bar-chart-steps'} style={{ color:'darkslategray', fontSize: '12pt'}} />
                        </ToggleButton>
                        </ToggleButtonGroup>
                  </Grid>   
                                                   
                </Grid>
                   
                <Box margin={1}>
                    <DataGrid
                    dataSource={Employees}
                    showBorders={false}
                    showRowLines={true}
                    showColumnLines={false}
                    highlightChanges={true}
                    rowAlternationEnabled={true}
                    autoNavigateToFocusedRow={true}
                    allowColumnReordering={true}
                    allowColumnResizing={true}
                    columnAutoWidth={true}
                    keyExpr="EmployeeId"
                    focusedRowEnabled={true}
                    onSelectionChanged={rowSelectionFunction}
                    >
                    <Selection mode="multiple" deferred={true} />
                    <Paging enabled={true} pageSize={displayPageSize} />
                    <SearchPanel visible={true} />
                    <GroupPanel visible={displayGroupPanel} />
                    <FilterRow visible={displayFilterRow} />
                    <HeaderFilter visible={true}/>
                    <ColumnChooser enabled={true} />

                    <Export enabled={true}   />
                    <Column caption="" cellRender={RenderCheckerStatus}/>
                    <Column caption="" cellRender={RenderActiveStatus}/>

                   
                    <Column dataField="EmployeeId" caption="Emp ID" />
                    <Column dataField="FirstName" visible={getColumnVisibility('FirstName')} />
                    <Column dataField="LastName" visible={getColumnVisibility('LastName')}/>
                    <Column dataField="EmailId" />
                    <Column dataField="JoiningDate" dataType="date" />
                    <Column dataField="PhoneNumber"   />
                    <Column dataField="Salary" dataType="number" />
                    
                    <Column type="buttons" width={150}>
                        <Button name="FWedit" text="Edit"   hint="Edit Record" onClick={editIconClick} >
                            <i className={'bi-pencil-square'} style={{color:'indigo', fontSize: '10pt', marginRight: '5px'}} />
                        </Button>
                        <Button name="FWdelete" text="Delete"  hint="Delete Record" onClick={deleteIconClick} >
                            <i className={'bi-trash3-fill'} style={{color:'indigo', fontSize: '10pt', marginRight: '5px'}} />
                        </Button>
                
                    </Column>
                    </DataGrid>
                </Box>
        </Box>


    );
}